'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
          <div className="text-center sm:text-left">
            <div className="font-serif font-bold text-lg text-primary mb-1">PPL</div>
            <p className="text-xs text-muted-foreground">
              Pongal Premiere League Cricket Auction
            </p>
          </div>

          <nav className="flex gap-8 text-sm font-medium">
            <Link href="/teams" className="hover:text-primary transition-colors duration-300">
              Teams
            </Link>
            <Link href="/players" className="hover:text-primary transition-colors duration-300">
              Players
            </Link>
            <Link href="/live" className="hover:text-primary transition-colors duration-300">
              Live
            </Link>
            <Link href="/admin" className="hover:text-primary transition-colors duration-300">
              Admin
            </Link>
          </nav>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Pongal Premiere League. All rights reserved.
            </p>
            
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>Made with love by</span>
              <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-xs text-accent-foreground font-bold">
                ♥
              </div>
              <span className="text-foreground">PPL Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
