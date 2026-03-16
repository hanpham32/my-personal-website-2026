import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { NightModeIcon } from "./components/icons/NightModeIcon";
import { HomePage } from "./pages/HomePage";
import { BlogListPage } from "./pages/BlogListPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import Footer from "./components/Footer";

type Theme = "light" | "dark";
function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const navItems = [
  { href: "/", alt: "home", title: "Home" },
  { href: "/blog", alt: "blog", title: "Blog" },
  { href: "/experience", alt: "experience", title: "Experience" },
  { href: "/projects", alt: "projects", title: "Projects" },
  { href: "https://github.com/hanpham32", alt: "github", title: "GitHub" },
  {
    href: "https://bsky.app/profile/han0x.bsky.social",
    alt: "bluesky",
    title: "Bluesky",
  },
  { href: "https://twitter.com/hanspham_", alt: "twitter", title: "Twitter" },
  {
    href: "https://www.linkedin.com/in/hansopham/",
    alt: "linkedin",
    title: "LinkedIn",
  },
];

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    return stored ?? getSystemTheme();
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <p className="text-xl font-bold text-nowrap">
            Han's Little Corner on the Internet!
          </p>
          <button
            onClick={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
          >
            <NightModeIcon className="w-5 h-5 hover:text-text-hovered transition-colors hover:cursor-pointer" />
          </button>
        </div>
        <div className="my-4 flex flex-wrap gap-x-3 gap-y-1">
          {navItems.map((item) => {
            const isExternal = item.href.startsWith("http");
            if (isExternal) {
              return (
                <a
                  key={item.alt}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-light text-sm uppercase hover:text-text-hovered transition-colors"
                >
                  {item.title}
                </a>
              );
            }
            return (
              <Link
                key={item.alt}
                to={item.href}
                className="font-light text-sm uppercase hover:text-text-hovered transition-colors"
              >
                {item.title}
              </Link>
            );
          })}
        </div>
        <hr className="border-border" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
