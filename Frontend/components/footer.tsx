'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t-2 border-[#5c2e2a]/30 relative overflow-hidden">
      {/* Animated Maroon Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#5c2e2a] via-[#8b4640] to-[#5c2e2a] opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#f5deb3]/15 to-[#e8d5b7]/20 animate-shimmer" />
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-3" style={{ backgroundSize: '120px 120px', backgroundImage: 'radial-gradient(circle, #f5deb3 1px, transparent 1px)' }} />
      
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-center sm:text-left">
              <div className="font-serif font-bold text-lg text-[#f5deb3] mb-1 drop-shadow-md">PPL</div>
              <p className="text-xs text-[#f5deb3]/80">
                Pongal Premiere League Cricket Auction
              </p>
            </div>

            <nav className="flex gap-8 text-sm font-medium">
              <Link href="/teams" className="text-[#f5deb3] hover:text-white transition-colors duration-300 hover:scale-105 transform relative group">
                <span className="relative z-10">Teams</span>
                <span className="absolute inset-0 bg-[#f5deb3]/10 rounded -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/players" className="text-[#f5deb3] hover:text-white transition-colors duration-300 hover:scale-105 transform relative group">
                <span className="relative z-10">Players</span>
                <span className="absolute inset-0 bg-[#f5deb3]/10 rounded -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/live" className="text-[#f5deb3] hover:text-white transition-colors duration-300 hover:scale-105 transform relative group">
                <span className="relative z-10">Live</span>
                <span className="absolute inset-0 bg-[#f5deb3]/10 rounded -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/admin" className="text-[#f5deb3] hover:text-white transition-colors duration-300 hover:scale-105 transform relative group">
                <span className="relative z-10">Admin</span>
                <span className="absolute inset-0 bg-[#f5deb3]/10 rounded -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </nav>
          </div>

          <div className="border-t border-[#f5deb3]/20 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[#f5deb3]/80">
                © 2025 Pongal Premiere League. All rights reserved.
              </p>
              
              <div className="flex items-center gap-2 text-sm font-medium text-[#f5deb3]/80">
                <span>Made with love by</span>
                <div className="h-6 w-6 rounded-full bg-[#f5deb3] flex items-center justify-center text-xs text-[#5c2e2a] font-bold animate-pulse-subtle shadow-md">
                  ♥
                </div>
                <div className="h-14 sm:h-16 md:h-18 w-auto max-w-[280px] sm:max-w-[320px] md:max-w-[360px] flex items-center justify-center px-4 py-2 rounded-lg bg-[#f5deb3]/30 backdrop-blur-sm border-2 border-[#f5deb3]/40 hover:bg-[#f5deb3]/40 hover:border-[#f5deb3]/60 hover:scale-110 transition-all duration-300 hover-lift drop-shadow-lg shadow-lg">
                  <Image
                    src="/Icons/MEDIA.png"
                    alt="Media Team"
                    width={360}
                    height={72}
                    className="object-contain h-full w-auto filter hover:brightness-110 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
