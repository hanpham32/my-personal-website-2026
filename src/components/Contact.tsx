import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HandWaveIcon } from "./icons/HandWaveIcon";
import { Separator } from "./ui/separator";
import { useState, type Dispatch, type SetStateAction } from "react";

function Item({
  name,
  url,
  setBgColor,
  setHoverIcon,
  color,
  icon,
}: {
  name: string;
  url: string;
  setBgColor: Dispatch<SetStateAction<string>>;
  setHoverIcon: Dispatch<SetStateAction<string>>;
  color: string;
  icon: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-between pr-2 no-underline"
      onMouseEnter={() => {
        setIsHovered(true);
        setBgColor(color);
        setHoverIcon(icon);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setBgColor("");
        setHoverIcon("");
      }}
    >
      <div className={`${isHovered ? "text-white font-semibold" : ""}`}>
        {name}
      </div>
      {isHovered ? (
        <ArrowUpRight
          className={`w-5 h-5 ${isHovered ? "text-white font-semibold" : ""}`}
        />
      ) : (
        <ArrowRight
          className={`w-5 h-5 ${isHovered ? "text-white font-semibold" : ""}`}
        />
      )}
    </a>
  );
}

export default function Contact() {
  const [bgColor, setBgColor] = useState<string>("");
  const [hoverIcon, setHoverIcon] = useState<string>("");

  return (
    <div
      className="container p-6 rounded-sm grid grid-cols-1 md:grid-cols-2 h-auto md:h-48 w-6/7 bg-surface gap-4 md:gap-0"
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <div className="flex flex-col justify-center items-center mb-4 md:mb-0">
        <p className={`text-2xl font-semibold ${bgColor ? "text-white" : ""}`}>
          Contact
        </p>
        {hoverIcon ? (
          <img
            src={hoverIcon}
            className={`invert w-16 h-16 ${hoverIcon === "/bluesky.svg" ? "" : hoverIcon === "/email-svgrepo-com.svg" ? "rotate-15" : "-rotate-15"}`}
            alt=""
          />
        ) : (
          <HandWaveIcon />
        )}
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <Item
          name="Email"
          url="mailto:hanpham3230@gmail.com"
          setBgColor={setBgColor}
          setHoverIcon={setHoverIcon}
          color="#4C8CE4"
          icon="/email-svgrepo-com.svg"
        />
        <Separator />
        <Item
          name="GitHub"
          url="https://github.com/hanpham32"
          setBgColor={setBgColor}
          setHoverIcon={setHoverIcon}
          color="#8100D1"
          icon="/github-svgrepo-com.svg"
        />
        <Separator />
        <Item
          name="Bluesky"
          url="https://bsky.app/profile/han0x.bsky.social"
          setBgColor={setBgColor}
          setHoverIcon={setHoverIcon}
          color="#008BFF"
          icon="/bluesky.svg"
        />
      </div>
    </div>
  );
}
