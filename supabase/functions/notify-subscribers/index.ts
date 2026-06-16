import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { z } from "https://esm.sh/zod@3.23.8";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const NotifySchema = z.object({
  articleId: z.number().int().positive(),
  articleTitle: z.string().trim().min(1).max(200),
  articleSubtitle: z.string().trim().max(500).optional().default(""),
  articleSlug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require auth + editor/admin role
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claims.claims.sub;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: isEditor } = await supabase.rpc("has_role", { _user_id: userId, _role: "editor" });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isEditor && !isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = NotifySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { articleTitle, articleSubtitle, articleSlug } = parsed.data;
    const safeTitle = escapeHtml(articleTitle);
    const safeSubtitle = escapeHtml(articleSubtitle || "");

    // Fetch all subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from("Newsletter Sub")
      .select("email");

    if (fetchError) {
      console.error("Error fetching subscribers:", fetchError);
      throw fetchError;
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subscribers to notify" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const articleUrl = `https://the-un-stable.net/post/${articleSlug}`;

    // Send email to each subscriber
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        await resend.emails.send({
          from: "The (un)Stable Net <onboarding@resend.dev>",
          replyTo: "the.un.stablenet@gmail.com",
          to: [subscriber.email],
          subject: `New Article: ${articleTitle}`.slice(0, 200),
          html: `
            <div style="font-family: 'Bodoni MT', Georgia, serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333; font-size: 28px; margin-bottom: 16px;">${safeTitle}</h1>
              ${safeSubtitle ? `<p style="color: #666; font-size: 18px; margin-bottom: 24px;">${safeSubtitle}</p>` : ''}
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
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
