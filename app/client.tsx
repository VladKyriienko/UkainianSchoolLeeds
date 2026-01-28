'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/providers/auth-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { User, Shield, Palette, Settings } from 'lucide-react';

export function PublicHomeClient() {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-4xl mx-auto py-8 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to Ukrainia School
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A school for Ukrainian children.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold text-lg mb-2">Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Secure authentication with Supabase, including social providers
              and password reset.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold text-lg mb-2">Admin Panel</h3>
            <p className="text-sm text-muted-foreground">
              Complete admin dashboard with user management, roles, and
              permissions.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold text-lg mb-2">Modern UI</h3>
            <p className="text-sm text-muted-foreground">
              Beautiful components built with shadcn/ui and Tailwind CSS, with
              dark mode support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthenticatedHomeClient() {
  const { userData } = useAuthContext();

  const isAdmin = userData?.roles?.some((role) => role.role === 'admin');

  const quickLinks = [
    {
      title: 'Profile',
      description: 'Manage your personal information',
      href: '/profile',
      icon: User
    },
    {
      title: 'Design System',
      description: 'View all UI components',
      href: '/design-system',
      icon: Palette
    }
  ];

  if (isAdmin) {
    quickLinks.push(
      {
        title: 'Admin Panel',
        description: 'Manage users and system settings',
        href: '/admin',
        icon: Shield
      },
      {
        title: 'System Settings',
        description: 'Configure application settings',
        href: '/admin/system',
        icon: Settings
      }
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, {userData?.full_name || 'there'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Card
                key={link.href}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                  </div>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={link.href}>Go to {link.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your current account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium">Name</span>
            <span className="text-sm text-muted-foreground">
              {userData?.full_name || 'Not set'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium">Role</span>
            <span className="text-sm text-muted-foreground">
              {userData?.roles?.[0]?.role || 'User'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium">Account Status</span>
            <span className="text-sm text-green-600 dark:text-green-400">
              Active
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
