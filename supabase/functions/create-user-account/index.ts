// Supabase Edge Function: create-user-account
// Securely provisions student, teacher, or parent accounts using Supabase Service Role Key

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

serve(async (req) => {
  try {
    const { full_name, email, role, phone, password } = await req.json()

    if (!email || !role) {
      return new Response(JSON.stringify({ error: "Email and role are required" }), { status: 400 })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    if (!supabaseServiceKey) {
      console.warn("SUPABASE_SERVICE_ROLE_KEY missing. Simulating account creation.")
      return new Response(JSON.stringify({ 
        success: true, 
        simulated: true, 
        user: { id: `usr-${Date.now()}`, email, role } 
      }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // 1. Create auth user with default password or provided password
    const userPassword = password || "Academy2026!"
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: userPassword,
      email_confirm: true,
      user_metadata: { full_name, role }
    })

    if (userError) throw userError

    // 2. Insert/update profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userData.user.id,
        full_name,
        email,
        role,
        phone: phone || null,
        is_active: true
      })
      .select()
      .single()

    if (profileError) throw profileError

    return new Response(JSON.stringify({ success: true, profile: profileData }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
