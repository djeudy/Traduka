import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function unique(padding = 7) {

  const baseId = Date.now().toString(36);

  if (padding > 0) {
    const byteCount = Math.max(1, Math.ceil(padding / 2));
    const bytes = new Uint8Array(byteCount);
    crypto.getRandomValues(bytes);

    // Convertir les bytes en hex et tronquer à la longueur voulue
    const randomPart = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, padding);

    return baseId + randomPart;
  }

  return baseId;
}
