import { useState } from "react";

export function useId(prefix = "pras-ui", length = 8): string {
  const [id] = useState(() => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let uid = "";
    for (let i = 0; i < length; i++) {
      uid += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${prefix}-${uid}`;
  });

  return id;
}
