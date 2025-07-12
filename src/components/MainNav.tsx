'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Home, Plus, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';
import ThemeToggleButton from './ui/theme-toggle-button';

interface MainNavProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function MainNav({ user }: MainNavProps) {
  const pathname = usePathname();
  
  const routes = [
    {
      href: '/home',
      label: 'Home',
      icon: <Home className="h-4 w-4 mr-2" />,
      active: pathname === '/home',
    },
    {
      href: '/items',
      label: 'Browse',
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
      active: pathname === '/items',
    },
    {
      href: '/add',
      label: 'Add Item',
      icon: <Plus className="h-4 w-4 mr-2" />,
      active: pathname === '/add',
    },
  ];

  return (
    <div className="border-b fixed w-full bg-background z-30">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/home" className="flex items-center">
          <h1 className="text-xl font-bold text-primary">ReWear</h1>
        </Link>
        
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          {routes.map((route) => (
            <Button 
              key={route.href}
              asChild 
              variant={route.active ? "default" : "ghost"}
              size="sm"
            >
              <Link href={route.href} className="flex items-center">
                {route.icon}
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
        <ThemeToggleButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
                  <AvatarFallback>
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
} 