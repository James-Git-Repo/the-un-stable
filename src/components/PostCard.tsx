import { Link } from "react-router-dom";
import { ArrowRight, Trash2, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEditor } from "@/contexts/EditorContext";

interface PostCardProps {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  content?: string;
  author?: string;
  dek: string;
  tag: string;
  date: string;
  readTime: string;
  coverUrl: string;
  onDelete?: () => void;
  onEdit?: (article: any) => void;
}

export const PostCard = ({ id, slug, title, subtitle, content, author, dek, tag, date, readTime, coverUrl, onDelete, onEdit }: PostCardProps) => {
  const { isEditorMode } = useEditor();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('Articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Article deleted',
        description: 'The article has been successfully deleted.',
      });

      onDelete?.();
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit({
        id,
        title,
        subtitle: subtitle || '',
        content: content || '',
        tag,
        author: author || 'Editorial Team',
        read_time: readTime,
        image_url: coverUrl,
      });
    }
  };

  return (
    <div className="relative group">
      {isEditorMode && (
        <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="icon"
            className="bg-background"
            aria-label="Edit article"
            onClick={(e) => {
              e.preventDefault();
              handleEdit();
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                aria-label="Delete article"
                onClick={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Article</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      )}
      
      <Link to={`/post/${slug}`} className="block">
        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 transform">
          <div className="aspect-video overflow-hidden">
            <img 
              src={coverUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-5">
            <div className="mb-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-body font-medium uppercase tracking-wide bg-primary/5 text-primary border border-primary/20 rounded-none">
                {tag}
              </span>
            </div>
            
            <h3 className="text-lg font-body font-bold mb-2 line-clamp-2">
              {title}
            </h3>
            
            <p className="text-sm font-body text-muted-foreground mb-4 line-clamp-2">
              {dek}
            </p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>{date}</span>
                <span>•</span>
                <span>{readTime}</span>
              </div>
              
              <div className="flex items-center gap-1 text-primary font-medium uppercase tracking-wide text-xs">
                Read
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};
