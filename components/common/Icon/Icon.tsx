import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import type { ValidLucideIconName } from '@/utils/lucide-icons';

// Simple icon resolver that gets the icon component by name
export function Icon({
  iconName,
  className = 'h-4 w-4',
  fallback = null
}: {
  iconName: ValidLucideIconName;
  className?: string;
  fallback?: React.ReactNode;
}) {
  // Get the icon component from Lucide exports
  const IconComponent = LucideIcons[iconName] as LucideIcon;

  if (!IconComponent) {
    console.log(`Icon "${iconName}" not found in lucide-react`);
    // Return fallback or HelpCircle as default
    const FallbackIcon = LucideIcons.HelpCircle;
    return fallback || <FallbackIcon className={className} />;
  }

  return <IconComponent className={className} />;
}
