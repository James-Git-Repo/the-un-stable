import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-welcome-email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: WelcomeEmailRequest = await req.json();
    console.log("Sending welcome email to:", email);

    const emailResponse = await resend.emails.send({
      from: "The (un)Stable Net <the.un.stablenet@gmail.com>",
      to: [email],
      subject: "Welcome to The (un)Stable Net Weekly Briefing",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <p style="font-size: 16px; line-height: 1.6;">Hi there,</p>
          
          <p style="font-size: 16px; line-height: 1.6;">Thank you for signing up to <strong>The (un)Stable Net Weekly Briefing</strong>. I'm really glad to have you here.</p>
          
          <p style="font-size: 16px; line-height: 1.6;">Every week, you'll receive a sharp and honest snapshot of what's moving the European markets: signals, context, patterns, and the occasional contrarian thought. No noise, no filler, just something worth reading.</p>
          
          <p style="font-size: 16px; line-height: 1.6;">While you're here, if you're curious about the creative side of this project, you might enjoy exploring <strong>The AI Billboard Project</strong>. It's a long-term digital art experiment where people can reserve space on The AI Billboard Project, either as part of the artwork or as a unique advertising spot.</p>
          
          <p style="font-size: 16px; line-height: 1.6;">If that sounds interesting, you can take a look here:<br>
          👉 <a href="https://msab.the-un-stable.net/" style="color: #2563eb; text-decoration: underline;">https://msab.the-un-stable.net/</a></p>
          
          <p style="font-size: 16px; line-height: 1.6;">If you ever have ideas, questions, or just want to say hi, feel free to reply to any email.</p>
          
          <p style="font-size: 16px; line-height: 1.6;">Welcome again and see you in this week's briefing.</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">Jacopo</p>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
