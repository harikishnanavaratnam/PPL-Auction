'use client';

import { useState } from 'react';
import { Play, Pause, Plus } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface Team {
  id: number;
  name: string;
  budgetRemaining: number;
  recentAcquisitions: string[];
  color: string;
}

interface Player {
  id: string;
  name: string;
  image: string;
  basePrice: number;
  role: string;
  style: string;
}

const TEAMS: Team[] = [
  { id: 1, name: 'Nesamanai XI', budgetRemaining: 4150, recentAcquisitions: ['D Kartik', 'U Sthong', 'Sai Empty'], color: '#DC2626' },
  { id: 2, name: 'Vadivelus Warriors', budgetRemaining: 5000, recentAcquisitions: ['Bidding yet to commence'], color: '#F97316' },
  { id: 3, name: 'PPL Titans', budgetRemaining: 3200, recentAcquisitions: ['S Tendulkar', 'Sai Empty'], color: '#8B5CF6' },
  { id: 4, name: 'Contractor XI', budgetRemaining: 4800, recentAcquisitions: ['M Singh', 'Sai Empty'], color: '#06B6D4' },
  { id: 5, name: 'Palace Royal', budgetRemaining: 2100, recentAcquisitions: ['K Petersen', 'G Maxwell', 'Sai Empty'], color: '#EC4899' },
  { id: 6, name: 'Fortress XI', budgetRemaining: 5000, recentAcquisitions: ['Bidding yet to commence'], color: '#10B981' },
];

const CURRENT_PLAYER: Player = {
  id: 'p1',
  name: 'Suresh Raina',
  image: '/placeholder.svg',
  basePrice: 200,
  role: 'Left-Hand Batsman',
  style: 'Base Price: 200',
};

export default function AdminPage() {
  const [isAuctionLive, setIsAuctionLive] = useState(true);
  const [currentBid, setCurrentBid] = useState(850);
  const [currentBidder, setCurrentBidder] = useState('Nesamanai XI');
  const [manualBid, setManualBid] = useState('');

  const toggleAuctionStatus = () => {
    setIsAuctionLive(!isAuctionLive);
  };

  const handleQuickIncrement = (amount: number) => {
    setCurrentBid(currentBid + amount);
  };

  const handleAuthorizeBid = () => {
    if (manualBid && parseInt(manualBid) > currentBid) {
      setCurrentBid(parseInt(manualBid));
      setManualBid('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Status Bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">Auction Control</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Live Auction Management</p>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={toggleAuctionStatus}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isAuctionLive
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                    : 'bg-muted text-muted-foreground hover:bg-muted/90'
                }`}
              >
                {isAuctionLive ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Resume
                  </>
                )}
              </button>
              <div className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                isAuctionLive
                  ? 'bg-accent/10 text-accent border border-accent/30'
                  : 'bg-muted/10 text-muted-foreground border border-muted/30'
              }`}>
                <div className={`h-2 w-2 rounded-full ${isAuctionLive ? 'bg-accent animate-pulse-subtle' : 'bg-muted'}`} />
                {isAuctionLive ? 'LIVE NOW' : 'Paused'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Auction Display */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Left Sidebar - Teams */}
          <div className="lg:col-span-2 space-y-4 animate-slideDown">
            {TEAMS.slice(0, 3).map((team, idx) => (
              <div key={team.id} className="rounded-lg bg-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: team.color }}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-foreground">{team.name}</h3>
                    <span className="text-lg font-bold text-accent">{team.budgetRemaining}</span>
                  </div>

                  <p className="text-xs text-muted-foreground uppercase font-medium mb-2">Recent Acquisitions</p>
                  <div className="space-y-1">
                    {team.recentAcquisitions.map((acq, i) => (
                      <p key={i} className="text-xs text-foreground">{acq}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Center - Player Card */}
          <div className="lg:col-span-8 animate-slideUp">
            <div className="rounded-lg bg-card border border-border shadow-lg overflow-hidden h-full flex flex-col">
              {/* Top Section */}
              <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 sm:p-6 border-b border-border">
                <div className="text-center mb-4">
                  <span className="inline-block bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-2">
                    ● LIVE NOW
                  </span>
                  <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-2">LOT 42 - MARQUEE PLAYER</p>
                </div>
              </div>

              {/* Player Image */}
              <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-xs aspect-square rounded-lg overflow-hidden border-2 border-border shadow-lg mb-4 sm:mb-6">
                  <img
                    src={CURRENT_PLAYER.image || "/placeholder.svg"}
                    alt={CURRENT_PLAYER.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-2">{CURRENT_PLAYER.name}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground text-center mb-4">{CURRENT_PLAYER.role.toUpperCase()} - {CURRENT_PLAYER.style}</p>

                {/* Current Bid Display */}
                <div className="w-full max-w-xs rounded-lg bg-secondary/10 p-4 sm:p-6 text-center border border-secondary/20 mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Current Highest Bidder</p>
                  <p className="text-lg sm:text-xl font-bold text-foreground mb-3">{currentBidder}</p>

                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Current Valuation</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-primary">{currentBid}</span>
                    <span className="text-sm text-muted-foreground">UNITS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Teams */}
          <div className="lg:col-span-2 space-y-4 animate-slideDown">
            {TEAMS.slice(3, 6).map((team, idx) => (
              <div key={team.id} className="rounded-lg bg-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: team.color }}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-foreground">{team.name}</h3>
                    <span className="text-lg font-bold text-accent">{team.budgetRemaining}</span>
                  </div>

                  <p className="text-xs text-muted-foreground uppercase font-medium mb-2">Recent Acquisitions</p>
                  <div className="space-y-1">
                    {team.recentAcquisitions.map((acq, i) => (
                      <p key={i} className="text-xs text-foreground">{acq}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Controls */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 mt-6 sm:mt-8 animate-fadeIn">
          {/* Quick Increments */}
          <div className="rounded-lg bg-card border border-border p-4 sm:p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <h3 className="text-sm sm:text-base font-bold text-foreground uppercase">Quick Increments</h3>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleQuickIncrement(50)}
                className="w-full bg-white text-foreground border-2 border-primary font-bold py-3 rounded-lg hover:bg-primary/5 transition-colors uppercase text-sm"
              >
                Add 50 Units
              </button>
              <button
                onClick={() => handleQuickIncrement(100)}
                className="w-full bg-white text-foreground border-2 border-primary font-bold py-3 rounded-lg hover:bg-primary/5 transition-colors uppercase text-sm"
              >
                Add 100 Units
              </button>
              <button
                onClick={() => handleQuickIncrement(500)}
                className="w-full bg-white text-foreground border-2 border-primary font-bold py-3 rounded-lg hover:bg-primary/5 transition-colors uppercase text-sm"
              >
                Add 500 Units
              </button>
            </div>
          </div>

          {/* Manual Valuation */}
          <div className="rounded-lg bg-card border border-border p-4 sm:p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <h3 className="text-sm sm:text-base font-bold text-foreground uppercase">Manual Valuation</h3>
            </div>

            <div className="space-y-3">
              <input
                type="number"
                placeholder="Enter Amount"
                value={manualBid}
                onChange={(e) => setManualBid(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-primary/30 bg-input text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />

              <button
                onClick={handleAuthorizeBid}
                disabled={!manualBid}
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase text-sm"
              >
                Authorize Bid
              </button>
            </div>
          </div>
        </div>

        {/* Bid Log */}
        <div className="mt-6 sm:mt-8 rounded-lg bg-card border border-border p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <h3 className="text-sm sm:text-base font-bold text-foreground uppercase">Bid Log</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Highest Bidder</p>
              <p className="font-bold text-foreground">{currentBidder}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Players Left</p>
              <p className="font-bold text-foreground">84</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Total Spent</p>
              <p className="font-bold text-accent">8,450 Units</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
