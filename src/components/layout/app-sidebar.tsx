'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CircleDollarSign,
  Home,
  ReceiptText,
  PanelLeft,
  Settings,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Page } from '@/lib/types';

const pages: Page[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: Home,
  },
  {
    path: '/expenses',
    title: 'Expenses',
    icon: ReceiptText,
  },
  {
    path: '/settings',
    title: 'Settings',
    icon: Settings,
  }
];

export default function AppSidebar() {
  const pathname = usePathname();

  const navLinks = (
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
      {pages.map((page) => (
        <Tooltip key={page.path}>
          <TooltipTrigger asChild>
            <Link
              href={page.path}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8',
                pathname.startsWith(page.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <page.icon className="h-5 w-5" />
              <span className="sr-only">{page.title}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{page.title}</TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <Link
          href="/dashboard"
          className="group flex h-14 items-center justify-center gap-2 text-lg font-semibold text-primary"
        >
          <CircleDollarSign className="h-7 w-7 transition-all group-hover:scale-110" />
          <span className="sr-only">ExpenseWise</span>
        </Link>
        {navLinks}
      </aside>

      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <CircleDollarSign className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">ExpenseWise</span>
              </Link>
              {pages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className={cn(
                    'flex items-center gap-4 px-2.5',
                    pathname.startsWith(page.path)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <page.icon className="h-5 w-5" />
                  {page.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
