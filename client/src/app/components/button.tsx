import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { classNameMerge } from "~/app/utils/class-name-merge";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const getVariantClasses = (variant: "primary" | "outline") => {
  switch (variant) {
    case "outline":
      return "border border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50";
    default:
      return "bg-indigo-500 text-white hover:bg-indigo-400";
  }
};

const getSizeClasses = (size: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm":
      return "px-2 py-1 text-sm";
    case "lg":
      return "px-4 py-3 text-lg";
    default:
      return "px-3 py-1.5 text-[15px]";
  }
};

export const baseButtonClassName =
  "font-medium flex justify-center focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-300 transition-colors rounded-xl";

export const Button = ({
  children,
  className,
  disabled,
  isLoading,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNameMerge(
        baseButtonClassName,
        getVariantClasses(variant),
        getSizeClasses(size),
        (disabled || isLoading) && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <LoaderCircle size={22} className="animate-spin" aria-label="Loading..." />
      ) : (
        children
      )}
    </button>
  );
};
