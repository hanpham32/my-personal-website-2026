import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { NightModeIcon } from "./components/icons/NightModeIcon";
import { HomePage } from "./pages/HomePage";
import { BlogPage } from "./pages/BlogPage";
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
  { href: "", alt: "github", title: "GitHub" },
  { href: "", alt: "bluesky", title: "Bluesky" },
  { href: "", alt: "twitter", title: "Twitter" },
  { href: "", alt: "linkedin", title: "LinkedIn" },
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
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold">
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
        <div className="my-4">
          {navItems.map((item) => (
            <Link
              key={item.alt}
              to={item.href}
              className="mr-2 font-light text-sm uppercase hover:text-text-hovered transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </div>
        <hr className="border-border" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
