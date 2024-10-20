'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface NavBarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export default function NavBar({ isAuthenticated, isAdmin }: NavBarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Itineraries', path: '/protected/itineraries' },
    { name: 'Create Itinerary', path: '/protected/create-itinerary' },
    // Add the admin link conditionally
    ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
    // Add other navigation items as needed
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            pathname === item.path ? 'text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setIsOpen(false)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  const AuthButtons = () => (
    <>
      {isAuthenticated ? (
        <form action={signOutAction}>
          <Button type="submit" variant="outline" onClick={() => setIsOpen(false)}>
            Sign Out
          </Button>
        </form>
      ) : (
        <>
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/sign-up" onClick={() => setIsOpen(false)}>
            <Button>Sign Up</Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-semibold text-foreground text-lg">
              Disney Trip Planner
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons />
          </div>
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  <NavLinks />
                  <div className="flex flex-col gap-2 mt-4">
                    <AuthButtons />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
