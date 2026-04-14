import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-2 py-1.5 sm:px-4 sm:py-3">
      {children}
    </div>
  );
}
