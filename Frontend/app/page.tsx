'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-24 px-6 flex-1">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`space-y-8 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <h1 className="text-7xl font-serif font-bold tracking-tight leading-tight">
              Pongal Premiere League
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The premier cricket auction platform. Watch as teams compete to build their rosters in real-time with dynamic bidding and strategic player selection.
            </p>
            
            <div className="flex gap-4 justify-center pt-8">
              <Link 
                href="/live"
                className="px-8 py-3 bg-primary text-primary-foreground font-medium hover:bg-accent transition-all duration-300 hover:shadow-lg"
              >
                Watch Live Auction
              </Link>
              <Link 
                href="/teams"
                className="px-8 py-3 border border-primary text-primary font-medium hover:bg-secondary transition-all duration-300"
              >
                View Teams
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-20 px-6 border-t border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-16">Auction Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              title="Live Bidding"
              description="Real-time auction with dynamic bid increments and instant team updates. Watch the action unfold as teams compete for top players."
              delay="0ms"
            />
            <FeatureCard 
              title="Team Management"
              description="View all six teams with their rosters, remaining budgets, and strategic player compositions as the auction progresses."
              delay="100ms"
            />
            <FeatureCard 
              title="Player Database"
              description="Browse all 112 players in the auction with detailed galleries and filtering options by team and availability."
              delay="200ms"
            />
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-16">The Teams</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Assault Arumugam Avengers', shortCode: 'AAA' },
              { name: 'Child Chinna Champions', shortCode: 'CCC' },
              { name: 'Erimalai Warriors', shortCode: 'EW' },
              { name: 'Kaipulla Kings', shortCode: 'KK' },
              { name: 'Nesamani XI', shortCode: 'NXI' },
              { name: 'Snake Babu Super Strikers', shortCode: 'SBSS' },
            ].map((team, idx) => (
              <TeamCard key={team.shortCode} team={team} delay={idx * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard label="Teams" value="6" />
            <StatCard label="Players" value="112" />
            <StatCard label="Budget Per Team" value="5000" />
            <StatCard label="Total Prize Pool" value="30K" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-serif font-bold">Ready to Begin?</h2>
          <p className="text-lg text-muted-foreground">
            Experience the thrill of the Pongal Premiere League auction. Explore teams, view players, and watch the live bidding in action.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/live"
              className="px-8 py-3 bg-primary text-primary-foreground font-medium hover:bg-accent transition-all duration-300"
            >
              Enter Live Auction
            </Link>
            <Link 
              href="/admin"
              className="px-8 py-3 border border-primary text-primary font-medium hover:bg-secondary transition-all duration-300"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function FeatureCard({ title, description, delay }: { title: string; description: string; delay: string }) {
  return (
    <div 
      className="p-8 border border-border rounded-sm transition-all duration-500 hover:border-accent hover:shadow-lg opacity-0 animate-fadeIn"
      style={{ animationDelay: delay }}
    >
      <h3 className="text-xl font-serif font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function TeamCard({ team, delay }: { team: { name: string; shortCode: string }; delay: number }) {
  return (
    <Link 
      href="/teams"
      className="p-6 border border-border rounded-sm hover:border-accent transition-all duration-300 hover:shadow-lg opacity-0 animate-fadeIn group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="space-y-3">
        <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold rounded-sm">
          {team.shortCode}
        </div>
        <h3 className="font-serif font-bold text-lg group-hover:text-accent transition-colors">{team.name}</h3>
        <p className="text-sm text-muted-foreground">Budget: 5000 Points</p>
      </div>
    </Link>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2 opacity-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
      <div className="text-3xl font-serif font-bold text-primary">{value}</div>
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  )
}
