import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className="flex items-center gap-1 cursor-pointer font-light text-sm uppercase hover:text-text-hovered transition-colors bg-transparent border-none p-0"
      >
        <span>{title}</span>
        <Icon 
          className="w-3 h-3 transition-transform duration-200" 
          style={{ transform: isOpen ? 'rotate(180deg)' : undefined }} 
        />
      </button>
      <div
        className={`absolute left-0 top-full mt-2 rounded shadow-lg min-w-[120px] py-1 z-50 ${
          isOpen ? 'block' : 'hidden'
        } group-hover:block`}
        style={{ backgroundColor: "var(--surface)" }}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsOpen(false)}
            className="block px-3 py-1.5 text-sm font-light uppercase whitespace-nowrap"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
