// API Client for PPL Auction Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Team {
  _id: string;
  name: string;
  logo: string;
  budget: number;
  initialBudget: number;
  roster: string[] | Player[];
  spent: number;
  captain?: string | Player | null;
  fixedPlayers?: (string | Player)[];
  round1Budget?: number;
  round2Budget?: number;
}

export interface Player {
  _id: string;
  name: string;
  category?: string;
  basePrice: number;
  soldPrice?: number;
  status: 'Unsold' | 'Sold' | 'Pending';
  team?: string | Team;
  imageDriveId?: string;
  imageUrl?: string;
  order?: number;
}

export interface AuctionState {
  _id: string;
  isAuctionActive: boolean;
  currentRound: number;
  currentPlayer?: Player | null;
  currentBid: number;
  currentBidder?: Team | null;
  history: Array<{
    player: Player;
    soldPrice: number;
    team: Team;
    timestamp?: Date;
  }>;
}

export interface StateResponse {
  state: AuctionState;
  teams: Team[];
}

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// API request wrapper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auction API methods
export const auctionAPI = {
  // Get current state
  getState: (): Promise<StateResponse> => apiRequest<StateResponse>('/auction/state'),

  // Initialize auction
  initialize: (): Promise<{ message: string; setup?: any }> =>
    apiRequest<{ message: string; setup?: any }>('/auction/initialize', { method: 'POST' }),

  // Start auction (set LIVE without resetting)
  startAuction: (): Promise<{ message: string; state: AuctionState }> =>
    apiRequest<{ message: string; state: AuctionState }>('/auction/start-auction', { method: 'POST' }),

  // Get next random player
  nextPlayer: (): Promise<{ message: string; player: Player }> =>
    apiRequest<{ message: string; player: Player }>('/auction/next-player', { method: 'POST' }),

  // Select specific player manually
  selectPlayer: (playerId: string): Promise<{ message: string; player: Player }> =>
    apiRequest<{ message: string; player: Player }>('/auction/select-player', {
      method: 'POST',
      body: JSON.stringify({ playerId }),
    }),

  // Place a bid
  placeBid: (teamId: string, amount: number): Promise<{ message: string; currentBid: number; bidder: string }> =>
    apiRequest<{ message: string; currentBid: number; bidder: string }>('/auction/bid', {
      method: 'POST',
      body: JSON.stringify({ teamId, amount }),
    }),

  // Sell player to current bidder
  sellPlayer: (): Promise<{ message: string; player: string; team: string }> =>
    apiRequest<{ message: string; player: string; team: string }>('/auction/sell', { method: 'POST' }),

  // Mark player as unsold
  markUnsold: (): Promise<{ message: string }> =>
    apiRequest<{ message: string }>('/auction/unsold', { method: 'POST' }),

  // Get unsold players list
  getUnsoldPlayers: (): Promise<{ players: Player[] }> =>
    apiRequest<{ players: Player[] }>('/auction/unsold-players'),

  // Move to next round
  nextRound: (): Promise<{ message: string; round: number }> =>
    apiRequest<{ message: string; round: number }>('/auction/next-round', { method: 'POST' }),

  // Stop auction
  stopAuction: (): Promise<{
    message: string;
    state: AuctionState;
    teams: Team[];
  }> =>
    apiRequest<{
      message: string;
      state: AuctionState;
      teams: Team[];
    }>('/auction/stop-auction', { method: 'POST' }),

  // Get round summary (optionally filter by round number)
  getRoundSummary: (round?: number): Promise<{
    round: number;
    totalSold: number;
    totalValue: number;
    highestBid: number;
    history: Array<{
      player: Player;
      soldPrice: number;
      team: Team;
      round?: number;
      timestamp?: Date;
    }>;
    teams: Team[];
  }> => {
    const url = round ? `/auction/round-summary?round=${round}` : '/auction/round-summary';
    return apiRequest(url);
  },

  // Set team captain and fixed players
  setTeamFixed: (teamId: string, captainId: string | null, fixedPlayerIds: string[]): Promise<{ message: string; team: string }> =>
    apiRequest<{ message: string; team: string }>('/auction/set-team-fixed', {
      method: 'POST',
      body: JSON.stringify({ teamId, captainId, fixedPlayerIds }),
    }),

  // Seed teams (admin setup)
  seedTeams: (): Promise<{ message: string }> =>
    apiRequest<{ message: string }>('/auction/seed-teams', { method: 'POST' }),

  // Import players from Google Drive (admin setup)
  importPlayers: (): Promise<{ message: string }> =>
    apiRequest<{ message: string }>('/auction/import-players', { method: 'POST' }),
};

// Auth API methods
export const authAPI = {
  login: (password: string): Promise<{ token: string; success: boolean }> =>
    apiRequest<{ token: string; success: boolean }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
};

// Bid increment calculator according to SRS
// Bid increment logic per auction rules:
// - bidding points < 500: 50 points per bid
// - 500 <= bidding points < 1500: 100 points per bid
// - bidding points >= 1500: 200 points per bid
export const calculateNextBid = (currentBid: number): number => {
  if (currentBid < 500) {
    return currentBid + 50;
  } else if (currentBid < 1500) {
    return currentBid + 100;
  } else {
    return currentBid + 200;
  }
};

// Get Google Drive image URL from file ID (deprecated - using local images now)
export const getDriveImageUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

// Get player image URL - prioritizes local paths
export const getPlayerImageUrl = (player: Player | null | undefined): string => {
  if (!player) return '/placeholder.svg';
  
  // If imageUrl is a local path (starts with /), use it directly
  if (player.imageUrl && player.imageUrl.startsWith('/')) {
    return player.imageUrl;
  }
  
  // Fallback to Drive URL if available (for backward compatibility)
  if (player.imageUrl) return player.imageUrl;
  if (player.imageDriveId) return getDriveImageUrl(player.imageDriveId);
  
  return '/placeholder.svg';
};
