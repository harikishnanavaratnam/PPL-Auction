'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const TEAMS = [
  { id: 1, name: 'AAA', color: '#5c2e2a' },
  { id: 2, name: 'CCC', color: '#8b4640' },
  { id: 3, name: 'EW', color: '#a85c52' },
  { id: 4, name: 'KK', color: '#5c2e2a' },
  { id: 5, name: 'NXI', color: '#8b4640' },
  { id: 6, name: 'SBSS', color: '#a85c52' },
]

// Generate 112 unique players
const PLAYERS = Array.from({ length: 112 }, (_, i) => ({
  id: i + 1,
  name: `Player ${String(i + 1).padStart(3, '0')}`,
  number: i + 1,
}))

export default function PlayersPage() {
  const [filterTeam, setFilterTeam] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPlayers = PLAYERS.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         player.number.toString().includes(searchQuery)
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <section className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-2 sm:mb-4">Players</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Browse all {PLAYERS.length} players in the auction</p>
          </div>

          {/* Filters */}
          <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6 opacity-0 animate-slideUp">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3">Search Players</label>
              <input
                type="text"
                placeholder="Search by player number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-sm text-sm focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-medium">Showing {filteredPlayers.length} players</p>
              {filteredPlayers.length === PLAYERS.length && (
                <p className="text-xs text-muted-foreground">All players available</p>
              )}
            </div>
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredPlayers.map((player, idx) => (
              <PlayerCard key={player.id} player={player} delay={idx * 30} />
            ))}
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-12 sm:py-20">
              <p className="text-muted-foreground text-sm sm:text-lg">No players found matching your search.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

function PlayerCard({ player, delay }: { player: { id: number; name: string; number: number }; delay: number }) {
  return (
    <div
      className="opacity-0 animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-square bg-gradient-to-br from-secondary to-muted rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
        <div className="w-full h-full flex flex-col items-center justify-center p-4 group-hover:bg-accent/5 transition-colors duration-300">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-sm flex items-center justify-center font-bold text-lg mx-auto">
              {String(player.number).padStart(2, '0')}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Player</p>
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{player.number}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
