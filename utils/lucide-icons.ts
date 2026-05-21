import * as LucideIcons from 'lucide-react';

// Extract all Lucide icon names as a union type
export type LucideIconName = keyof typeof LucideIcons;

const lucideIconNames = Object.keys(LucideIcons) as LucideIconName[];

// Filtered list defines ValidLucideIconName; not imported at runtime elsewhere.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used only in typeof for exported type
const _iconNames = lucideIconNames.filter((name) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component = (LucideIcons as any)[name];
  // Check if it's a React component (function)
  // Exclude utility functions and non-component exports
  return (
    typeof component === 'function' &&
    !['createLucideIcon', 'Icon'].includes(name as string) &&
    // Most icon names start with uppercase letter
    /^[A-Z]/.test(name as string)
  );
}) as LucideIconName[];

export type ValidLucideIconName = (typeof _iconNames)[number];
