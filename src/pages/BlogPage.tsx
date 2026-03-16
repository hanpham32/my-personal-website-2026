import { Routes, Route } from "react-router-dom";
import { BlogListPage } from "./BlogListPage";
import { BlogPostPage } from "./BlogPostPage";

export function BlogPage() {
  return (
    <Routes>
      <Route index element={<BlogListPage />} />
      <Route path=":slug" element={<BlogPostPage />} />
    </Routes>
  );
}
