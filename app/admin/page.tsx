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
import { AdminDashboardStats } from '@/app/admin/components/AdminDashboardStats';
import {
  User,
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

export default async function AdminHomePage() {
  const { profileData } = await getCurrentUser();
  const name = profileData?.full_name ?? 'there';

  const quickLinks = [
    { title: 'Profile', description: 'Manage your profile', href: '/admin/profile', icon: User },
    { title: 'User Management', description: 'Manage users and organisations', href: '/admin/users', icon: Users },
    { title: 'Teachers', description: 'Manage teachers', href: '/admin/teachers', icon: GraduationCap },
    { title: 'Events', description: 'Manage school events', href: '/admin/events', icon: CalendarDays },
    { title: 'Messages', description: 'View contact form messages', href: '/admin/messages', icon: MessageSquare },
    { title: 'Donations', description: 'View donation records', href: '/admin/donations', icon: PoundSterling },
    { title: 'Documents', description: 'Manage documents', href: '/admin/documents', icon: FileText },
    { title: 'News', description: 'Manage news', href: '/admin/news', icon: Newspaper },
    { title: 'Classes', description: 'Manage classes', href: '/admin/classes', icon: BookOpen },
    { title: 'Class Gallery', description: 'Manage class photo gallery', href: '/admin/class-gallery', icon: Images }
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
        <AdminDashboardStats />
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
