import { useState, useMemo, useEffect } from "react";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { useEditor } from "@/contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Newsletter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [posts, setPosts] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useEditor();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
      // Extract unique tags from articles
      const uniqueTags = Array.from(new Set(data?.map(article => article.tag).filter(Boolean))) as string[];
      setTags(uniqueTags);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tag.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = selectedTag === "all" || post.tag === selectedTag;

      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag, posts]);

  return (
    <main className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Newsletter</h1>
        <p className="text-xl text-muted-foreground">European Market Movers — weekly macro & market signals</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          tags={tags}
        />
        
        {session && (
          <Button onClick={() => navigate('/newsletter/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Loading articles...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-12 sm:mb-14 md:mb-16">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                slug={post.slug}
                title={post.title}
                subtitle={post.subtitle}
                content={post.content}
                author={post.author}
                dek={post.subtitle || ''}
                tag={post.tag}
                coverUrl={post.image_url || ''}
                date={new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                readTime={post.read_time}
                onDelete={fetchPosts}
                onEdit={(article) => navigate(`/newsletter/${article.id}/edit`, { state: { article } })}
              />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No articles found matching your criteria.
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Newsletter;
