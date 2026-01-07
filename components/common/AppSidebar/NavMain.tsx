'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@/components/ui/sidebar';
import { cn } from '@/utils/cn';
import type { RouteConfig } from '@/utils/route-protection';
import { Icon } from '@/components/common/Icon';

export function NavMain({ items }: { items: RouteConfig[] }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleMobileNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.path;
          const hasSubItems = item.children && item.children.length > 0;

          // Check if any sub-item is active to keep parent expanded
          const hasActiveSubItem =
            hasSubItems &&
            item.children!.some((subItem) => pathname === subItem.path);
          const shouldExpand = isActive || hasActiveSubItem;

          return (
            <SidebarMenuItem key={item.label}>
              {hasSubItems ? (
                <>
                  {/* Expanded state - use Collapsible */}
                  <Collapsible
                    defaultOpen={shouldExpand || false}
                    className="group/collapsible group-data-[collapsible=icon]:hidden"
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={isActive}
                        className="w-full"
                      >
                        <div className="flex w-full gap-2 items-center">
                          <Icon
                            iconName={item.icon}
                            className="h-4 w-4 shrink-0"
                          />
                          <span className="flex-1 grow text-left truncate">
                            {item.label}
                          </span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children!.map((subItem) => {
                          const isSubActive = pathname === subItem.path;
                          return (
                            <SidebarMenuSubItem key={subItem.label}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubActive}
                              >
                                <Link
                                  href={subItem.path}
                                  onClick={handleMobileNavigation}
                                >
                                  <span>{subItem.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Collapsed state - use Popover */}
                  <div className="hidden group-data-[collapsible=icon]:block">
                    <Popover>
                      <PopoverTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.label}
                          isActive={isActive}
                          className="w-full !p-2"
                        >
                          <div className="flex w-full items-center justify-center">
                            <Icon
                              iconName={item.icon}
                              className="h-4 w-4 shrink-0"
                            />
                          </div>
                        </SidebarMenuButton>
                      </PopoverTrigger>
                      <PopoverContent
                        side="right"
                        align="start"
                        className="w-48 p-2"
                        sideOffset={8}
                      >
                        <div className="space-y-1">
                          <div className="px-2 py-1 text-sm font-medium text-sidebar-foreground">
                            {item.label}
                          </div>
                          {item.children!.map((subItem) => {
                            const isSubActive = pathname === subItem.path;
                            return (
                              <Link
                                key={subItem.label}
                                href={subItem.path}
                                onClick={handleMobileNavigation}
                                className={cn(
                                  'block px-2 py-1 text-sm rounded-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors',
                                  isSubActive &&
                                    'bg-sidebar-accent text-sidebar-accent-foreground'
                                )}
                              >
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              ) : (
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={isActive}
                  className={cn('w-full', 'group-data-[collapsible=icon]:!p-2')}
                  asChild
                >
                  <Link
                    href={item.path}
                    className="flex w-full items-center"
                    onClick={handleMobileNavigation}
                  >
                    <Icon iconName={item.icon} className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
