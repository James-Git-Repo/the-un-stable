import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Archive = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [posts, setPosts] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

  const years = useMemo(() => {
    const yearSet = new Set(
      posts.map((post) => new Date(post.published_at).getFullYear())
    );
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [posts]);

  const [selectedYear, setSelectedYear] = useState<string>("all");

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tag.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = selectedTag === "all" || post.tag === selectedTag;

      const postYear = new Date(post.published_at).getFullYear().toString();
      const matchesYear = selectedYear === "all" || postYear === selectedYear;

      return matchesSearch && matchesTag && matchesYear;
    });

    if (sortBy === "latest") {
      filtered.sort((a, b) => 
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    }

    return filtered;
  }, [searchQuery, selectedTag, selectedYear, sortBy, posts]);

  return (
    <main className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Archive</h1>
      <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8">
        Browse all published articles
      </p>

      <div className="space-y-4 mb-8">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          tags={tags}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Loading articles...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {filteredAndSortedPosts.map((post) => (
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

          {filteredAndSortedPosts.length === 0 && (
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

export default Archive;
