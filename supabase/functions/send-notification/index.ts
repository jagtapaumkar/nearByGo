import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { user_id, type, title, message, metadata, send_email = false, send_sms = false } = await req.json()

    // Create database notification
    const { data: notification, error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id,
        type,
        title,
        message,
        metadata
      })
      .select()
      .single()

    if (notificationError) throw notificationError

    // Get user details for email/SMS
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user_id)
      .single()

    const { data: { user }, error: userError } = await supabaseClient.auth.admin.getUserById(user_id)
    
    const responses = {
      notification,
      email_sent: false,
      sms_sent: false
    }

    // Send email notification
    if (send_email && user?.email) {
      try {
        // In production, integrate with email service like SendGrid, Resend, etc.
        // For now, just log the email that would be sent
        console.log('Email would be sent to:', user.email)
        console.log('Subject:', title)
        console.log('Body:', message)
        responses.email_sent = true
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
      }
    }

    // Send SMS notification
    if (send_sms && profile?.phone) {
      try {
        // In production, integrate with SMS service like Twilio, AWS SNS, etc.
        // For now, just log the SMS that would be sent
        console.log('SMS would be sent to:', profile.phone)
        console.log('Message:', `${title}: ${message}`)
        responses.sms_sent = true
      } catch (smsError) {
        console.error('SMS sending failed:', smsError)
      }
    }

    return new Response(
      JSON.stringify(responses),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})