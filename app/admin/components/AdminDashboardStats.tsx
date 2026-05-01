import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import type { AdminDashboardStats as AdminDashboardStatsData } from '@/app/admin/actions';
import {
  Users,
  GraduationCap,
  CalendarDays,
  MessageSquare,
  PoundSterling,
  FileText,
  Newspaper,
  BookOpen,
  Images
} from 'lucide-react';

const STATS_CONFIG: {
  key: keyof AdminDashboardStatsData;
  label: string;
  href: string;
  icon: typeof Users;
}[] = [
    { key: 'usersCount', label: 'Users', href: '/admin/users', icon: Users },
    {
      key: 'teachersTotal',
      label: 'Teachers',
      href: '/admin/teachers',
      icon: GraduationCap
    },
    { key: 'eventsTotal', label: 'Events', href: '/admin/events', icon: CalendarDays },
    {
      key: 'messagesTotal',
      label: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare
    },
    {
      key: 'donationsTotal',
      label: 'Donations',
      href: '/admin/donations',
      icon: PoundSterling
    },
    {
      key: 'documentsTotal',
      label: 'Documents',
      href: '/admin/documents',
      icon: FileText
    },
    { key: 'newsTotal', label: 'News', href: '/admin/news', icon: Newspaper },
    { key: 'classesTotal', label: 'Classes', href: '/admin/classes', icon: BookOpen },
    {
      key: 'galleryTotal',
      label: 'Class Gallery',
      href: '/admin/class-gallery',
      icon: Images
    }
  ];

export function AdminDashboardStats({
  stats
}: {
  stats: AdminDashboardStatsData;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {STATS_CONFIG.map(({ key, label, href, icon: Icon }) => {
        const value = stats[key];
        return (
          <Link key={href} href={href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <CardDescription>{label}</CardDescription>
                </div>
                <CardTitle className="mt-1 text-3xl font-bold">{value}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
