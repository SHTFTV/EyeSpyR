// EyeSpyR backend base URL. Points at the Replit-hosted API.
// Override at build time with VITE_EYESPYR_API_URL if needed.
export const API_BASE: string =
  (import.meta.env.VITE_EYESPYR_API_URL as string | undefined) ??
  "https://api.industryarmymarketing.com";
