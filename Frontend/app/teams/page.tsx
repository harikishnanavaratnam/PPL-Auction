'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const TEAMS = [
  { id: 1, name: 'Assault Arumugam Avengers', shortCode: 'AAA', color: '#5c2e2a', players: 18 },
  { id: 2, name: 'Child Chinna Champions', shortCode: 'CCC', color: '#8b4640', players: 19 },
  { id: 3, name: 'Erimalai Warriors', shortCode: 'EW', color: '#a85c52', players: 18 },
  { id: 4, name: 'Kaipulla Kings', shortCode: 'KK', color: '#5c2e2a', players: 19 },
  { id: 5, name: 'Nesamani XI', shortCode: 'NXI', color: '#8b4640', players: 19 },
  { id: 6, name: 'Snake Babu Super Strikers', shortCode: 'SBSS', color: '#a85c52', players: 18 },
]

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1">
        {selectedTeam ? (
          <TeamDetailView teamId={selectedTeam} onBack={() => setSelectedTeam(null)} />
        ) : (
          <TeamsGridView onSelectTeam={setSelectedTeam} />
        )}
      </main>

      <Footer />
    </div>
  )
}

function TeamsGridView({ onSelectTeam }: { onSelectTeam: (id: number) => void }) {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-2 sm:mb-4">Teams</h1>
          <p className="text-base sm:text-lg text-muted-foreground">Select a team to view their roster</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TEAMS.map((team, idx) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team.id)}
              className="p-8 border border-border rounded-sm hover:border-accent transition-all duration-300 hover:shadow-lg text-left opacity-0 animate-slideUp group"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="space-y-6">
                <div 
                  className="w-16 h-16 rounded-sm flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: team.color }}
                >
                  {team.shortCode}
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-2 group-hover:text-accent transition-colors">{team.name}</h2>
                  <p className="text-muted-foreground">{team.players} Players</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-accent">View Roster →</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamDetailView({ teamId, onBack }: { teamId: number; onBack: () => void }) {
  const team = TEAMS.find(t => t.id === teamId)
  
  if (!team) return null

  // Generate placeholder player images
  const players = Array.from({ length: team.players }, (_, i) => ({
    id: i + 1,
    name: `Player ${i + 1}`,
    number: `${team.id}${String(i + 1).padStart(2, '0')}`
  }))

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium text-sm">Back to Teams</span>
        </button>

        <div className="mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-sm flex flex-shrink-0 items-center justify-center text-white font-bold text-xl sm:text-2xl"
              style={{ backgroundColor: team.color }}
            >
              {team.shortCode}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">{team.name}</h1>
              <p className="text-base sm:text-lg text-muted-foreground">Budget: 5000 Points | Players: {team.players}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-6 sm:mb-8">Player Roster</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {players.map((player, idx) => (
              <div
                key={player.id}
                className="opacity-0 animate-fadeIn"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="bg-secondary rounded-sm aspect-square flex items-center justify-center hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">#{player.number}</div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{player.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
