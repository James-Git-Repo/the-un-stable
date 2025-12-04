import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyRequest {
  articleId: number;
  articleTitle: string;
  articleSubtitle: string;
  articleSlug: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { articleId, articleTitle, articleSubtitle, articleSlug }: NotifyRequest = await req.json();
    
    console.log(`Notifying subscribers about article: ${articleTitle}`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from("Newsletter Sub")
      .select("email");

    if (fetchError) {
      console.error("Error fetching subscribers:", fetchError);
      throw fetchError;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No subscribers found");
      return new Response(
        JSON.stringify({ message: "No subscribers to notify" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Sending notifications to ${subscribers.length} subscribers`);

    const articleUrl = `https://the-un-stable.net/post/${articleSlug}`;

    // Send email to each subscriber
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        await resend.emails.send({
          from: "The (un)Stable Net <onboarding@resend.dev>",
          replyTo: "the.un.stablenet@gmail.com",
          to: [subscriber.email],
          subject: `New Article: ${articleTitle}`,
          html: `
            <div style="font-family: 'Bodoni MT', Georgia, serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333; font-size: 28px; margin-bottom: 16px;">${articleTitle}</h1>
              ${articleSubtitle ? `<p style="color: #666; font-size: 18px; margin-bottom: 24px;">${articleSubtitle}</p>` : ''}
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                A new article has been published on The (un)Stable Net. Click the link below to read it:
              </p>
              <a href="${articleUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-size: 16px;">
                Read Article
              </a>
              <p style="color: #999; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                You're receiving this email because you subscribed to The (un)Stable Net newsletter.
              </p>
            </div>
          `,
        });
        console.log(`Email sent to ${subscriber.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
      }
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ message: `Notifications sent to ${subscribers.length} subscribers` }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-subscribers function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
