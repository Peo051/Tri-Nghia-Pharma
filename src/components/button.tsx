import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export interface ButtonProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  primary?: boolean;
  small?: boolean;
  large?: boolean;
}

export default function Button({
  className,
  primary,
  small,
  large,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${
        primary
          ? "bg-primary text-white hover:bg-primary-dark shadow-sm"
          : "bg-primary-soft text-primary hover:bg-primary-soft/80"
      } text-base font-semibold rounded-pill active:scale-[0.98] transition-all duration-150 ${
        large ? "px-6 py-3.5 text-base" : small ? "px-3.5 py-1.5 text-xs" : "px-5 py-2.5 text-sm"
      } disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center ${className ?? ""}`}
      {...props}
    />
  );
}
