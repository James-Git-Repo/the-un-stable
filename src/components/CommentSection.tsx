import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";
import { useEditor } from "@/contexts/EditorContext";

interface Comment {
  id: string;
  user_name: string;
  user_email: string;
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  articleId: number;
}

export const CommentSection = ({ articleId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { session } = useEditor();

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("article_id", articleId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("comments").insert({
        article_id: articleId,
        user_name: name.trim(),
        user_email: email.trim(),
        content: content.trim(),
      });

      if (error) throw error;

      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully.",
      });

      setName("");
      setEmail("");
      setContent("");
      fetchComments();
    } catch (error) {
      toast({
        title: "Failed to post comment",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast({
        title: "Comment deleted",
        description: "The comment has been removed.",
      });

      fetchComments();
    } catch (error) {
      toast({
        title: "Failed to delete comment",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="text-3xl font-bold mb-8">Comments ({comments.length})</h2>

      <form onSubmit={handleSubmit} className="mb-12 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      {isLoading ? (
        <p className="text-muted-foreground">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{comment.user_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {session && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(comment.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
