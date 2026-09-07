/**
 * Demo current-user profile.
 * No authentication — this is a single-user demo app.
 * Update this constant to change the displayed user identity throughout the UI.
 */
export const CURRENT_USER = {
  name: "Devansh Kumar",
  firstName: "Devansh",
  initials: "DK",
  /** Avatar color — must match getAvatarColor("Devansh Kumar") for consistency */
  color: "#6c47ff",
} as const;
