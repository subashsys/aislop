import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  /** Extra classes appended after the base surface (e.g. "mt-4 p-0"). */
  className?: string;
}

/** White surface, 1px border, rounded-md, no shadow. */
export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-md border border-line bg-surface p-6 ${className}`}>
      {children}
    </div>
  );
}
