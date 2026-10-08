// Supabase Edge Function: notify-admin-new-application
// Triggered on new row insertion into `admissions` table via DB Webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const payload = await req.json()
    const record = payload.record || payload

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@girlsacademy.edu'
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    const subject = `[New Admission Dossier] ${record.student_name} - ${record.program_applied || 'General'}`
    const body = `New Online Admission Application Received:\n\nApplicant: ${record.student_name}\nEmail: ${record.email}\nPhone: ${record.phone || 'N/A'}\nParent: ${record.parent_name || 'N/A'} (${record.parent_phone || 'N/A'})\nProgram: ${record.program_applied || 'N/A'}\nPrevious School: ${record.previous_school || 'N/A'}\n\nPlease review this application in the Admin Admissions Portal.\n\nGirls Academy Automated Dispatch`

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not set. Simulating notification to admin.")
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
        from: 'Girls Academy Portal <system@girlsacademy.edu>',
        to: adminEmail,
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
