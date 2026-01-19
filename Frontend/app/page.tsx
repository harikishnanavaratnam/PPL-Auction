'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Sparkles, TrendingUp, Users, Award } from 'lucide-react'
import { getTeamLogo } from '@/lib/teamUtils'

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
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

      {/* Hero Section */}
      <section className="pt-24 pb-24 px-6 flex-1 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            {/* Animated Title */}
            <div className="relative">
              <h1 className="text-7xl font-serif font-bold tracking-tight leading-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer">
                Pongal Premiere League
              </h1>
              <div className="absolute -top-2 -right-2 animate-float">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              The premier cricket auction platform. Watch as teams compete to build their rosters in real-time with dynamic bidding and strategic player selection.
            </p>
            
            <div className="flex gap-4 justify-center pt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Link 
                href="/live"
                className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-accent transition-all duration-300 hover:shadow-xl hover:scale-105 transform animate-bounce-in hover-lift relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Watch Live Auction
                  <TrendingUp className="h-4 w-4 group-hover:animate-pulse" />
                </span>
                <span className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
              <Link 
                href="/teams"
                className="px-8 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-secondary transition-all duration-300 hover:scale-105 transform hover-lift"
              >
                View Teams
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-20 px-6 border-t border-b border-border relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 animate-slideDown">Auction Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              title="Live Bidding"
              description="Real-time auction with dynamic bid increments and instant team updates. Watch the action unfold as teams compete for top players."
              delay="0ms"
              icon={<TrendingUp className="h-8 w-8" />}
            />
            <FeatureCard 
              title="Team Management"
              description="View all six teams with their rosters, remaining budgets, and strategic player compositions as the auction progresses."
              delay="200ms"
              icon={<Users className="h-8 w-8" />}
            />
            <FeatureCard 
              title="Player Database"
              description="Browse all 112 players in the auction with detailed galleries and filtering options by team and availability."
              delay="400ms"
              icon={<Award className="h-8 w-8" />}
            />
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 animate-slideDown">The Teams</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Assault Arumugam Avengers', shortCode: 'AAA', color: '#5c2e2a' },
              { name: 'Child Chinna Champions', shortCode: 'CCC', color: '#8b4640' },
              { name: 'Erimalai Warriors', shortCode: 'EW', color: '#a85c52' },
              { name: 'Kaipulla Kings', shortCode: 'KK', color: '#5c2e2a' },
              { name: 'Nesamani XI', shortCode: 'NXI', color: '#8b4640' },
              { name: 'Snake Babu Super Strikers', shortCode: 'SBSS', color: '#a85c52' },
            ].map((team, idx) => (
              <TeamCard key={team.shortCode} team={team} delay={idx * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-secondary/50 via-secondary/30 to-secondary/50 py-20 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard label="Teams" value="6" delay="0ms" />
            <StatCard label="Players" value="112" delay="150ms" />
            <StatCard label="Budget Per Team" value="5000" delay="300ms" />
            <StatCard label="Total Prize Pool" value="30K" delay="450ms" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-zoom-in">
          <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ready to Begin?
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in-up">
            Experience the thrill of the Pongal Premiere League auction. Explore teams, view players, and watch the live bidding in action.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <Link 
              href="/live"
              className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-accent transition-all duration-300 hover:shadow-xl hover:scale-110 transform hover-lift animate-glow"
            >
              Enter Live Auction
            </Link>
            <Link 
              href="/admin"
              className="px-8 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-secondary transition-all duration-300 hover:scale-110 transform hover-lift"
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

function FeatureCard({ title, description, delay, icon }: { title: string; description: string; delay: string; icon: React.ReactNode }) {
  return (
    <div 
      className="p-8 border-2 border-border rounded-lg transition-all duration-500 hover:border-accent hover:shadow-2xl opacity-0 animate-fade-in-up hover-lift group relative overflow-hidden"
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-serif font-bold mb-4 group-hover:text-accent transition-colors">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function TeamCard({ team, delay }: { team: { name: string; shortCode: string; color: string }; delay: number }) {
  const teamLogo = getTeamLogo(team.name);
  
  return (
    <Link 
      href="/teams"
      className="p-6 border-2 border-border rounded-lg hover:border-accent transition-all duration-300 hover:shadow-2xl opacity-0 animate-bounce-in group relative overflow-hidden hover-lift"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${team.color} 0%, transparent 100%)` }}
      />
      <div className="space-y-3 relative z-10">
        <div 
          className="w-20 h-20 sm:w-24 sm:h-24 bg-card border-2 border-border rounded-lg overflow-hidden flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
        >
          <Image
            src={teamLogo}
            alt={team.name}
            width={96}
            height={96}
            className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h3 className="font-serif font-bold text-lg group-hover:text-accent transition-colors">{team.name}</h3>
        <p className="text-sm text-muted-foreground">Budget: 5000 Points</p>
      </div>
    </Link>
  )
}

function StatCard({ label, value, delay }: { label: string; value: string; delay: string }) {
  return (
    <div className="space-y-2 opacity-0 animate-zoom-in group hover-lift" style={{ animationDelay: delay }}>
      <div className="text-4xl font-serif font-bold text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
        {value}
      </div>
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  )
}
