'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, Users, RefreshCw } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { auctionAPI, getPlayerImageUrl, type Team, type Player, type AuctionState } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { getTeamLogo } from '@/lib/teamUtils';

// Team colors matching SRS
const TEAM_COLORS: Record<string, string> = {
  'ASSAULT ARUMUGAM AVENGERS': '#5c2e2a',
  'CHILD CHINNA CHAMPIONS': '#8b4640',
  'ERIMALAI WARRIORS': '#a85c52',
  'KAIPULLA KINGS': '#5c2e2a',
  'NESAMANI XI': '#8b4640',
  'SNAKE BABU SUPER STRIKERS': '#a85c52',
};

export default function LiveAuctionPage() {
  const [state, setState] = useState<AuctionState | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use Socket.io for real-time updates
  const { auctionState, isConnected } = useSocket();

  // Update state from Socket.io or fallback to initial fetch
  useEffect(() => {
    if (auctionState) {
      setState(auctionState.state);
      setTeams(auctionState.teams);
      setLoading(false);
      setError(null);
    } else {
      // Initial fetch if Socket.io hasn't connected yet
      fetchState();
    }
  }, [auctionState]);

  const fetchState = async () => {
    try {
      const response = await auctionAPI.getState();
      setState(response.state);
      setTeams(response.teams);
      setLoading(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch auction state');
      setLoading(false);
    }
  };

  // Using centralized getPlayerImageUrl from @/lib/api

  const getTeamColor = (teamName: string): string => {
    return TEAM_COLORS[teamName.toUpperCase()] || '#5c2e2a';
  };

  if (loading && !state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading auction state...</p>
        </div>
      </div>
    );
  }

  if (error && !state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={fetchState}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentPlayer = state?.currentPlayer as Player | null;
  const currentBid = state?.currentBid || (currentPlayer?.basePrice || 0);
  const currentBidderTeam = state?.currentBidder as Team | null;
  const isBiddingLive = state?.isAuctionActive || false;

  // Get recent history (last 10 bids from current player bidding)
  const recentBids = state?.history
    ?.slice()
    .reverse()
    .slice(0, 10)
    .map((h) => ({
      player: h.player as Player,
      team: h.team as Team,
      amount: h.soldPrice,
      timestamp: h.timestamp || new Date(),
    })) || [];

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
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

      {/* Main Content - Single container filling top half */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-3 overflow-hidden min-h-0">
        <div className="rounded-lg bg-card p-3 sm:p-4 shadow-xl border-2 border-border relative overflow-hidden group hover-lift flex-1 flex flex-col min-h-[85vh]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top: photo left, info (state + bid + bidder + stats) right */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch flex-1">
            {/* Left: Player photo */}
            <div className="flex justify-center lg:justify-start flex-1 min-h-0">
              <div className="w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] overflow-hidden rounded-lg border-2 border-primary/30 bg-secondary/5 shadow-xl hover:border-accent transition-all duration-300 hover:scale-105 relative group animate-zoom-in">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {currentPlayer && (
                  <img
                    src={getPlayerImageUrl(currentPlayer)}
                    alt={currentPlayer.name}
                    className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                )}
              </div>
            </div>

            {/* Right: state, bid, bidder, stats, status - spread vertically */}
            <div className="flex-1 flex flex-col gap-4 min-h-0 justify-between">
              {currentPlayer ? (
                <>
                  {/* State / player info */}
                  <div className="flex-shrink-0">
                    <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-1 animate-fade-in-up">
                      Round {state?.currentRound || 1} • Now Auctioning
                    </p>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-bounce-in">
                      {currentPlayer.name}
                    </h2>
                    {currentPlayer.category && (
                      <p
                        className="text-xs sm:text-sm text-muted-foreground mt-1 animate-fade-in-up"
                        style={{ animationDelay: '100ms' }}
                      >
                        {currentPlayer.category}
                      </p>
                    )}
                  </div>

                  {/* Bid + bidder in first row - BIG */}
                  <div className="flex flex-col md:flex-row gap-4 flex-shrink-0">
                    {/* Current Bid - BIG */}
                    <div className="flex-1 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 px-4 py-4 sm:px-5 sm:py-5 border-2 border-primary/20 relative overflow-hidden animate-scaleIn">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-shimmer" />
                      <div className="relative z-10">
                        <div className="text-center leading-tight">
                          <p className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider mb-3">
                            Current Bid
                          </p>
                          <div className="relative inline-block">
                            <div
                              className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-lg blur-md opacity-50 animate-pulse"
                              style={{ transform: 'scale(1.1)' }}
                            />
                            <div className="relative inline-flex bg-gradient-to-br from-primary via-accent to-primary px-5 py-4 sm:px-6 sm:py-5 rounded-lg shadow-2xl border-2 border-white/20 transform hover:scale-105 transition-all duration-300">
                              <div className="flex flex-col items-center gap-1 leading-none">
                                <span
                                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-lg animate-bounce-in leading-none"
                                  style={{
                                    textShadow: '0 0 15px rgba(255,255,255,0.5), 0 0 30px rgba(92, 46, 42, 0.8)',
                                    animation: 'glow 2s ease-in-out infinite alternate',
                                  }}
                                >
                                  {currentBid}
                                </span>
                                <span className="text-sm sm:text-base font-bold text-white/90 uppercase tracking-widest leading-tight">
                                  UNITS
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Bidder - BIG */}
                    <div className="flex-1 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 px-4 py-4 sm:px-5 sm:py-5 border-2 border-primary/20 relative overflow-hidden animate-scaleIn">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 md:group-hover:opacity-100 animate-shimmer" />
                      {currentBidderTeam ? (
                        <div className="relative z-10 flex items-center gap-4">
                          <div className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-lg bg-card border-2 border-border overflow-hidden flex-shrink-0 shadow-lg">
                            <Image
                              src={getTeamLogo(currentBidderTeam.name)}
                              alt={currentBidderTeam.name}
                              width={112}
                              height={112}
                              className="object-contain p-2.5"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider mb-2">
                              Current Bidder
                            </p>
                            <p className="font-semibold text-foreground text-base sm:text-lg break-words">
                              {currentBidderTeam.name}
                            </p>
                            <p className="text-sm sm:text-base text-muted-foreground mt-1">
                              Budget: {currentBidderTeam.budget}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative z-10">
                          <p className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider mb-2">
                            Current Bidder
                          </p>
                          <p className="text-base sm:text-lg text-muted-foreground">No bids yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats grid - smaller */}
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <div className="p-3 rounded-lg bg-secondary/5 border border-border flex flex-col justify-center">
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase mb-1">
                        Round
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-primary">
                        {state?.currentRound || 0}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/5 border border-border flex flex-col justify-center">
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase mb-1">
                        Players Sold
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-foreground">
                        {state?.history?.length || 0}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/5 border border-border flex flex-col justify-center">
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase mb-1">
                        Total Spent
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-accent">
                        {teams.reduce((sum, team) => sum + (team.spent || 0), 0)}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/5 border border-border flex flex-col justify-center">
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase mb-1">
                        Status
                      </p>
                      <p className={`text-lg sm:text-xl font-bold ${isBiddingLive ? 'text-accent' : 'text-muted-foreground'}`}>
                        {isBiddingLive ? 'LIVE' : 'PAUSED'}
                      </p>
                    </div>
                  </div>

                  {/* Status + history link at bottom */}
                  <div className="flex items-center gap-3 justify-between mt-auto flex-shrink-0 relative z-10">
                    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 border-2 transition-all duration-300 flex-shrink-0 ${isBiddingLive ? 'bg-accent/10 border-accent/30 animate-glow' : 'bg-muted/10 border-muted/30'}`}>
                      <div className={`h-3 w-3 rounded-full ${isBiddingLive ? 'bg-accent animate-pulse-subtle shadow-lg shadow-accent/50' : 'bg-muted'}`} />
                      <span className={`text-sm sm:text-base font-medium ${isBiddingLive ? 'text-accent' : 'text-muted-foreground'}`}>
                        {isBiddingLive ? 'Bidding Live' : 'Bidding Closed'}
                      </span>
                      {isBiddingLive && <span className="text-xs sm:text-sm text-accent/70 animate-pulse-subtle">● LIVE</span>}
                    </div>
                    <Link
                      href="/live/history"
                      className="text-sm sm:text-base font-medium text-primary hover:text-accent underline-offset-2 hover:underline px-3 py-2 rounded transition-colors cursor-pointer bg-primary/5 hover:bg-primary/10"
                    >
                      View full history
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center py-6">
                  <p className="text-sm sm:text-base text-muted-foreground">No player currently being auctioned</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer hidden on live page to save space */}
    </div>
  );
}
