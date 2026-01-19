'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { auctionAPI, getPlayerImageUrl, type Team, type Player } from '@/lib/api'
import { getTeamLogo } from '@/lib/teamUtils'

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const response = await auctionAPI.getState()
      setTeams(response.teams)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading teams...</p>
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
              onClick={fetchTeams}
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
      
      <main className="flex-1">
        {selectedTeam ? (
          <TeamDetailView teamId={selectedTeam} teams={teams} onBack={() => setSelectedTeam(null)} />
        ) : (
          <TeamsGridView teams={teams} onSelectTeam={setSelectedTeam} />
        )}
      </main>

      <Footer />
    </div>
  )
}

function TeamsGridView({ teams, onSelectTeam }: { teams: Team[]; onSelectTeam: (id: string) => void }) {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-2 sm:mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Teams
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">Select a team to view their roster</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teams.map((team, idx) => (
            <button
              key={team._id}
              onClick={() => onSelectTeam(team._id)}
              className="p-8 border-2 border-border rounded-lg hover:border-accent transition-all duration-300 hover:shadow-2xl text-left opacity-0 animate-bounce-in group relative overflow-hidden hover-lift"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="space-y-6 relative z-10">
                {/* Team Logo */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-card border-2 border-border overflow-hidden flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  <Image
                    src={getTeamLogo(team.name)}
                    alt={team.name}
                    width={112}
                    height={112}
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-2 group-hover:text-accent transition-colors">{team.name}</h2>
                  <p className="text-muted-foreground">
                    {Array.isArray(team.roster) ? team.roster.length : 0} Players | Budget: {team.budget}
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-accent group-hover:scale-105 transition-transform inline-block">
                    View Roster →
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamDetailView({ teamId, teams, onBack }: { teamId: string; teams: Team[]; onBack: () => void }) {
  const team = teams.find(t => t._id === teamId)
  
  if (!team) return null

  const players = Array.isArray(team.roster) ? team.roster : []
  // Using centralized getPlayerImageUrl from @/lib/api

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8 animate-fade-in-up hover-lift group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Teams</span>
        </button>

        <div className="mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-border animate-slideDown">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Team Logo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-card border-2 border-border overflow-hidden flex flex-shrink-0 items-center justify-center shadow-xl hover:scale-105 transition-transform duration-300 hover-lift">
              <Image
                src={getTeamLogo(team.name) || '/placeholder.svg'}
                alt={team.name}
                width={128}
                height={128}
                className="object-contain p-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg'
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {team.name}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Budget: {team.budget} | Remaining: {team.budget - (team.spent || 0)} | Players: {players.length}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-6 sm:mb-8 animate-fade-in-up">Player Roster</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {players.length > 0 ? (
              players.map((player: Player, idx: number) => (
                <div
                  key={player._id || idx}
                  className="opacity-0 animate-fadeIn hover-lift group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="bg-secondary rounded-lg aspect-square overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-border hover:border-primary relative">
                    <Image
                      src={getPlayerImageUrl(player)}
                      alt={player.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                      <p className="text-sm font-medium text-white truncate">{player.name}</p>
                      {player.category && (
                        <p className="text-xs text-white/80">{player.category}</p>
                      )}
                      {player.soldPrice && (
                        <p className="text-xs text-white/60">Sold: {player.soldPrice}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No players in roster yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
