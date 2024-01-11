"use client";

import { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type FormButtonProps = {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<"button">; //react directive that allows using custom props and regular button tag props.

export default function FormButton({
  children,
  className,
  ...props
}: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      className={`btn btn-primary ${className}`}
      type="submit"
      disabled={pending}
    >
      {pending && <span className="loading loading-spinner loading-md" />}
      {children}
    </button>
  );
}
