import {
  BookOpen,
  Calendar,
  CalendarClock,
  FileText,
  GraduationCap,
  Home,
  Image,
  Images,
  LogOut,
  MessageSquare,
  Moon,
  Newspaper,
  PoundSterling,
  School,
  Star,
  Sun,
  User,
  Users,
  type LucideIcon
} from 'lucide-react';

export const lucideIconMap = {
  BookOpen,
  Calendar,
  CalendarClock,
  FileText,
  GraduationCap,
  Home,
  Image,
  Images,
  LogOut,
  MessageSquare,
  Moon,
  Newspaper,
  PoundSterling,
  School,
  Star,
  Sun,
  User,
  Users
} satisfies Record<string, LucideIcon>;

export type ValidLucideIconName = keyof typeof lucideIconMap;
export type LucideIconName = ValidLucideIconName;
