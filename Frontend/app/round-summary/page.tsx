'use client';

import Link from "next/link"
import { ChevronLeft } from 'lucide-react'; // Import ChevronLeft

import { useState } from 'react';
import { Trophy, TrendingUp, Users, Clock } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface RoundResult {
  playerName: string;
  playerImage: string;
  winningTeam: string;
  finalBid: number;
  startPrice: number;
  biddingDuration: number;
  totalBids: number;
  participatingTeams: number;
}

export default function RoundSummaryPage() {
  const [currentRound] = useState<RoundResult>({
    playerName: 'Virat Kohli',
    playerImage: 'https://via.placeholder.com/300x400?text=Virat+Kohli',
    winningTeam: 'Chennai Super Kings',
    finalBid: 85000,
    startPrice: 10000,
    biddingDuration: 45,
    totalBids: 12,
    participatingTeams: 5,
  });

  const [biddingSequence] = useState([
    {
      round: 1,
      team: 'Mumbai Indians',
      bid: 10000,
      timestamp: '00:05',
    },
    {
      round: 2,
      team: 'Kolkata Knight Riders',
      bid: 15000,
      timestamp: '00:08',
    },
    {
      round: 3,
      team: 'Royal Challengers Bangalore',
      bid: 20000,
      timestamp: '00:12',
    },
    {
      round: 4,
      team: 'Delhi Capitals',
      bid: 25000,
      timestamp: '00:18',
    },
    {
      round: 5,
      team: 'Rajasthan Royals',
      bid: 30000,
      timestamp: '00:22',
    },
    {
      round: 6,
      team: 'Mumbai Indians',
      bid: 35000,
      timestamp: '00:25',
    },
    {
      round: 7,
      team: 'Kolkata Knight Riders',
      bid: 40000,
      timestamp: '00:30',
    },
    {
      round: 8,
      team: 'Royal Challengers Bangalore',
      bid: 50000,
      timestamp: '00:35',
    },
    {
      round: 9,
      team: 'Mumbai Indians',
      bid: 60000,
      timestamp: '00:38',
    },
    {
      round: 10,
      team: 'Chennai Super Kings',
      bid: 75000,
      timestamp: '00:40',
    },
    {
      round: 11,
      team: 'Kolkata Knight Riders',
      bid: 80000,
      timestamp: '00:42',
    },
    {
      round: 12,
      team: 'Chennai Super Kings',
      bid: 85000,
      timestamp: '00:45',
    },
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Winner Section */}
        <div className="mb-8 sm:mb-12 animate-slideDown">
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 sm:p-6 lg:p-8 border border-primary/20 shadow-lg">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary">Round Complete</span>
            </div>

            <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center">
              {/* Player Image */}
              <div className="lg:flex-1 flex justify-center">
                <div className="aspect-[3/4] w-full max-w-xs overflow-hidden rounded-lg border-2 border-border shadow-lg">
                  <img
                    src={currentRound.playerImage || "/placeholder.svg"}
                    alt={currentRound.playerName}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="lg:flex-1 space-y-4 sm:space-y-6">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">Player Name</p>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{currentRound.playerName}</h2>
                </div>

                <div className="rounded-lg bg-white/50 p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">Winning Team</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">{currentRound.winningTeam}</p>
                  </div>

                  <div className="border-t border-border pt-3 sm:pt-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Final Bid Amount</p>
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent">₹{(currentRound.finalBid / 100000).toFixed(1)}L</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        ({((currentRound.finalBid / currentRound.startPrice - 1) * 100).toFixed(0)}% above base)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12 animate-slideUp">
          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Base Price</p>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{(currentRound.startPrice / 1000).toFixed(0)}K</p>
          </div>

          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">Total Bids</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{currentRound.totalBids}</p>
          </div>

          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-secondary/50 p-2">
                <Users className="h-5 w-5 text-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Teams Bid</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{currentRound.participatingTeams}</p>
          </div>

          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-muted/50 p-2">
                <Clock className="h-5 w-5 text-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{currentRound.biddingDuration}s</p>
          </div>
        </div>

        {/* Bidding Sequence */}
        <div className="animate-fadeIn">
          <div className="rounded-lg bg-card p-8 shadow-md border border-border">
            <h3 className="mb-6 text-xl font-bold text-foreground">Bidding Sequence</h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {biddingSequence.map((bid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/5 p-4 transition-all hover:bg-secondary/10 animate-slideUp"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {bid.round}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{bid.team}</p>
                      <p className="text-xs text-muted-foreground">{bid.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent">₹{(bid.bid / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/live"
            className="flex-1 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors text-center"
          >
            Next Round
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
