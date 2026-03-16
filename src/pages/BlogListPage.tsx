import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllPosts, formatDate, type BlogPost } from "../lib/blog";

export function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPosts()
      .then((result) => {
        setPosts(result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container">
        <p>loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="space-y-4">
        {posts.map((post) => (
          <BlogListItem key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

function BlogListItem({ post }: { post: BlogPost }) {
  const tags = post.tags.map((tag) => `#${tag}`).join(" ");

  return (
    <div className="group">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-sm text-text-secondary font-mono">
          {formatDate(post.date)}
        </span>
        <span className="text-sm text-text-secondary">{tags}</span>
      </div>
      <Link
        to={`/blog/${post.slug}`}
        className="text-lg font-light hover:text-text-hovered transition-colors"
      >
        {post.title}
      </Link>
    </div>
  );
}
