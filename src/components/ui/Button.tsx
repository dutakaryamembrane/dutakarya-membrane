"use client";

import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "cta" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const baseStyle =
      "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300";

    const variantStyle = {
      primary:
        "bg-[#171717] !text-white hover:bg-[#2a2a2a] hover:-translate-y-0.5",

      cta:
        "bg-[#b89452] !text-white hover:bg-[#a98345] hover:-translate-y-0.5",

      outline:
        "border border-[#171717]/20 bg-white !text-[#171717] hover:bg-[#171717] hover:!text-white",
    }[variant];

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variantStyle} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";