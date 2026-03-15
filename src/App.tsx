import { useEffect, useState } from "react";
import { NightModeIcon } from "./components/icons/NightModeIcon";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const pages = [
  {
    href: "/",
    alt: "home",
    title: "Home",
  },
  {
    href: "",
    alt: "github",
    title: "GitHub",
  },
  {
    href: "/blog",
    alt: "blog",
    title: "Blog",
  },
  {
    href: "",
    alt: "bluesky",
    title: "Bluesky",
  },
  {
    href: "",
    alt: "twitter",
    title: "Twitter",
  },
  {
    href: "",
    alt: "linkedin",
    title: "LinkedIn",
  },
  {
    href: "",
    alt: "experience",
    title: "Experience",
  },
  {
    href: "",
    alt: "projects",
    title: "Projects",
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
        {pages.map((item) => (
          <a
            className="mr-2 font-light text-sm uppercase hover:text-text-hovered transition-colors"
            href={item.href}
          >
            {item.title}
          </a>
        ))}
      </div>
      <hr className="border-border" />
    </div>
  );
}

export default App;
