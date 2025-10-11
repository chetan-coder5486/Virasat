import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Count words in a string, treating multiple spaces/newlines as single separators
export function countWords(text = "") {
  if (!text) return 0;
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words.length;
}

// Validate max words; returns { valid: boolean, count: number }
export function validateMaxWords(text = "", max = 100) {
  const count = countWords(text);
  return { valid: count <= max, count };
}
