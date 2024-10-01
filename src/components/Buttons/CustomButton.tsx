import React from "react";
import PropTypes from "prop-types";
import { ButtonVariants } from "@/utils/types"

const buttonBaseClass =
  "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold ";

const buttonVariants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 shadow-md",
  secondary:
    "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 shadow-sm",
  tertiary:
    "text-gray-500 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 hover:bg-gray-100 bg-white ",
  tertiaryWarning:
    "bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 hover:shadow-sm",
  warning:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 shadow-md",
  disabled: "bg-gray-300 text-gray-600 cursor-not-allowed",
};

type CustomButtonProps = {
  variant?: ButtonVariants;
  className?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconPosition?: string;
  children?: React.ReactNode;
  href?: string;
  onClick?: (e: any) => void;
  type?: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

const CustomButton = ({
  variant = "primary",
  className = "",
  icon: Icon,
  iconPosition = "before",
  children,
  href,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = true,
}: CustomButtonProps) => {
  const variantClasses = buttonVariants[variant] || buttonVariants.primary;
  const Component = href ? "a" : "button";
  const iconOnly = !children && Icon;
  const iconClass = iconOnly
    ? "h-5 w-5"
    : `h-5 w-5 ${iconPosition === "before" ? "mr-1.5" : "ml-1.5"}`;
  if (variant === "disabled") {
    disabled = true;
  }
  const widthClass = fullWidth ? "w-full" : "w-auto";

  // Common props for both 'a' and 'button' elements, including onClick and type
  const commonProps = {
    className: `${buttonBaseClass} ${widthClass} ${variantClasses} ${className}`,
    onClick, // pass onClick handler
    ...(href && { href }), // conditionally add href if it exists
    ...(Component === "button" && {
      type: type as "button" | "submit" | "reset",
    }), // conditionally add type if it is a button
    disabled,
  };

  return (
    <Component {...commonProps}>
      {Icon && iconPosition === "before" && (
        <Icon className={iconClass} aria-hidden="true" />
      )}
      {children}
      {Icon && iconPosition === "after" && (
        <Icon className={iconClass} aria-hidden="true" />
      )}
    </Component>
  );
};

export default CustomButton;
