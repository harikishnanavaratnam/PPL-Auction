'use client';

import Link from "next/link"
import { ChevronLeft } from 'lucide-react'; // Import ChevronLeft

import { useState } from "react"

import { Users } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface TeamPlayer {
  id: string;
  name: string;
  image: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  totalBudget: number;
  remainingBudget: number;
  players: TeamPlayer[];
}

const teamData: Record<string, Team> = {
  csk: {
    id: 'csk',
    name: 'Chennai Super Kings',
    color: '#FFD700',
    totalBudget: 1000000,
    remainingBudget: 250000,
    players: [
      { id: '1', name: 'MS Dhoni', image: 'https://via.placeholder.com/200x250?text=MS+Dhoni', role: 'Wicket-keeper' },
      { id: '2', name: 'Suresh Raina', image: 'https://via.placeholder.com/200x250?text=Suresh+Raina', role: 'Batsman' },
      { id: '3', name: 'Ravindra Jadeja', image: 'https://via.placeholder.com/200x250?text=Jadeja', role: 'All-rounder' },
      { id: '4', name: 'Deepak Chahar', image: 'https://via.placeholder.com/200x250?text=Chahar', role: 'Bowler' },
      { id: '5', name: 'Ruturaj Gaikwad', image: 'https://via.placeholder.com/200x250?text=Gaikwad', role: 'Batsman' },
      { id: '6', name: 'Shardul Thakur', image: 'https://via.placeholder.com/200x250?text=Thakur', role: 'All-rounder' },
    ],
  },
  mi: {
    id: 'mi',
    name: 'Mumbai Indians',
    color: '#003DA5',
    totalBudget: 1000000,
    remainingBudget: 380000,
    players: [
      { id: '1', name: 'Rohit Sharma', image: 'https://via.placeholder.com/200x250?text=Rohit+Sharma', role: 'Batsman' },
      { id: '2', name: 'Hardik Pandya', image: 'https://via.placeholder.com/200x250?text=Hardik', role: 'All-rounder' },
      { id: '3', name: 'Kieron Pollard', image: 'https://via.placeholder.com/200x250?text=Pollard', role: 'Batsman' },
      { id: '4', name: 'Jasprit Bumrah', image: 'https://via.placeholder.com/200x250?text=Bumrah', role: 'Bowler' },
      { id: '5', name: 'Ishan Kishan', image: 'https://via.placeholder.com/200x250?text=Kishan', role: 'Wicket-keeper' },
    ],
  },
  kkr: {
    id: 'kkr',
    name: 'Kolkata Knight Riders',
    color: '#3A1365',
    totalBudget: 1000000,
    remainingBudget: 420000,
    players: [
      { id: '1', name: 'Shreyas Iyer', image: 'https://via.placeholder.com/200x250?text=Iyer', role: 'Batsman' },
      { id: '2', name: 'Sunil Narine', image: 'https://via.placeholder.com/200x250?text=Narine', role: 'All-rounder' },
      { id: '3', name: 'Andre Russell', image: 'https://via.placeholder.com/200x250?text=Russell', role: 'All-rounder' },
      { id: '4', name: 'Varun Chakravarthy', image: 'https://via.placeholder.com/200x250?text=Chakra', role: 'Bowler' },
    ],
  },
  rcb: {
    id: 'rcb',
    name: 'Royal Challengers Bangalore',
    color: '#EC1C24',
    totalBudget: 1000000,
    remainingBudget: 320000,
    players: [
      { id: '1', name: 'Virat Kohli', image: 'https://via.placeholder.com/200x250?text=Virat', role: 'Batsman' },
      { id: '2', name: 'AB de Villiers', image: 'https://via.placeholder.com/200x250?text=ABD', role: 'Batsman' },
      { id: '3', name: 'Mohammed Siraj', image: 'https://via.placeholder.com/200x250?text=Siraj', role: 'Bowler' },
    ],
  },
  dc: {
    id: 'dc',
    name: 'Delhi Capitals',
    color: '#00245E',
    totalBudget: 1000000,
    remainingBudget: 450000,
    players: [
      { id: '1', name: 'Rishabh Pant', image: 'https://via.placeholder.com/200x250?text=Pant', role: 'Wicket-keeper' },
      { id: '2', name: 'Prithvi Shaw', image: 'https://via.placeholder.com/200x250?text=Shaw', role: 'Batsman' },
      { id: '3', name: 'Axar Patel', image: 'https://via.placeholder.com/200x250?text=Axar', role: 'All-rounder' },
    ],
  },
  rr: {
    id: 'rr',
    name: 'Rajasthan Royals',
    color: '#E74C3C',
    totalBudget: 1000000,
    remainingBudget: 380000,
    players: [
      { id: '1', name: 'Sanju Samson', image: 'https://via.placeholder.com/200x250?text=Samson', role: 'Wicket-keeper' },
      { id: '2', name: 'Jos Buttler', image: 'https://via.placeholder.com/200x250?text=Buttler', role: 'Batsman' },
      { id: '3', name: 'Yuzvendra Chahal', image: 'https://via.placeholder.com/200x250?text=Chahal', role: 'Bowler' },
    ],
  },
};

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const team = teamData[params.id] || teamData.csk;
  const [selectedPlayer, setSelectedPlayer] = useState<TeamPlayer | null>(null);

  const spentBudget = team.totalBudget - team.remainingBudget;
  const budgetPercentage = (spentBudget / team.totalBudget) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Team Info Bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Team Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg shadow-md flex-shrink-0"
              style={{ backgroundColor: team.color }}
            />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{team.name}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{team.players.length} Players Purchased</p>
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
            <p className="text-2xl font-bold text-foreground">₹{(team.totalBudget / 100000).toFixed(1)}L</p>
          </div>
          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <p className="mb-2 text-sm text-muted-foreground uppercase tracking-wider">Spent</p>
            <p className="text-2xl font-bold text-accent">₹{(spentBudget / 100000).toFixed(1)}L</p>
          </div>
          <div className="rounded-lg bg-card p-6 border border-border shadow-md">
            <p className="mb-2 text-sm text-muted-foreground uppercase tracking-wider">Remaining</p>
            <p className="text-2xl font-bold text-primary">₹{(team.remainingBudget / 100000).toFixed(1)}L</p>
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
            Squad ({team.players.length} players)
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.players.map((player, index) => (
              <div
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className={`cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 transform hover:scale-105 animate-slideUp ${
                  selectedPlayer?.id === player.id
                    ? 'border-primary shadow-lg'
                    : 'border-border hover:border-primary'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Container */}
                <div className="aspect-[3/4] overflow-hidden bg-secondary/10">
                  <img
                    src={player.image || "/placeholder.svg"}
                    alt={player.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                {/* Player Info */}
                <div className="bg-card p-4 border-t border-border">
                  <p className="font-semibold text-foreground">{player.name}</p>
                  <p className="text-xs text-muted-foreground">{player.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Player Details */}
        {selectedPlayer && (
          <div className="mt-12 rounded-lg bg-primary/5 p-8 border-2 border-primary shadow-md animate-slideDown">
            <h3 className="mb-4 text-lg font-bold text-foreground">Player Details</h3>
            <div className="flex gap-8">
              <div className="aspect-[3/4] w-32 overflow-hidden rounded-lg border-2 border-border">
                <img
                  src={selectedPlayer.image || "/placeholder.svg"}
                  alt={selectedPlayer.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Player Name</p>
                  <p className="text-2xl font-bold text-foreground">{selectedPlayer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="text-lg font-semibold text-accent">{selectedPlayer.role}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
