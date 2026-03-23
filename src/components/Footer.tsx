import Contact from "./Contact";

export default function Footer() {
  return (
    <div className="container">
      <div className="flex justify-center">
        <Contact />
      </div>
      <div className="flex justify-between text-[var(--text-hovered)] text-xs">
        <span>© 2026, Han Pham</span>
        <span>
          <a
            href="https://github.com/hanpham32/my-personal-website-2026"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
          </a>
        </span>
      </div>
    </div>
  );
}
