import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HandWaveIcon } from "./icons/HandWaveIcon";
import { Separator } from "./ui/separator";
import { useState, type Dispatch, type SetStateAction } from "react";

function Item({
  name,
  setBgColor,
  setHoverIcon,
  color,
  icon,
}: {
  name: string;
  setBgColor: Dispatch<SetStateAction<string>>;
  setHoverIcon: Dispatch<SetStateAction<string>>;
  color: string;
  icon: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex justify-between pr-2"
      onMouseEnter={() => {
        setIsHovered(true);
        setBgColor(color);
        setHoverIcon(icon);
      }}
      onMouseLeave={() => {
        //TODO: signal hand to wave
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
    </div>
  );
}

export default function Contact() {
  const [bgColor, setBgColor] = useState<string>("");
  const [hoverIcon, setHoverIcon] = useState<string>("");

  return (
    <div
      className="container p-6 rounded-sm grid grid-cols-2 h-48 w-6/7 bg-surface"
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <div className="flex flex-col justify-center items-center">
        <p className={`text-2xl font-semibold ${bgColor ? "text-white" : ""}`}>
          Contact
        </p>
        {hoverIcon ? (
          <img
            src={hoverIcon}
            className={`invert w-16 h-16 ${hoverIcon === "/email-svgrepo-com.svg" ? "rotate-15" : "-rotate-15"}`}
            alt=""
          />
        ) : (
          <HandWaveIcon />
        )}
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <Item
          name="Email"
          setBgColor={setBgColor}
          setHoverIcon={setHoverIcon}
          color="#4C8CE4"
          icon="/email-svgrepo-com.svg"
        />
        <Separator />
        <Item
          name="GitHub"
          setBgColor={setBgColor}
          setHoverIcon={setHoverIcon}
          color="#8100D1"
          icon="/github-svgrepo-com.svg"
        />
        <Separator />
        <Item
          name="Bluesky"
          setBgColor={setBgColor}
          setHoverIcon={setHoverIcon}
          color="#008BFF"
          icon=""
        />
      </div>
    </div>
  );
}
