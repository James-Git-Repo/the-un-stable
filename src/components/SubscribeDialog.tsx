import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscribeDialog = ({ open, onOpenChange }: SubscribeDialogProps) => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      toast({
        title: "Consent required",
        description: "Please agree to receive our newsletter.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('Newsletter Sub')
        .insert({
          email: email,
          policy_agreement: consent,
        });

      if (error) throw error;

      // Send welcome email
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: { email }
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }

      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our next newsletter soon.",
      });
      setEmail("");
      setConsent(false);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl">Subscribe to The (un)Stable Net</DialogTitle>
          <DialogDescription>
            Get actionable briefs across EU markets delivered to your inbox.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
            />
            <label
              htmlFor="consent"
              className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
            >
              I agree to receive newsletters from The (un)Stable Net. I can unsubscribe at any time.
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe Now"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            We respect your privacy. No spam, ever.
          </p>
        </form>

        <div className="mt-6 grid gap-4 sm:grid-cols-3 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-primary mb-1">Weekly</div>
            <p className="text-xs text-muted-foreground">Delivery</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">5 min</div>
            <p className="text-xs text-muted-foreground">Read time</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">0 spam</div>
            <p className="text-xs text-muted-foreground">Guaranteed</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
