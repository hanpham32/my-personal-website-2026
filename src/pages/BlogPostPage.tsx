import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { getPostBySlug, formatDate, type BlogPost } from "../lib/blog";

function extractTweetId(content: string): { before: string; tweetId: string | null; after: string } {
  const regex = /<blockquote class="twitter-tweet"[^>]*>[\s\S]*?status[=:]\s*["']?(\d+)[\s\S]*?<\/blockquote>/i;
  const match = content.match(regex);
  
  if (!match) {
    return { before: content, tweetId: null, after: "" };
  }
  
  const fullMatch = match[0];
  const tweetId = match[1];
  const index = match.index || 0;
  
  return {
    before: content.slice(0, index),
    tweetId,
    after: content.slice(index + fullMatch.length),
  };
}

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      const result = await getPostBySlug(slug!);
      setPost(result);
      setLoading(false);
    }
    loadPost();
  }, [slug]);

  const { before, tweetId, after } = useMemo(() => {
    if (!post) return { before: "", tweetId: null, after: "" };
    return extractTweetId(post.content);
  }, [post]);

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <p>Post not found</p>
        <Link to="/blog" className="text-text-hovered hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  const tags = post.tags.map((tag) => `#${tag}`).join(" ");

  return (
    <div className="container">
      <Link
        to="/blog"
        className="text-sm text-text-secondary hover:text-text-hovered transition-colors mb-4 inline-block"
      >
        ← Back to blog
      </Link>

      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm text-text-secondary font-mono">
            {formatDate(post.date)}
          </span>
          <span className="text-sm text-text-secondary">{tags}</span>
        </div>
        <h1 className="text-2xl font-light">{post.title}</h1>
      </div>

      <article className="blog-content">
        {before && (
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {before}
          </ReactMarkdown>
        )}
        
        {tweetId && (
          <div className="my-4">
            <TwitterTweetEmbed tweetId={tweetId} options={{ theme: "dark" }} />
          </div>
        )}
        
        {after && (
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {after}
          </ReactMarkdown>
        )}
      </article>
    </div>
  );
}
