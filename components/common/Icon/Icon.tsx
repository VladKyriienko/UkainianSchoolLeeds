import { HelpCircle } from 'lucide-react';
import { lucideIconMap, type ValidLucideIconName } from '@/utils/lucide-icons';

export function Icon({
  iconName,
  className = 'h-4 w-4',
  fallback = null
}: {
  iconName: ValidLucideIconName;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const IconComponent = lucideIconMap[iconName];

  if (!IconComponent) {
    console.log(`Icon "${iconName}" not found in lucide icon map`);
    return fallback || <HelpCircle className={className} />;
  }

  return <IconComponent className={className} />;
}
