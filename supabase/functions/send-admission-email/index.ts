// Supabase Edge Function: send-admission-email
// Triggered by Admin when approving or rejecting an application via Resend API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const { applicantEmail, applicantName, status, adminNotes, programApplied } = await req.json()

    if (!applicantEmail) {
      return new Response(JSON.stringify({ error: "Missing applicantEmail" }), { status: 400 })
    }

    const subject = status === 'approved'
      ? 'Congratulations! Your Admission Application is Approved - Girls Academy'
      : 'Update on Your Admission Application - Girls Academy'

    const body = status === 'approved'
      ? `Dear ${applicantName},\n\nWe are pleased to inform you that your application for "${programApplied}" has been APPROVED.\n\n${adminNotes ? 'Admissions Board Remarks: ' + adminNotes + '\n\n' : ''}Please visit our campus or reply to this email to complete your enrollment documentation and fee registration.\n\nWarm regards,\nGirls Academy Admissions Committee\nCambridge Campus`
      : `Dear ${applicantName},\n\nThank you for your interest in Girls Academy. After thorough review by the Academic Admissions Board, we regret to inform you that your application for "${programApplied}" was not approved for the current matriculation cycle.\n\n${adminNotes ? 'Feedback: ' + adminNotes + '\n\n' : ''}You are encouraged to reapply in our upcoming spring evaluation cycle.\n\nWarm regards,\nGirls Academy Admissions Committee`

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not configured. Simulating email transmission.")
      return new Response(JSON.stringify({ success: true, simulated: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Girls Academy <admissions@girlsacademy.edu>',
        to: applicantEmail,
        subject,
        text: body,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
