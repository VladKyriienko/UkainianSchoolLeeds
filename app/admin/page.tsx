import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/utils/auth-helpers/server';
import { getUsersCount } from '@/app/admin/users/actions';
import { listTeachers } from '@/app/admin/teachers/actions';
import { listEvents } from '@/app/admin/events/actions';
import { listMessages } from '@/app/admin/messages/actions';
import { listDonations } from '@/app/admin/donations/actions';
import {
  User,
  GraduationCap,
  CalendarDays,
  MessageSquare,
  PoundSterling,
  Users
} from 'lucide-react';

export default async function AdminHomePage() {
  const { profileData } = await getCurrentUser();
  const name = profileData?.full_name ?? 'there';

  const [usersCount, teachersResult, eventsResult, messagesResult, donationsResult] =
    await Promise.all([
      getUsersCount(),
      listTeachers({ page: 1, limit: 1 }),
      listEvents({ page: 1, limit: 1 }),
      listMessages({ page: 1, limit: 1 }),
      listDonations({ page: 1, limit: 1 })
    ]);

  const stats = [
    { label: 'Users', value: usersCount, href: '/admin/users', icon: Users },
    { label: 'Teachers', value: teachersResult.total, href: '/admin/teachers', icon: GraduationCap },
    { label: 'Events', value: eventsResult.total, href: '/admin/events', icon: CalendarDays },
    { label: 'Messages', value: messagesResult.total, href: '/admin/messages', icon: MessageSquare },
    { label: 'Donations', value: donationsResult.total, href: '/admin/donations', icon: PoundSterling }
  ];

  const quickLinks = [
    { title: 'Profile', description: 'Manage your profile', href: '/admin/profile', icon: User },
    { title: 'User Management', description: 'Manage users and organisations', href: '/admin/users', icon: Users },
    { title: 'Teachers', description: 'Manage teachers', href: '/admin/teachers', icon: GraduationCap },
    { title: 'Events', description: 'Manage school events', href: '/admin/events', icon: CalendarDays },
    { title: 'Messages', description: 'View contact form messages', href: '/admin/messages', icon: MessageSquare },
    { title: 'Donations', description: 'View donation records', href: '/admin/donations', icon: PoundSterling }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, {name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Admin dashboard for Ukrainia School.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.href} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <CardDescription>{stat.label}</CardDescription>
                    </div>
                    <CardTitle className="text-3xl font-bold mt-1">
                      {stat.value}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Card key={link.href} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                  </div>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={link.href}>{link.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
