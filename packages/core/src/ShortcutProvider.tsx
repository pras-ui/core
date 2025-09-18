import React from "react";
import { Keybindy, type KeybindyShortcut } from "@keybindy/react";

interface ShortcutProviderProps {
  children: React.ReactNode;
  shortcuts?: Array<KeybindyShortcut>;
  scope?: string;
  disabled?: boolean;
  logs?: boolean;
  onShortcutFired?: (info: any) => void;
}

export const ShortcutProvider: React.FC<ShortcutProviderProps> = ({
  children,
  shortcuts = [],
  scope = "global",
  disabled = false,
  logs = false,
  onShortcutFired,
}) => {
  return (
    <Keybindy
      scope={scope}
      shortcuts={shortcuts}
      disabled={disabled}
      logs={logs}
      onShortcutFired={onShortcutFired}
    >
      {children}
    </Keybindy>
  );
};
