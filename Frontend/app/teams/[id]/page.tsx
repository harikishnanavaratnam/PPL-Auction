'use client';

import Link from "next/link"
import Image from 'next/image'
import { ChevronLeft, Users } from 'lucide-react';
import { useState, useEffect } from "react"
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { auctionAPI, getPlayerImageUrl, type Team, type Player } from '@/lib/api';
import { getTeamLogo } from '@/lib/teamUtils';

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    fetchTeam();
  }, [params.id]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await auctionAPI.getState();
      const foundTeam = response.teams.find(t => t._id === params.id);
      if (foundTeam) {
        setTeam(foundTeam);
      } else {
        setError('Team not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch team');
    } finally {
      setLoading(false);
    }
  };

  // Using centralized getPlayerImageUrl from @/lib/api

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading team...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || 'Team not found'}</p>
            <Link href="/teams" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent">
              Back to Teams
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const players = Array.isArray(team.roster) ? team.roster : [];
  const spentBudget = team.spent || 0;
  const remainingBudget = team.budget - spentBudget;
  const budgetPercentage = (spentBudget / team.budget) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Team Info Bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Team Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg shadow-md flex-shrink-0 overflow-hidden border-2 border-border">
              <Image
                src={getTeamLogo(team.name)}
                alt={team.name}
                width={64}
                height={64}
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{team.name}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{players.length} Players Purchased</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Budget Section */}
        <div className="mb-12 grid gap-6 md:grid-cols-3 animate-slideDown">
          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <p className="mb-2 text-sm text-muted-foreground uppercase tracking-wider">Total Budget</p>
            <p className="text-2xl font-bold text-foreground">{team.budget}</p>
          </div>
          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <p className="mb-2 text-sm text-muted-foreground uppercase tracking-wider">Spent</p>
            <p className="text-2xl font-bold text-accent">{spentBudget}</p>
          </div>
          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <p className="mb-2 text-sm text-muted-foreground uppercase tracking-wider">Remaining</p>
            <p className="text-2xl font-bold text-primary">{remainingBudget}</p>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="mb-12 rounded-lg bg-card p-6 border border-border shadow-md animate-slideUp">
          <p className="mb-3 text-sm font-medium text-foreground">Budget Allocation</p>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{budgetPercentage.toFixed(0)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Players Grid */}
        <div className="animate-fadeIn">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
            <Users className="h-6 w-6" />
            Squad ({players.length} players)
          </h2>
          {players.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((player: Player, index: number) => (
                <div
                  key={player._id || index}
                  onClick={() => setSelectedPlayer(player)}
                  className={`cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 transform hover:scale-105 animate-slideUp ${
                    selectedPlayer?._id === player._id
                      ? 'border-primary shadow-lg'
                      : 'border-border hover:border-primary'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image Container */}
                  <div className="aspect-[3/4] overflow-hidden bg-secondary/10">
                    <img
                      src={getPlayerImageUrl(player)}
                      alt={player.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Player Info */}
                  <div className="bg-card p-4 border-t border-border">
                    <p className="font-semibold text-foreground">{player.name}</p>
                    {player.category && (
                      <p className="text-xs text-muted-foreground">{player.category}</p>
                    )}
                    {player.soldPrice && (
                      <p className="text-xs text-muted-foreground">Sold for: {player.soldPrice}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No players in roster yet</p>
            </div>
          )}
        </div>

        {/* Selected Player Details */}
        {selectedPlayer && (
          <div className="mt-12 rounded-lg bg-primary/5 p-8 border-2 border-primary shadow-md animate-slideDown">
            <h3 className="mb-4 text-lg font-bold text-foreground">Player Details</h3>
            <div className="flex gap-8">
              <div className="aspect-[3/4] w-32 overflow-hidden rounded-lg border-2 border-border">
                <img
                  src={getPlayerImageUrl(selectedPlayer)}
                  alt={selectedPlayer.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Player Name</p>
                  <p className="text-2xl font-bold text-foreground">{selectedPlayer.name}</p>
                </div>
                {selectedPlayer.category && (
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="text-lg font-semibold text-accent">{selectedPlayer.category}</p>
                  </div>
                )}
                {selectedPlayer.soldPrice && (
                  <div>
                    <p className="text-sm text-muted-foreground">Sold Price</p>
                    <p className="text-lg font-semibold text-primary">{selectedPlayer.soldPrice}</p>
                  </div>
                )}
                {selectedPlayer.basePrice && (
                  <div>
                    <p className="text-sm text-muted-foreground">Base Price</p>
                    <p className="text-lg font-semibold text-muted-foreground">{selectedPlayer.basePrice}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
