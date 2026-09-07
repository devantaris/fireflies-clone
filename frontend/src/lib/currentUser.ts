"use client";

import { createContext, useContext } from "react";

export interface UserProfile {
  name: string;
  firstName: string;
  initials: string;
  color: string;
}

function buildProfile(name: string): UserProfile {
  const trimmed = name.trim() || "Guest";
  const parts = trimmed.split(/\s+/);
  const firstName = parts[0];
  const initials = parts
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Deterministic color from name
  const PALETTE = ["#6c47ff", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0e7490", "#047857"];
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = trimmed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = PALETTE[Math.abs(hash) % PALETTE.length];

  return { name: trimmed, firstName, initials, color };
}

const STORAGE_KEY = "ff-user-name";

export function getSavedName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function saveName(name: string): void {
  localStorage.setItem(STORAGE_KEY, name.trim());
}

export function clearName(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export { buildProfile };

// Context for React components
export const UserContext = createContext<UserProfile>(buildProfile("Guest"));

export function useUser(): UserProfile {
  return useContext(UserContext);
}

/**
 * @deprecated Use useUser() hook instead. Kept for non-component imports.
 */
export const CURRENT_USER = buildProfile(
  typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) || "Guest" : "Guest"
);
