/**
 * GymPulse UI — Container
 * Developed by Rafael Turossi
 * Signature: @Rafael-Turossi-Vargas
 */

import React from "react";

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 md:px-8 ${className}`}>
      {children}
    </div>
  );
}
