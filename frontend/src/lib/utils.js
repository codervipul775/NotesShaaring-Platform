import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL = "https://notenest-gyhsb4anfygqaygu.centralindia-01.azurewebsites.net/api";