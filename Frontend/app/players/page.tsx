'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { auctionAPI, getPlayerImageUrl, type Player } from '@/lib/api'

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'Unsold' | 'Sold'>('all')

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      setLoading(true)
      // Get all players from unsold players endpoint (we'll need to create a getAllPlayers endpoint or use state)
      // For now, we'll fetch from state which includes all players
      const response = await auctionAPI.getState()
      // Extract all players from teams' rosters and combine with unsold players
      const unsoldResponse = await auctionAPI.getUnsoldPlayers()
      const soldPlayers: Player[] = []
      
      response.teams.forEach(team => {
        if (team.roster && Array.isArray(team.roster)) {
          team.roster.forEach((player: any) => {
            if (typeof player === 'object' && player._id) {
              soldPlayers.push(player as Player)
            }
          })
        }
      })

      const allPlayers = [...unsoldResponse.players, ...soldPlayers]
      setPlayers(allPlayers)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch players')
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || player.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Using centralized getPlayerImageUrl from @/lib/api

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading players...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={fetchPlayers}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Enhanced Animated Background - Multiple Layers */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Pulsing radial pattern background */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(92, 46, 42, 0.25) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(139, 70, 64, 0.2) 0%, transparent 50%)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }} />
        
        {/* Shimmer sweep - visible horizontal sweep */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full animate-shimmer-sweep" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(245, 222, 179, 0.4) 45%, rgba(92, 46, 42, 0.3) 50%, rgba(245, 222, 179, 0.4) 55%, transparent 100%)',
            width: '40%',
            height: '100%',
          }} />
        </div>
        
        {/* Floating orbs - larger and more visible */}
        <div className="absolute inset-0">
          <div className="absolute top-32 left-32 w-[500px] h-[500px] bg-primary/25 rounded-full blur-3xl animate-wave" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-32 right-32 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl animate-wave" style={{ animationDelay: '2.5s' }} />
          <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-[#f5deb3]/20 rounded-full blur-3xl animate-wave" style={{ animationDelay: '5s' }} />
        </div>
      </div>
      <Header />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <section className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-2 sm:mb-4">Players</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Browse all {players.length} players in the auction</p>
          </div>

          {/* Filters */}
          <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6 opacity-0 animate-slideUp">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3">Search Players</label>
                <input
                  type="text"
                  placeholder="Search by player name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-sm text-sm focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'Unsold' | 'Sold')}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-sm text-sm focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="all">All Players</option>
                  <option value="Unsold">Unsold</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>

            <div>
              <p className="text-xs sm:text-sm font-medium">Showing {filteredPlayers.length} of {players.length} players</p>
            </div>
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredPlayers.map((player, idx) => (
              <PlayerCard key={player._id || idx} player={player} delay={idx * 30} />
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

function PlayerCard({ player, delay }: { player: Player; delay: number }) {
  // Using centralized getPlayerImageUrl from @/lib/api

  return (
    <div
      className="opacity-0 animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-square bg-gradient-to-br from-secondary to-muted rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-2 border-border hover:border-primary">
        <div className="w-full h-full relative">
          <Image
            src={getPlayerImageUrl(player)}
            alt={player.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-xs font-medium text-white truncate">{player.name}</p>
            <p className="text-xs text-white/80">{player.status || 'Unsold'}</p>
            {player.category && (
              <p className="text-xs text-white/60">{player.category}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
