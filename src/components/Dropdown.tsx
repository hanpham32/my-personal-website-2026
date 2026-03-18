import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface DropdownItem {
  href: string;
  title: string;
}

interface DropdownProps {
  title: string;
  icon: LucideIcon;
  items: DropdownItem[];
}

export function Dropdown({ title, icon: Icon, items }: DropdownProps) {
  return (
    <div className="relative group">
      <style>{`
        .dropdown-bridge::before {
          content: '';
          position: absolute;
          top: -0.5rem;
          left: 0;
          right: 0;
          height: 0.5rem;
        }
      `}</style>
      <div className="flex items-center gap-1 cursor-pointer font-light text-sm uppercase hover:text-text-hovered transition-colors">
        <span>{title}</span>
        <Icon className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
      </div>
      <div
        className="dropdown-bridge absolute left-0 top-full mt-2 hidden group-hover:block rounded shadow-lg min-w-[120px] py-1 z-50"
        style={{ backgroundColor: "var(--surface)" }}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="block px-3 py-1.5 text-sm font-light uppercase whitespace-nowrap"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
