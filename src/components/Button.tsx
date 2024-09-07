"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

type ButtonProps = {
  loading?: boolean;
  text?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  category?:
    | "primary"
    | "secondary"
    | "danger"
    | "white"
    | "bordered"
    | "transparent";
  width?: string;
  onClick?: () => void;
  className?: string;
  role?: "button" | "link";
  href?: string;
  padding?: string;
  children?: any;
  link?: string;
};

export function Button({
  loading,
  onClick,
  text,
  type = "button",
  disabled,
  category = "primary",
  width = "w-full",
  className,
  role = "button",
  href,
  padding,
  children,
  link,
}: ButtonProps) {
  const router = useRouter();

  const colors = {
    primary: "bg-black text-white hover:bg-gray-800 transform transition-all",
    secondary:
      "bg-primary text-white hover:bg-blue-700 transform transition-all",
    danger: "text-white border-red-400 border bg-black",
    white: "bg-white text-black",
    bordered: "bg-transparent text-white border border-gray-100",
    transparent: "bg-transparent text-black border border-gray-400",
  };

  if (role === "link") {
    return (
      <Link
        href={href || "/"}
        className={`font-medium rounded ${
          padding ? padding : "px-4 py-2"
        } flex items-center justify-center ${
          colors[category]
        } ${width} ${className} ${
          disabled ? "cursor-not-allowed opacity-70" : ""
        }`}
        onClick={onClick}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled || loading}
      className={`font-medium rounded ${
        padding ? padding : "px-4 py-2"
      } flex items-center justify-center ${
        colors[category]
      } ${width} ${className} ${
        disabled ? "cursor-not-allowed opacity-70" : ""
      }`}
      type={type}
      onClick={onClick}
    >
      {loading ? (
        <ClipLoader size={22} color="#fb923c" />
      ) : children ? (
        children
      ) : (
        <>{text}</>
      )}
    </button>
  );
}
