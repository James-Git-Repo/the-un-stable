import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEditor } from "@/contexts/EditorContext";
import { SafeHTML } from "@/components/SafeHTML";
import { useToast } from "@/hooks/use-toast";
import { CommentSection } from "@/components/CommentSection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Post = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { session } = useEditor();
  const { toast } = useToast();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
    } else {
      setPost(data);
      
      // Fetch related posts - same tag first, then backfill with recent
      if (data) {
        const { data: sameTag } = await supabase
          .from('Articles')
          .select('*')
          .eq('tag', data.tag)
          .neq('id', data.id)
          .order('published_at', { ascending: false })
          .limit(3);
        
        let combined = sameTag || [];
        
        if (combined.length < 3) {
          const excludeIds = [data.id, ...combined.map(a => a.id)];
          const { data: recent } = await supabase
            .from('Articles')
            .select('*')
            .not('id', 'in', `(${excludeIds.join(',')})`)
            .order('published_at', { ascending: false })
            .limit(3 - combined.length);
          
          combined = [...combined, ...(recent || [])];
        }
        
        setRelatedPosts(combined);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const handleDelete = async () => {
    if (!post) return;
    
    const { error } = await supabase
      .from('Articles')
      .delete()
      .eq('id', post.id);

    if (error) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Article deleted',
        description: 'The article has been removed.',
      });
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <Link to="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <Link to="/" className="inline-flex items-center text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all articles
        </Link>
        
        {session && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/newsletter/${post.id}/edit`, { state: { article: post } })}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <article className="max-w-3xl mx-auto">
        {post.image_url && (
          <div className="mb-6 sm:mb-8 overflow-hidden rounded-lg">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 text-xs sm:text-sm font-body font-medium rounded-none bg-primary/10 text-primary mb-3 sm:mb-4">
            {post.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-body font-bold mb-3 sm:mb-4 leading-tight">{post.title}</h1>
          <p className="text-lg sm:text-xl font-body text-muted-foreground mb-4 sm:mb-6">{post.subtitle}</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-body text-muted-foreground">
            <span>{post.author}</span>
            <span>•</span>
            <span>
              {new Date(post.published_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{post.read_time}</span>
          </div>
        </div>

        <SafeHTML 
          html={post.content}
          className="prose prose-base sm:prose-lg dark:prose-invert max-w-none mb-8 sm:mb-10 md:mb-12 
                     [&_p:empty]:min-h-[1rem]
                     [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold
                     [&_ul]:!list-disc [&_ul]:!pl-10 [&_ol]:!list-decimal [&_ol]:!pl-10
                     [&_li]:!list-item [&_li]:!ml-0
                     [&_img]:rounded-lg [&_img]:my-4"
        />

        <div className="border-t border-border pt-6 sm:pt-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/subscribe" className="flex-1">
              <Button className="w-full" size="lg">
                Subscribe to Newsletter
              </Button>
            </Link>
            <Link to="/contribute" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                Contribute an Article
              </Button>
            </Link>
          </div>
        </div>

        <CommentSection articleId={post.id} />

        {relatedPosts.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12">
            <h2 className="text-xl sm:text-2xl font-body font-bold mb-4 sm:mb-6">Continue Reading</h2>
            <div className="grid gap-4">
              {relatedPosts.map((related) => (
                <Link key={related.id} to={`/post/${related.slug}`}>
                  <Card className="flex flex-col sm:flex-row overflow-hidden hover:shadow-lg transition-shadow">
                    {related.image_url && (
                      <div className="sm:w-48 sm:min-w-[12rem] aspect-video sm:aspect-auto overflow-hidden">
                        <img
                          src={related.image_url}
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 sm:p-5 flex flex-col justify-center">
                      <span className="inline-block w-fit px-2.5 py-0.5 text-xs font-body font-medium uppercase tracking-wide bg-primary/5 text-primary border border-primary/20 rounded-none mb-2">
                        {related.tag}
                      </span>
                      <h3 className="text-lg font-body font-bold mb-1 hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm font-body text-muted-foreground mb-2 line-clamp-2 text-justify">{related.subtitle}</p>
                      <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                        <span>{new Date(related.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                        <span>•</span>
                        <span>{related.read_time}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{post.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default Post;
