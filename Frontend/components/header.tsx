'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#5c2e2a]/30 relative overflow-hidden">
      {/* Animated Maroon Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#5c2e2a] via-[#8b4640] to-[#5c2e2a] opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5deb3] via-transparent to-[#e8d5b7] opacity-20 animate-shimmer" />
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" style={{ backgroundSize: '100px 100px', backgroundImage: 'radial-gradient(circle, #5c2e2a 1px, transparent 1px)' }} />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left Logos */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg bg-[#f5deb3]/20 backdrop-blur-sm border border-[#f5deb3]/30 flex items-center justify-center overflow-hidden hover:bg-[#f5deb3]/30 transition-all duration-300 hover:scale-110 hover-lift group relative shadow-lg">
              <Image
                src="/Icons/UOM.png"
                alt="University of Moratuwa"
                width={64}
                height={64}
                className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
            <div className="hidden sm:flex h-14 w-14 sm:h-16 sm:w-16 rounded-lg border-2 border-[#f5deb3]/40 flex items-center justify-center overflow-hidden hover:border-[#f5deb3]/60 hover:bg-[#f5deb3]/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover-lift group shadow-lg">
              <Image
                src="/Icons/TLA.png"
                alt="Thamizh Literary Association"
                width={64}
                height={64}
                className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
          </div>

          {/* Center Event Logo */}
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="h-12 sm:h-16 w-auto max-w-[280px] sm:max-w-[350px] mx-auto flex items-center justify-center hover:scale-105 transition-transform duration-300 hover-lift animate-fade-in-up drop-shadow-lg">
                <Image
                  src="/Icons/PPL.png"
                  alt="Pongal Premiere League"
                  width={350}
                  height={64}
                  className="object-contain h-full w-auto filter drop-shadow-md"
                  priority
                />
              </div>
              <div className="text-xs sm:text-sm text-[#f5deb3]/90 mt-1 font-medium">Cricket Auction 2026</div>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6 text-sm font-medium">
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
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-[#f5deb3]/20 rounded-lg transition-colors text-[#f5deb3]"
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
          <nav className="md:hidden mt-4 pt-4 border-t border-[#f5deb3]/20 space-y-3 pb-4 animate-slideDown">
            <Link
              href="/teams"
              className="block px-4 py-2 hover:bg-[#f5deb3]/20 rounded transition-colors text-[#f5deb3]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Teams
            </Link>
            <Link
              href="/players"
              className="block px-4 py-2 hover:bg-[#f5deb3]/20 rounded transition-colors text-[#f5deb3]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Players
            </Link>
            <Link
              href="/live"
              className="block px-4 py-2 hover:bg-[#f5deb3]/20 rounded transition-colors text-[#f5deb3]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Live Auction
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
