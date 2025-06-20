import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const body = await req.json();
    const { type } = body;

    // Get user ID for authentication
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "email") {
      // Mock email service - replace with real email provider (SendGrid, AWS SES, etc.)
      const { to, cc, bcc, subject, htmlContent, textContent, attachments } =
        body;

      console.log("Sending email:", {
        to,
        subject,
        timestamp: new Date().toISOString(),
      });

      // In a real implementation, you would integrate with an email service:
      // const emailService = new SendGridAPI(Deno.env.get('SENDGRID_API_KEY'))
      // await emailService.send({ to, subject, html: htmlContent })

      // For now, we'll just log and return success
      return new Response(
        JSON.stringify({
          success: true,
          messageId: `email_${Date.now()}`,
          message: "Email sent successfully",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (type === "sms") {
      // Mock SMS service - replace with real SMS provider (Twilio, AWS SNS, etc.)
      const { to, message } = body;

      console.log("Sending SMS:", {
        to,
        message: message.substring(0, 50) + "...",
        timestamp: new Date().toISOString(),
      });

      // In a real implementation, you would integrate with an SMS service:
      // const smsService = new TwilioAPI(Deno.env.get('TWILIO_SID'), Deno.env.get('TWILIO_TOKEN'))
      // await smsService.send({ to, body: message })

      return new Response(
        JSON.stringify({
          success: true,
          messageId: `sms_${Date.now()}`,
          message: "SMS sent successfully",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid notification type" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Notification error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
