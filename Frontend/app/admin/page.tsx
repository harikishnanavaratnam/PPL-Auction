'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Plus, Check, X, RefreshCw, UserPlus, Save } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { auctionAPI, calculateNextBid, getPlayerImageUrl, type Team, type Player, type AuctionState } from '@/lib/api';
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

export default function AdminPage() {
  const [state, setState] = useState<AuctionState | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualBid, setManualBid] = useState('');
  const [isSelectingPlayer, setIsSelectingPlayer] = useState(false);
  const [unsoldPlayers, setUnsoldPlayers] = useState<Player[]>([]);
  const [showSellOptions, setShowSellOptions] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isManagingFixedPlayers, setIsManagingFixedPlayers] = useState(false);
  const [selectedTeamForFixed, setSelectedTeamForFixed] = useState<Team | null>(null);
  const [selectedCaptain, setSelectedCaptain] = useState<string | null>(null);
  const [selectedFixedPlayers, setSelectedFixedPlayers] = useState<string[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  // Use Socket.io for real-time updates
  const { auctionState, isConnected } = useSocket();

  // Update state from Socket.io or fallback to initial fetch
  useEffect(() => {
    if (auctionState) {
      setState(auctionState.state);
      setTeams(auctionState.teams);
      if (auctionState.state.currentPlayer) {
        if (typeof auctionState.state.currentPlayer === 'object') {
          setCurrentPlayer(auctionState.state.currentPlayer as Player);
        } else {
          setCurrentPlayer(null);
        }
      } else {
        setCurrentPlayer(null);
      }
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

      // Fetch current player details if available
      if (response.state.currentPlayer) {
        // If currentPlayer is a string ID, we need to fetch it
        // For now, assuming it's populated in the response
        if (typeof response.state.currentPlayer === 'object') {
          setCurrentPlayer(response.state.currentPlayer as Player);
        }
      } else {
        setCurrentPlayer(null);
      }

      setLoading(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch auction state');
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    if (!confirm('This will reset the entire auction. Are you sure?')) return;
    setActionLoading('initialize');
    try {
      const resp = await auctionAPI.initialize();
      // Socket.io will automatically update the state
      const warnings: string[] = [];
      if (resp?.setup?.players?.warning) warnings.push(resp.setup.players.warning);
      if (resp?.setup?.players?.errors) warnings.push(`Player import errors: ${resp.setup.players.errors}`);
      alert(
        warnings.length > 0
          ? `Auction initialized (PAUSED).\n\nSetup notes:\n- ${warnings.join('\n- ')}`
          : 'Auction initialized (PAUSED). Click "Start Auction" to go LIVE.'
      );
    } catch (err: any) {
      alert(err.message || 'Failed to initialize auction');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartAuction = async () => {
    setActionLoading('start-auction');
    try {
      await auctionAPI.startAuction();
      alert('Auction started (LIVE)');
    } catch (err: any) {
      alert(err.message || 'Failed to start auction');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePauseAuction = async () => {
    setActionLoading('stop-auction');
    try {
      await auctionAPI.stopAuction();
      alert('Auction paused');
    } catch (err: any) {
      alert(err.message || 'Failed to pause auction');
    } finally {
      setActionLoading(null);
    }
  };

  const handleNextPlayer = async () => {
    setActionLoading('next-player');
    try {
      await auctionAPI.nextPlayer();
      // Socket.io will automatically update the state
      setShowSellOptions(false);
    } catch (err: any) {
      alert(err.message || 'Failed to get next player');
    } finally {
      setActionLoading(null);
    }
  };

  const handleManualSelect = async () => {
    setActionLoading('select');
    try {
      const response = await auctionAPI.getUnsoldPlayers();
      setUnsoldPlayers(response.players);
      setIsSelectingPlayer(true);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch unsold players');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSelectPlayer = async (playerId: string) => {
    setActionLoading('select-player');
    try {
      await auctionAPI.selectPlayer(playerId);
      await fetchState();
      setIsSelectingPlayer(false);
      setShowSellOptions(false);
    } catch (err: any) {
      alert(err.message || 'Failed to select player');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBid = async (teamId: string, amount: number) => {
    setActionLoading(`bid-${teamId}`);
    try {
      await auctionAPI.placeBid(teamId, amount);
      // Socket.io will automatically update the state
    } catch (err: any) {
      alert(err.message || 'Failed to place bid');
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickIncrement = () => {
    if (!state || !state.currentPlayer) return;
    const nextBid = calculateNextBid(state.currentBid);
    if (state.currentBidder && typeof state.currentBidder === 'object' && '_id' in state.currentBidder) {
      const bidderTeam = state.currentBidder as Team;
      handleBid(bidderTeam._id, nextBid);
    }
  };

  const handleCustomBid = async () => {
    if (!state || !manualBid) return;
    const amount = parseInt(manualBid);
    if (amount <= state.currentBid) {
      alert(`Bid must be higher than current bid of ${state.currentBid}`);
      return;
    }
    // For custom bids, we need a team - for now, we'll use current bidder or first team
    let teamId: string;
    if (state.currentBidder && typeof state.currentBidder === 'object' && '_id' in state.currentBidder) {
      teamId = (state.currentBidder as Team)._id;
    } else {
      teamId = teams[0]._id;
    }
    await handleBid(teamId, amount);
    setManualBid('');
  };

  const handleSell = async () => {
    if (!state || !state.currentBidder) {
      alert('No current bidder');
      return;
    }
    setActionLoading('sell');
    try {
      await auctionAPI.sellPlayer();
      await fetchState();
      setShowSellOptions(false);
      setCurrentPlayer(null);
    } catch (err: any) {
      alert(err.message || 'Failed to sell player');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnsold = async () => {
    if (!state || !state.currentPlayer) return;
    setActionLoading('unsold');
    try {
      await auctionAPI.markUnsold();
      // Socket.io will automatically update the state
      setShowSellOptions(false);
      setCurrentPlayer(null);
    } catch (err: any) {
      alert(err.message || 'Failed to mark as unsold');
    } finally {
      setActionLoading(null);
    }
  };

  const handleNextRound = async () => {
    setActionLoading('next-round');
    try {
      await auctionAPI.nextRound();
      await fetchState();
    } catch (err: any) {
      alert(err.message || 'Failed to increment round');
    } finally {
      setActionLoading(null);
    }
  };

  // Using centralized getPlayerImageUrl from @/lib/api

  const getTeamColor = (teamName: string): string => {
    return TEAM_COLORS[teamName.toUpperCase()] || '#5c2e2a';
  };

  const getUnsoldCount = () => {
    return teams.reduce((acc, team) => acc + (team.roster?.length || 0), 0);
  };

  // Calculate total squad size (roster + captain + fixed players)
  const getTotalSquadSize = (team: Team): number => {
    const rosterSize = Array.isArray(team.roster) ? team.roster.length : 0;
    const fixedCount = Array.isArray(team.fixedPlayers) ? team.fixedPlayers.length : 0;
    const captainCount = team.captain ? 1 : 0;
    return rosterSize + fixedCount + captainCount;
  };

  // Check if team can bid based on auction rules
  const canTeamBid = (team: Team, bidAmount: number): { canBid: boolean; reason?: string } => {
    const totalSquadSize = getTotalSquadSize(team);
    const isRound1 = state?.currentRound === 1;

    // Rule 3: Maximum squad size is 15
    if (totalSquadSize >= 15) {
      return { canBid: false, reason: 'Max squad size (15) reached' };
    }

    // Rule 9: If team finishes 5000 points in round 1, cannot bid
    if (isRound1 && team.spent >= 5000) {
      return { canBid: false, reason: 'Round 1 budget exhausted' };
    }

    // Rule 8: If team needs to complete 13 players, ensure minimum 100 per remaining player
    const playersNeeded = 13 - totalSquadSize;
    if (playersNeeded > 0) {
      const remainingBudget = team.budget - bidAmount;
      const minRequired = playersNeeded * 100;
      if (remainingBudget < minRequired) {
        return { 
          canBid: false, 
          reason: `Need ${playersNeeded} more players. Min ${minRequired} points required` 
        };
      }
    }

    // Rule 6 & 7: If team finishes 5000 points, they must have 13 players
    if (isRound1 && (team.spent + bidAmount) >= 5000) {
      if (totalSquadSize + 1 < 13) {
        return { 
          canBid: false, 
          reason: `Cannot exhaust 5000 points. Need at least 13 players (currently ${totalSquadSize + 1})` 
        };
      }
    }

    // Basic budget check
    if (team.budget < bidAmount) {
      return { canBid: false, reason: 'Insufficient budget' };
    }

    return { canBid: true };
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

  const isAuctionLive = state?.isAuctionActive || false;
  const currentBid = state?.currentBid || 0;
  const currentBidderTeam = state?.currentBidder as Team | null;

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

      {/* Status Bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">Auction Control</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Round {state?.currentRound || 1} | Players Sold: {state?.history?.length || 0}
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {isAuctionLive ? (
                <button
                  onClick={handlePauseAuction}
                  disabled={actionLoading === 'stop-auction'}
                  className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  title="Pause auction (disable bidding & player draw)"
                >
                  <Pause className="h-4 w-4" />
                  {actionLoading === 'stop-auction' ? 'Pausing...' : 'Pause Auction'}
                </button>
              ) : (
                <button
                  onClick={handleStartAuction}
                  disabled={actionLoading === 'start-auction'}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  title="Start auction (enable bidding & player draw)"
                >
                  <Play className="h-4 w-4" />
                  {actionLoading === 'start-auction' ? 'Starting...' : 'Start Auction'}
                </button>
              )}
              {!state?.currentPlayer && (
                <>
                  <button
                    onClick={handleNextPlayer}
                    disabled={actionLoading === 'next-player' || !isAuctionLive}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    {actionLoading === 'next-player' ? 'Loading...' : 'Next Player'}
                  </button>
                  <button
                    onClick={handleManualSelect}
                    disabled={actionLoading === 'select' || !isAuctionLive}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    {actionLoading === 'select' ? 'Loading...' : 'Select Player'}
                  </button>
                </>
              )}
              <button
                onClick={async () => {
                  try {
                    // Fetch all players for selection
                    const response = await auctionAPI.getUnsoldPlayers();
                    // Get all players from state (sold + unsold)
                    const stateResponse = await auctionAPI.getState();
                    const soldPlayers: Player[] = [];
                    stateResponse.teams.forEach(team => {
                      if (team.roster && Array.isArray(team.roster)) {
                        team.roster.forEach((player: any) => {
                          if (typeof player === 'object' && player._id) {
                            soldPlayers.push(player as Player);
                          }
                        });
                      }
                    });
                    setAllPlayers([...response.players, ...soldPlayers]);
                    setIsManagingFixedPlayers(true);
                  } catch (err: any) {
                    alert(err.message || 'Failed to fetch players');
                  }
                }}
                className="px-4 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-all text-sm"
              >
                Manage Fixed Players
              </button>
              <button
                onClick={async () => {
                  if (!confirm('This will import all players from Frontend/public/PLAYERS folder. Continue?')) return;
                  setActionLoading('import-players');
                  try {
                    const response = await auctionAPI.importPlayers();
                    await fetchState();
                    alert(response.message || 'Players imported successfully!');
                  } catch (err: any) {
                    alert(err.message || 'Failed to import players. Make sure image files are in Frontend/public/PLAYERS folder.');
                  } finally {
                    setActionLoading(null);
                  }
                }}
                disabled={actionLoading === 'import-players'}
                className="px-4 py-2 border-2 border-accent text-accent rounded-lg font-medium hover:bg-accent/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                {actionLoading === 'import-players' ? 'Importing...' : 'Import Players from Drive'}
              </button>
              <button
                onClick={handleInitialize}
                disabled={actionLoading === 'initialize'}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 disabled:opacity-50 text-sm"
              >
                {actionLoading === 'initialize' ? 'Initializing...' : 'Reset Auction'}
              </button>
              <div
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  isAuctionLive
                    ? 'bg-accent/10 text-accent border border-accent/30'
                    : 'bg-muted/10 text-muted-foreground border border-muted/30'
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${isAuctionLive ? 'bg-accent animate-pulse-subtle' : 'bg-muted'}`}
                />
                {isAuctionLive ? 'LIVE NOW' : 'PAUSED'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Fixed Players Modal */}
      {isManagingFixedPlayers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Manage Captain & Fixed Players</h2>
              <button
                onClick={() => {
                  setIsManagingFixedPlayers(false);
                  setSelectedTeamForFixed(null);
                  setSelectedCaptain(null);
                  setSelectedFixedPlayers([]);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {!selectedTeamForFixed ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">Select a team to manage their Captain and Fixed Players (2 total)</p>
                {teams.map((team) => (
                  <button
                    key={team._id}
                    onClick={() => {
                      setSelectedTeamForFixed(team);
                      setSelectedCaptain(team.captain ? (typeof team.captain === 'string' ? team.captain : team.captain._id) : null);
                      setSelectedFixedPlayers(
                        Array.isArray(team.fixedPlayers) 
                          ? team.fixedPlayers.map(p => typeof p === 'string' ? p : p._id)
                          : []
                      );
                    }}
                    className="w-full p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 text-left transition-all"
                  >
                    <p className="font-medium text-foreground">{team.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Captain: {team.captain ? 'Set' : 'Not set'} | Fixed: {Array.isArray(team.fixedPlayers) ? team.fixedPlayers.length : 0}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Team: {selectedTeamForFixed.name}</p>
                  <p className="text-xs text-muted-foreground mb-4">Select 1 Captain and 1 Fixed Player (or 2 Fixed Players if no Captain)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Select Captain (Optional)</label>
                  <select
                    value={selectedCaptain || ''}
                    onChange={(e) => setSelectedCaptain(e.target.value || null)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  >
                    <option value="">No Captain</option>
                    {allPlayers.map((player: Player) => (
                      <option key={player._id} value={player._id}>
                        {player.name} {player.status === 'Sold' ? `(Sold to ${typeof player.team === 'object' && player.team ? player.team.name : 'Team'})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Select Fixed Players (Max 2, or 1 if Captain selected)</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {allPlayers.map((player: Player) => {
                      const playerId = player._id;
                      const isSelected = selectedFixedPlayers.includes(playerId);
                      const isCaptain = selectedCaptain === playerId;
                      const maxFixed = selectedCaptain ? 1 : 2;
                      return (
                        <label key={playerId} className="flex items-center gap-2 p-2 border border-border rounded-lg hover:bg-primary/5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isCaptain || (!isSelected && selectedFixedPlayers.length >= maxFixed)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (selectedFixedPlayers.length < maxFixed) {
                                  setSelectedFixedPlayers([...selectedFixedPlayers, playerId]);
                                }
                              } else {
                                setSelectedFixedPlayers(selectedFixedPlayers.filter(id => id !== playerId));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm text-foreground">
                            {player.name}
                            {isCaptain && <span className="text-xs text-primary ml-2">(Captain)</span>}
                            {player.status === 'Sold' && <span className="text-xs text-muted-foreground ml-2">(Sold)</span>}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={async () => {
                      try {
                        setActionLoading('set-fixed');
                        await auctionAPI.setTeamFixed(
                          selectedTeamForFixed._id,
                          selectedCaptain,
                          selectedFixedPlayers
                        );
                        await fetchState();
                        setIsManagingFixedPlayers(false);
                        setSelectedTeamForFixed(null);
                        setSelectedCaptain(null);
                        setSelectedFixedPlayers([]);
                      } catch (err: any) {
                        alert(err.message || 'Failed to update fixed players');
                      } finally {
                        setActionLoading(null);
                      }
                    }}
                    disabled={actionLoading === 'set-fixed' || (selectedFixedPlayers.length === 0 && !selectedCaptain)}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading === 'set-fixed' ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTeamForFixed(null);
                      setSelectedCaptain(null);
                      setSelectedFixedPlayers([]);
                    }}
                    className="px-4 py-2 border border-border rounded-lg font-medium hover:bg-primary/5 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Player Selection Modal */}
      {isSelectingPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Select Player</h2>
              <button
                onClick={() => setIsSelectingPlayer(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {unsoldPlayers.map((player) => (
                <button
                  key={player._id}
                  onClick={() => handleSelectPlayer(player._id)}
                  disabled={actionLoading === 'select-player'}
                  className="p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 text-left transition-all disabled:opacity-50"
                >
                  <p className="font-medium text-foreground">{player.name}</p>
                  <p className="text-xs text-muted-foreground">Base: {player.basePrice}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Auction Display */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Left Sidebar - Teams */}
          <div className="lg:col-span-2 space-y-4 animate-slideDown">
            {teams.slice(0, 3).map((team) => (
              <div
                key={team._id}
                className="rounded-lg bg-card border-2 border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover-lift group"
              >
                <div className="h-2 w-full" style={{ backgroundColor: getTeamColor(team.name) }} />
                <div className="p-4">
                  {/* Team Logo */}
                  <div className="flex justify-center mb-3">
                    <div className="h-12 w-12 rounded-lg bg-card border-2 border-border overflow-hidden flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={getTeamLogo(team.name)}
                        alt={team.name}
                        width={48}
                        height={48}
                        className="object-contain p-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xs text-foreground leading-tight text-center flex-1">{team.name}</h3>
                    <span className="text-lg font-bold text-accent ml-2">{team.budget}</span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
                    Squad: {getTotalSquadSize(team)}/15 (Roster: {Array.isArray(team.roster) ? team.roster.length : 0})
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Spent: {team.spent}/{state?.currentRound === 1 ? 5000 : '∞'}
                  </p>
                  {state?.currentPlayer && (() => {
                    const nextBid = calculateNextBid(currentBid);
                    const bidCheck = canTeamBid(team, nextBid);
                    return (
                      <button
                        onClick={() => handleBid(team._id, nextBid)}
                        disabled={
                          actionLoading?.startsWith('bid-') ||
                          !bidCheck.canBid ||
                          !isAuctionLive
                        }
                        className={`w-full mt-2 py-1.5 text-xs font-medium rounded transition-colors ${
                          bidCheck.canBid && isAuctionLive
                            ? 'bg-primary text-primary-foreground hover:bg-accent'
                            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        }`}
                        title={bidCheck.reason || ''}
                      >
                        Bid {nextBid}
                      </button>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>

          {/* Center - Player Card */}
          <div className="lg:col-span-8 animate-slideUp">
            {state?.currentPlayer ? (
              <div className="rounded-lg bg-card border border-border shadow-lg overflow-hidden h-full flex flex-col">
                {/* Top Section */}
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 sm:p-6 border-b border-border">
                  <div className="text-center mb-4">
                    <span className="inline-block bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-2">
                      ● LIVE NOW
                    </span>
                    <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      ROUND {state.currentRound}
                    </p>
                  </div>
                </div>

                {/* Player Image */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                  <div className="w-full max-w-xs aspect-square rounded-lg overflow-hidden border-2 border-border shadow-lg mb-4 sm:mb-6">
                    <img
                      src={getPlayerImageUrl(state.currentPlayer as Player)}
                      alt={state.currentPlayer.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-2">
                    {state.currentPlayer.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center mb-4">
                    {state.currentPlayer.category?.toUpperCase() || 'PLAYER'} - Base Price: {state.currentPlayer.basePrice}
                  </p>

                  {/* Current Bid Display */}
                  <div className="w-full max-w-xs rounded-lg bg-secondary/10 p-4 sm:p-6 text-center border border-secondary/20 mb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                      Current Highest Bidder
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-foreground mb-3">
                      {currentBidderTeam?.name || 'No Bids Yet'}
                    </p>

                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Current Valuation</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl sm:text-4xl font-bold text-primary">{currentBid || state.currentPlayer.basePrice}</span>
                      <span className="text-sm text-muted-foreground">UNITS</span>
                    </div>
                  </div>

                  {/* Sell/Unsold Buttons */}
                  {currentBidderTeam && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleSell}
                        disabled={actionLoading === 'sell'}
                        className="flex items-center gap-2 px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 transition-all"
                      >
                        <Check className="h-4 w-4" />
                        {actionLoading === 'sell' ? 'Selling...' : 'Sell'}
                      </button>
                      <button
                        onClick={handleUnsold}
                        disabled={actionLoading === 'unsold'}
                        className="flex items-center gap-2 px-6 py-2 border-2 border-muted text-foreground rounded-lg font-medium hover:bg-muted/10 disabled:opacity-50 transition-all"
                      >
                        <X className="h-4 w-4" />
                        {actionLoading === 'unsold' ? 'Marking...' : 'Unsold'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-card border border-border shadow-lg overflow-hidden h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-xl text-muted-foreground mb-4">No player currently being auctioned</p>
                  <button
                    onClick={handleNextPlayer}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-accent transition-all"
                  >
                    Draw Next Player
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Teams */}
          <div className="lg:col-span-2 space-y-4 animate-slideDown">
            {teams.slice(3, 6).map((team) => (
              <div
                key={team._id}
                className="rounded-lg bg-card border-2 border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover-lift group"
              >
                <div className="h-2 w-full" style={{ backgroundColor: getTeamColor(team.name) }} />
                <div className="p-4">
                  {/* Team Logo */}
                  <div className="flex justify-center mb-3">
                    <div className="h-12 w-12 rounded-lg bg-card border-2 border-border overflow-hidden flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={getTeamLogo(team.name)}
                        alt={team.name}
                        width={48}
                        height={48}
                        className="object-contain p-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xs text-foreground leading-tight text-center flex-1">{team.name}</h3>
                    <span className="text-lg font-bold text-accent ml-2">{team.budget}</span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
                    Squad: {getTotalSquadSize(team)}/15 (Roster: {Array.isArray(team.roster) ? team.roster.length : 0})
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Spent: {team.spent}/{state?.currentRound === 1 ? 5000 : '∞'}
                  </p>
                  {state?.currentPlayer && (() => {
                    const nextBid = calculateNextBid(currentBid);
                    const bidCheck = canTeamBid(team, nextBid);
                    return (
                      <button
                        onClick={() => handleBid(team._id, nextBid)}
                        disabled={
                          actionLoading?.startsWith('bid-') ||
                          !bidCheck.canBid ||
                          !isAuctionLive
                        }
                        className={`w-full mt-2 py-1.5 text-xs font-medium rounded transition-colors ${
                          bidCheck.canBid && isAuctionLive
                            ? 'bg-primary text-primary-foreground hover:bg-accent'
                            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        }`}
                        title={bidCheck.reason || ''}
                      >
                        Bid {nextBid}
                      </button>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Controls */}
        {state?.currentPlayer && (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 mt-6 sm:mt-8 animate-fadeIn">
            {/* Quick Increments */}
            <div className="rounded-lg bg-card border border-border p-4 sm:p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <h3 className="text-sm sm:text-base font-bold text-foreground uppercase">Quick Increments</h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleQuickIncrement}
                  disabled={!currentBidderTeam || actionLoading?.startsWith('bid-')}
                  className="w-full bg-white text-foreground border-2 border-primary font-bold py-3 rounded-lg hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase text-sm"
                >
                  Add {currentBid >= 200 ? currentBid >= 1000 ? 500 : 100 : 50} Units
                </button>
                {currentBidderTeam && (
                  <button
                    onClick={() => {
                      const nextBid = calculateNextBid(currentBid);
                      handleBid(currentBidderTeam._id, nextBid);
                    }}
                    disabled={actionLoading?.startsWith('bid-')}
                    className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-accent disabled:opacity-50 transition-colors uppercase text-sm"
                  >
                    {currentBidderTeam.name} Bids {calculateNextBid(currentBid)}
                  </button>
                )}
              </div>
            </div>

            {/* Manual Valuation */}
            <div className="rounded-lg bg-card border border-border p-4 sm:p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <h3 className="text-sm sm:text-base font-bold text-foreground uppercase">Custom Bid</h3>
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
                  onClick={handleCustomBid}
                  disabled={!manualBid || actionLoading?.startsWith('bid-')}
                  className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase text-sm"
                >
                  {actionLoading?.startsWith('bid-') ? 'Bidding...' : 'Place Custom Bid'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Round Actions */}
        {!state?.currentPlayer && (
          <div className="mt-6 sm:mt-8 flex gap-4 justify-center">
            <button
              onClick={handleNextRound}
              disabled={actionLoading === 'next-round'}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-accent disabled:opacity-50 transition-all"
            >
              {actionLoading === 'next-round' ? 'Loading...' : 'Next Round'}
            </button>
          </div>
        )}

        {/* Bid Log */}
        <div className="mt-6 sm:mt-8 rounded-lg bg-card border border-border p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <h3 className="text-sm sm:text-base font-bold text-foreground uppercase">Auction Stats</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Current Round</p>
              <p className="font-bold text-foreground text-lg">{state?.currentRound || 0}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Players Sold</p>
              <p className="font-bold text-foreground text-lg">{state?.history?.length || 0}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Total Spent</p>
              <p className="font-bold text-accent text-lg">
                {teams.reduce((sum, team) => sum + (team.spent || 0), 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Status</p>
              <p className="font-bold text-foreground text-lg">{isAuctionLive ? 'LIVE' : 'PAUSED'}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
