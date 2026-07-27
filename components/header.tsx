'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { getSession, signOut } from '@/app/actions/auth';
import { useEffect } from 'react';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession();
      setUser(session);
    }
    checkAuth();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-primary">
            <span>CleanPressperf</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="text-foreground hover:text-primary transition">
              Shop
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition">
              About
            </Link>
            <Link href="/affiliate" className="text-foreground hover:text-primary transition">
              Affiliate
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition">
              Contact
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile" className="p-2 hover:bg-muted rounded-lg transition" title="Profile">
                  <User size={20} />
                </Link>
                <Link
                  href="/cart"
                  className="p-2 hover:bg-muted rounded-lg transition relative"
                  title="Cart"
                >
                  <ShoppingCart size={20} />
                </Link>
                <button
                  onClick={async () => {
                    await signOut();
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-primary hover:text-secondary"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="text-sm font-medium px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-border space-y-2">
            <Link
              href="/shop"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
            >
              About
            </Link>
            <Link
              href="/affiliate"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
            >
              Affiliate
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
