import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges multiple CSS class values into a single string, resolving Tailwind CSS class conflicts.
 *
 * @param inputs - One or more class values to be combined and merged
 * @returns A merged string of class names with Tailwind CSS conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
