'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { auctionAPI, type Team, type Player, type AuctionState } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { getTeamLogo } from '@/lib/teamUtils';

export default function LiveHistoryPage() {
  const [state, setState] = useState<AuctionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { auctionState } = useSocket();

  useEffect(() => {
    if (auctionState) {
      setState(auctionState.state);
      setLoading(false);
      setError(null);
    } else {
      fetchState();
    }
  }, [auctionState]);

  const fetchState = async () => {
    try {
      const response = await auctionAPI.getState();
      setState(response.state);
      setLoading(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch auction history');
      setLoading(false);
    }
  };

  const recentBids =
    state?.history
      ?.slice()
      .reverse()
      .map((h) => ({
        player: h.player as Player,
        team: h.team as Team,
        amount: h.soldPrice,
        timestamp: h.timestamp || new Date(),
      })) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bidding History
            </h1>
          </div>
          <Link
            href="/live"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Live
          </Link>
        </div>

        {loading && !state && (
          <p className="text-sm text-muted-foreground">Loading history...</p>
        )}

        {error && !state && (
          <p className="text-sm text-destructive mb-2">{error}</p>
        )}

        {recentBids.length === 0 && !loading ? (
          <div className="mt-8 flex flex-col items-center justify-center text-center text-muted-foreground">
            <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-3">
              <Volume2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">No sales yet</p>
            <p className="text-xs mt-1">Completed sales will appear here.</p>
          </div>
        ) : (
          <div className="mt-2 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 custom-scrollbar">
            {recentBids.map((bid, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-card border border-border overflow-hidden flex-shrink-0">
                  <Image
                    src={getTeamLogo(bid.team?.name || '')}
                    alt={bid.team?.name || 'Team'}
                    width={48}
                    height={48}
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {bid.team?.name || 'Unknown Team'}
                  </p>
                  <p className="text-sm font-semibold truncate">
                    {bid.player?.name || 'Unknown Player'}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {bid.timestamp ? new Date(bid.timestamp).toLocaleString() : ''}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base sm:text-lg font-bold text-primary">
                    {bid.amount || 0}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">
                    Units
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

