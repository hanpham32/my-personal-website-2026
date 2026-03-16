export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function parseFrontmatter(rawContent: string): {
  metadata: { title: string; date: string; tags: string[] };
  content: string;
} {
  const frontmatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    return {
      metadata: { title: "", date: "", tags: [] },
      content: rawContent,
    };
  }

  const [, frontmatter, content] = frontmatterMatch;
  const metadata: { title: string; date: string; tags: string[] } = {
    title: "",
    date: "",
    tags: [],
  };

  frontmatter.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    const value = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
    
    if (key === "title") metadata.title = value;
    if (key === "date") metadata.date = value;
    if (key === "tags") {
      try {
        metadata.tags = JSON.parse(value);
      } catch {
        metadata.tags = [];
      }
    }
  });

  return { metadata, content };
}

function getSlugFromPath(filepath: string): string {
  const filename = filepath.split("/").pop() || "";
  return filename.replace(".md", "");
}

const postModules = import.meta.glob("../content/blog/*.md", { query: "?raw", eager: true });

export async function getAllPosts(): Promise<BlogPost[]> {
  const modules = postModules as Record<string, { default: string }>;
  
  const posts: BlogPost[] = Object.entries(modules).map(([filepath, mod]) => {
    const rawContent = mod.default;
    const { metadata, content } = parseFrontmatter(rawContent);
    const slug = getSlugFromPath(filepath);

    return {
      slug,
      title: metadata.title,
      date: metadata.date,
      tags: metadata.tags,
      content,
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const modules = postModules as Record<string, { default: string }>;
  
  for (const [filepath, mod] of Object.entries(modules)) {
    const fileSlug = getSlugFromPath(filepath);
    if (fileSlug === slug) {
      const rawContent = mod.default;
      const { metadata, content } = parseFrontmatter(rawContent);
      return {
        slug,
        title: metadata.title,
        date: metadata.date,
        tags: metadata.tags,
        content,
      };
    }
  }
  
  return null;
}

export { formatDate };
