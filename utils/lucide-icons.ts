import * as LucideIcons from 'lucide-react';

// Extract all Lucide icon names as a union type
export type LucideIconName = keyof typeof LucideIcons;

// Get all available icon names as an array (useful for runtime)
export const lucideIconNames = Object.keys(LucideIcons) as LucideIconName[];

// Filter out non-icon exports (like createLucideIcon, etc.)
export const iconNames = lucideIconNames.filter((name) => {
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

// Export the filtered icon names as a type
export type ValidLucideIconName = (typeof iconNames)[number];

// Helper function to get all available icon names (useful for development/debugging)
export function getAllIconNames(): ValidLucideIconName[] {
  return [...iconNames];
}

// Helper function to check if an icon name is valid
export function isValidIconName(name: string): name is ValidLucideIconName {
  return iconNames.includes(name as ValidLucideIconName);
}
