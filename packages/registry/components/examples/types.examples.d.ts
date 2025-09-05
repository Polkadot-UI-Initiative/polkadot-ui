import type { ReactNode } from "react";

export interface ComponentExample {
  name: string;
  href: string;
  code: string;
  description: ReactNode;
  component: ReactNode;
  tsx?: string;
}
