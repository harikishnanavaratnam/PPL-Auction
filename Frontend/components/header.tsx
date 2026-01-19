'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left Logos */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              PPL
            </div>
            <div className="hidden sm:flex h-10 w-10 rounded-lg border-2 border-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary">PL</span>
            </div>
          </div>

          {/* Center Event Logo */}
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="text-sm font-serif font-bold text-primary tracking-widest">
                PONGAL PREMIERE LEAGUE
              </div>
              <div className="text-xs text-muted-foreground">Cricket Auction 2025</div>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6 text-sm font-medium">
              <Link href="/teams" className="hover:text-primary transition-colors duration-300">
                Teams
              </Link>
              <Link href="/players" className="hover:text-primary transition-colors duration-300">
                Players
              </Link>
              <Link href="/live" className="hover:text-primary transition-colors duration-300">
                Live
              </Link>
            </nav>
            <Link
              href="/admin"
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:bg-accent transition-colors duration-300"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-border space-y-3 pb-4 animate-slideDown">
            <Link
              href="/teams"
              className="block px-4 py-2 hover:bg-secondary rounded transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Teams
            </Link>
            <Link
              href="/players"
              className="block px-4 py-2 hover:bg-secondary rounded transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Players
            </Link>
            <Link
              href="/live"
              className="block px-4 py-2 hover:bg-secondary rounded transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Live Auction
            </Link>
            <Link
              href="/admin"
              className="block px-4 py-2 bg-primary text-primary-foreground font-medium hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Panel
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
