'use client';

import { ChevronsUpDown, User } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/auth-provider';
import { Icon } from '@/components/common/Icon';
import type { ValidLucideIconName } from '@/utils/lucide-icons';

type NavUserMenuItem = {
  title: string;
  iconName: ValidLucideIconName;
  href?: string;
  action?: string;
};

const userMenuGroups: { items: NavUserMenuItem[]; separator?: boolean }[] = [
  {
    items: [
      {
        title: 'Profile',
        href: '/admin/profile',
        iconName: 'User'
      }
    ],
    separator: true
  },
  {
    items: [{ title: 'Sign Out', action: 'signout', iconName: 'LogOut' }]
  }
];

export function NavUser() {
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const { user, userData, signOut } = useAuthContext();

  const handleMobileNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleMobileNavigation();
    await signOut();
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Link href="/auth/login" onClick={handleMobileNavigation}>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Sign In</span>
                <span className="truncate text-xs">Get started</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const userInitials = userData?.full_name
    ? userData.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  // Use email as fallback display name if userData hasn't loaded yet
  const displayName =
    userData?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  className="object-cover"
                  src={userData?.avatar_url || undefined}
                  alt={userData?.full_name || user.email || 'User'}
                />
                <AvatarFallback className="rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    className="object-cover"
                    src={userData?.avatar_url || undefined}
                    alt={userData?.full_name || user.email || 'User'}
                  />
                  <AvatarFallback className="rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                {userData?.roles?.some((role) => role.role === 'admin') && (
                  <Badge variant="secondary" className="text-xs">
                    Admin
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>

            {/* Render configurable menu groups */}
            {userMenuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.separator && <DropdownMenuSeparator />}
                <DropdownMenuGroup>
                  {group.items.map((item, itemIndex) => {
                    if (item.action === 'signout') {
                      return (
                        <DropdownMenuItem key={itemIndex} asChild>
                          <form onSubmit={handleSignOut} className="w-full">
                            <button
                              type="submit"
                              className="flex w-full items-center"
                            >
                              <Icon
                                iconName={item.iconName}
                                className="mr-4 h-4 w-4"
                              />
                              {item.title}
                            </button>
                          </form>
                        </DropdownMenuItem>
                      );
                    }

                    return (
                      <DropdownMenuItem key={itemIndex} asChild>
                        <Link
                          href={item.href || '#'}
                          onClick={handleMobileNavigation}
                        >
                          <Icon
                            iconName={item.iconName}
                            className="mr-2 h-4 w-4"
                          />
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
