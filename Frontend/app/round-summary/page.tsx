'use client';

import Link from "next/link"
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users, Clock } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { auctionAPI, getPlayerImageUrl, type Team, type Player } from '@/lib/api';

export default function RoundSummaryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roundSummary, setRoundSummary] = useState<{
    round: number;
    totalSold: number;
    totalValue: number;
    highestBid: number;
    history: Array<{
      player: Player;
      soldPrice: number;
      team: Team;
      timestamp?: Date;
    }>;
    teams: Team[];
  } | null>(null);

  useEffect(() => {
    fetchRoundSummary();
  }, []);

  const fetchRoundSummary = async () => {
    try {
      setLoading(true);
      const summary = await auctionAPI.getRoundSummary();
      setRoundSummary(summary);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch round summary');
    } finally {
      setLoading(false);
    }
  };

  // Using centralized getPlayerImageUrl from @/lib/api

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading round summary...</p>
        </div>
      </div>
    );
  }

  if (error || !roundSummary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Failed to load round summary'}</p>
          <button
            onClick={fetchRoundSummary}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get the most recent sale for display
  const latestSale = roundSummary.history.length > 0 ? roundSummary.history[roundSummary.history.length - 1] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
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

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Round Header */}
        <div className="mb-8 sm:mb-12 animate-slideDown">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary">Round Summary</h1>
            <button
              onClick={fetchRoundSummary}
              className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
          <p className="text-lg text-muted-foreground">Current Round: {roundSummary.round}</p>
        </div>

        {/* Latest Sale Section */}
        {latestSale && (
          <div className="mb-8 sm:mb-12 animate-slideDown">
            <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 sm:p-6 lg:p-8 border border-primary/20 shadow-lg">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary">
                  Latest Sale
                </span>
              </div>

              <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center">
                {/* Player Image */}
                <div className="lg:flex-1 flex justify-center">
                  <div className="aspect-[3/4] w-full max-w-xs overflow-hidden rounded-lg border-2 border-border shadow-lg">
                    <img
                      src={getPlayerImageUrl(latestSale.player as Player)}
                      alt={latestSale.player?.name || 'Player'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="lg:flex-1 space-y-4 sm:space-y-6">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">
                      Player Name
                    </p>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {latestSale.player?.name || 'Unknown Player'}
                    </h2>
                  </div>

                  <div className="rounded-lg bg-white/50 p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">Winning Team</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary">
                        {(latestSale.team as Team)?.name || 'Unknown Team'}
                      </p>
                    </div>

                    <div className="border-t border-border pt-3 sm:pt-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Final Bid Amount</p>
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent">
                          {latestSale.soldPrice || 0} UNITS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12 animate-slideUp">
          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Total Players Sold</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{roundSummary.totalSold}</p>
          </div>

          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{roundSummary.totalValue} UNITS</p>
          </div>

          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-secondary/50 p-2">
                <Trophy className="h-5 w-5 text-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Highest Bid</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{roundSummary.highestBid || 0} UNITS</p>
          </div>

          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-muted/50 p-2">
                <Clock className="h-5 w-5 text-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Current Round</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{roundSummary.round}</p>
          </div>
        </div>

        {/* Sales History */}
        {roundSummary.history.length > 0 && (
          <div className="animate-fadeIn">
            <div className="rounded-lg bg-card p-8 shadow-md border border-border">
              <h3 className="mb-6 text-xl font-bold text-foreground">Sales History</h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {roundSummary.history.slice().reverse().map((sale, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/5 p-4 transition-all hover:bg-secondary/10 animate-slideUp"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {roundSummary.history.length - index}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{(sale.team as Team)?.name || 'Unknown Team'}</p>
                        <p className="text-xs text-muted-foreground">{(sale.player as Player)?.name || 'Unknown Player'}</p>
                        {sale.timestamp && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(sale.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">{sale.soldPrice || 0} UNITS</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/live"
            className="flex-1 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors text-center"
          >
            View Live Auction
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-lg border-2 border-border px-6 py-3 font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
