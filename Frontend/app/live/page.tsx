'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, Users, ChevronLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface Team {
  id: string;
  name: string;
  color: string;
}

interface Player {
  id: string;
  name: string;
  image: string;
}

interface Bid {
  teamId: string;
  teamName: string;
  amount: number;
  timestamp: Date;
}

export default function LiveAuctionPage() {
  const [currentPlayer, setCurrentPlayer] = useState<Player>({
    id: '1',
    name: 'Virat Kohli',
    image: 'https://via.placeholder.com/300x400?text=Player',
  });

  const [currentTeam, setCurrentTeam] = useState<Team>({
    id: 'csk',
    name: 'Chennai Super Kings',
    color: '#FFD700',
  });

  const [currentBid, setCurrentBid] = useState(50000);
  const [biddingHistory, setBiddingHistory] = useState<Bid[]>([
    {
      teamId: 'csk',
      teamName: 'Chennai Super Kings',
      amount: 50000,
      timestamp: new Date(),
    },
    {
      teamId: 'mi',
      teamName: 'Mumbai Indians',
      amount: 45000,
      timestamp: new Date(Date.now() - 10000),
    },
    {
      teamId: 'kkr',
      teamName: 'Kolkata Knight Riders',
      amount: 40000,
      timestamp: new Date(Date.now() - 20000),
    },
  ]);

  const [isBiddingLive, setIsBiddingLive] = useState(true);

  const teams: Team[] = [
    { id: 'csk', name: 'Chennai Super Kings', color: '#FFD700' },
    { id: 'mi', name: 'Mumbai Indians', color: '#003DA5' },
    { id: 'kkr', name: 'Kolkata Knight Riders', color: '#3A1365' },
    { id: 'rcb', name: 'Royal Challengers Bangalore', color: '#EC1C24' },
    { id: 'dc', name: 'Delhi Capitals', color: '#00245E' },
    { id: 'rr', name: 'Rajasthan Royals', color: '#E74C3C' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (isBiddingLive) {
        const newBid = currentBid + Math.floor(Math.random() * 10000) + 5000;
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];
        setCurrentBid(newBid);
        setCurrentTeam(randomTeam);
        setBiddingHistory((prev) => [
          {
            teamId: randomTeam.id,
            teamName: randomTeam.name,
            amount: newBid,
            timestamp: new Date(),
          },
          ...prev.slice(0, 9),
        ]);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [isBiddingLive, currentBid, teams]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Left: Player Display - Compact */}
          <div className="lg:col-span-2 animate-slideDown">
            <div className="rounded-lg bg-card p-6 sm:p-8 shadow-md border border-border">
              <div className="mb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Now Auctioning</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{currentPlayer.name}</h2>
              </div>

              {/* Player Image - Responsive */}
              <div className="mb-6 flex justify-center">
                <div className="aspect-[3/4] w-full max-w-xs sm:max-w-sm overflow-hidden rounded-lg border-2 border-border bg-secondary/5">
                  <img
                    src={currentPlayer.image || "/placeholder.svg"}
                    alt={currentPlayer.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Current Bid Status - Compact */}
              <div className="space-y-4 rounded-lg bg-secondary/5 p-4 sm:p-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Bid</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-primary">₹{(currentBid / 100000).toFixed(1)}L</span>
                  </div>
                </div>

                {/* Current Bidder */}
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Bidder</p>
                  <div
                    className="flex items-center gap-3 rounded p-3"
                    style={{ backgroundColor: `${currentTeam.color}20`, borderLeft: `4px solid ${currentTeam.color}` }}
                  >
                    <div className="h-8 w-8 rounded-full flex-shrink-0" style={{ backgroundColor: currentTeam.color }} />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm">{currentTeam.name}</p>
                      <p className="text-xs text-muted-foreground">Bid placed now</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bidding Status */}
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-accent/10 p-3 border border-accent/20">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse-subtle" />
                <span className="text-sm font-medium text-accent">
                  {isBiddingLive ? 'Bidding Live' : 'Bidding Closed'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Bidding History - Compact */}
          <div className="animate-slideUp">
            <div className="rounded-lg bg-card p-6 shadow-md border border-border h-full flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Bid History</h3>
              </div>

              <div className="space-y-2 overflow-y-auto flex-1">
                {biddingHistory.map((bid, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded border border-border bg-secondary/5 p-2 sm:p-3 transition-all hover:bg-secondary/10 animate-slideUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-xs sm:text-sm truncate">{bid.teamName}</p>
                      <p className="text-xs text-muted-foreground">
                        {bid.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="font-bold text-primary text-sm ml-2">₹{(bid.amount / 100000).toFixed(1)}L</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Teams Overview - Compact */}
        <div className="mt-8 sm:mt-12 animate-fadeIn">
          <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            Active Teams
          </h3>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="rounded-lg border-2 p-3 sm:p-4 text-center transition-all hover:shadow-md cursor-pointer"
                style={{
                  borderColor: team.color,
                  backgroundColor: `${team.color}05`,
                }}
              >
                <div
                  className="mx-auto mb-2 h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <p className="font-medium text-foreground text-xs sm:text-sm">{team.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
