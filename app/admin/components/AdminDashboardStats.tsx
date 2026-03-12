'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { getAdminDashboardStats, type AdminDashboardStats } from '@/app/admin/actions';
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

const STATS_CONFIG: { key: keyof AdminDashboardStats; label: string; href: string; icon: typeof Users }[] = [
  { key: 'usersCount', label: 'Users', href: '/admin/users', icon: Users },
  { key: 'teachersTotal', label: 'Teachers', href: '/admin/teachers', icon: GraduationCap },
  { key: 'eventsTotal', label: 'Events', href: '/admin/events', icon: CalendarDays },
  { key: 'messagesTotal', label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { key: 'donationsTotal', label: 'Donations', href: '/admin/donations', icon: PoundSterling },
  { key: 'documentsTotal', label: 'Documents', href: '/admin/documents', icon: FileText },
  { key: 'newsTotal', label: 'News', href: '/admin/news', icon: Newspaper },
  { key: 'classesTotal', label: 'Classes', href: '/admin/classes', icon: BookOpen },
  { key: 'galleryTotal', label: 'Class Gallery', href: '/admin/class-gallery', icon: Images }
];

export function AdminDashboardStats() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminDashboardStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load stats');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {STATS_CONFIG.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="h-full animate-pulse">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <CardDescription>{label}</CardDescription>
                </div>
                <CardTitle className="text-3xl font-bold mt-1">—</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {STATS_CONFIG.map(({ key, label, href, icon: Icon }) => {
        const value = stats[key];
        return (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <CardDescription>{label}</CardDescription>
                </div>
                <CardTitle className="text-3xl font-bold mt-1">{value}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
