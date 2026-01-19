# Auction Logic Analysis

## Backend Auction Logic (`Backend/routes/auctionRoutes.js`)

### ✅ Core Auction Flow

1. **Initialize Auction** (`POST /initialize`)
   - Resets all teams (budget: 5000, roster: empty, spent: 0)
   - Resets all players (status: 'Unsold', soldPrice: 0, team: null)
   - Resets auction state (round: 1, currentPlayer: null, currentBid: 0)
   - Emits Socket.io update

2. **Draw Next Player** (`POST /next-player`)
   - Randomly selects an unsold player
   - Sets `currentPlayer` = player ID
   - Sets `currentBid` = player's `basePrice`
   - Resets `currentBidder` = null
   - Emits Socket.io update

3. **Place Bid** (`POST /bid`)
   - **Validations:**
     - ✅ Must have active player (`currentPlayer`)
     - ✅ Bid amount must be higher than `currentBid`
     - ✅ Team budget must be >= bid amount
   - Updates `currentBid` = new amount
   - Updates `currentBidder` = team ID
   - Emits Socket.io update

4. **Sell Player** (`POST /sell`)
   - **Validations:**
     - ✅ Must have `currentPlayer` and `currentBidder`
   - Updates player:
     - `status` = 'Sold'
     - `soldPrice` = currentBid
     - `team` = currentBidder ID
   - Updates team:
     - `budget` -= currentBid
     - `spent` += currentBid
     - `roster.push(player._id)`
   - Adds to history:
     - `history.push({ player, soldPrice, team })`
   - Resets state (currentPlayer: null, currentBid: 0, currentBidder: null)
   - Emits Socket.io update

5. **Mark Unsold** (`POST /unsold`)
   - Resets state (currentPlayer: null, currentBid: 0, currentBidder: null)
   - Player remains 'Unsold' in pool
   - Emits Socket.io update

6. **Manual Player Selection** (`POST /select-player`)
   - Selects specific player by ID
   - Sets `currentPlayer` = player ID
   - Sets `currentBid` = player's `basePrice`
   - Resets `currentBidder` = null
   - Emits Socket.io update

### ✅ Data Models

**Player Model:**
```javascript
{
  name: String (required),
  category: String (default: 'General'),
  basePrice: Number (default: 50),
  soldPrice: Number (default: 0),
  status: 'Unsold' | 'Sold' | 'Pending',
  team: ObjectId (ref: Team),
  imageDriveId: String, // Google Drive File ID
  imageUrl: String,     // Direct link if available
  order: Number
}
```

**AuctionState Model:**
```javascript
{
  isAuctionActive: Boolean,
  currentRound: Number,
  currentPlayer: ObjectId (ref: Player),
  currentBid: Number,
  currentBidder: ObjectId (ref: Team),
  history: [{
    player: ObjectId (ref: Player),
    soldPrice: Number,
    team: ObjectId (ref: Team),
    timestamp: Date
  }]
}
```

## Frontend Admin Panel Logic (`Frontend/app/admin/page.tsx`)

### ✅ Bid Increment Logic

**Bid Calculation** (`Frontend/lib/api.ts`):
```typescript
calculateNextBid(currentBid: number): number {
  if (currentBid < 200) return currentBid + 50;
  if (currentBid < 1000) return currentBid + 100;
  return currentBid + 500;
}
```

### ✅ Admin Panel Actions

1. **Initialize Auction**
   - Calls `auctionAPI.initialize()`
   - Socket.io automatically updates state

2. **Draw Next Player**
   - Calls `auctionAPI.nextPlayer()`
   - Socket.io updates current player

3. **Place Bid**
   - Per-team bid buttons (quick increment)
   - Manual bid input (custom amount)
   - Calls `auctionAPI.placeBid(teamId, amount)`
   - Validates team budget before enabling button

4. **Sell Player**
   - Only enabled if `currentBidder` exists
   - Calls `auctionAPI.sellPlayer()`
   - Socket.io updates state (player removed, team updated)

5. **Mark Unsold**
   - Calls `auctionAPI.markUnsold()`
   - Resets current player state

6. **Manual Player Selection**
   - Fetches unsold players list
   - Allows selecting specific player
   - Calls `auctionAPI.selectPlayer(playerId)`

### ✅ Real-time Updates

- Uses `useSocket()` hook to receive Socket.io updates
- State automatically syncs when backend emits `auction:state-update`
- No manual `fetchState()` calls needed after actions (Socket.io handles it)

## Player Images from Google Drive

### ✅ Image Storage & Retrieval

**Backend (`Backend/models/Player.js`):**
- Players store:
  - `imageDriveId`: Google Drive File ID
  - `imageUrl`: Direct link (optional, from Drive API)

**Backend Import (`Backend/routes/auctionRoutes.js` - `/import-players`):**
- Fetches files from Google Drive folder
- Creates player records with:
  - `name` = file name (without extension)
  - `imageDriveId` = file ID from Drive
  - `imageUrl` = `file.webContentLink` from Drive API
  - `status` = 'Unsold'

**Frontend Image URL Generation (`Frontend/lib/api.ts`):**
```typescript
getDriveImageUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}
```

**Frontend Image Display Logic:**
```typescript
getPlayerImageUrl(player: Player): string {
  if (!player) return '/placeholder.svg';
  if (player.imageUrl) return player.imageUrl;        // Prefer direct URL
  if (player.imageDriveId) return getDriveImageUrl(player.imageDriveId); // Fallback to Drive ID
  return '/placeholder.svg';                          // Default placeholder
}
```

### ✅ Where Player Images Are Used

1. **Admin Panel** (`Frontend/app/admin/page.tsx`)
   - Current player image display
   - Uses `getPlayerImageUrl()` with error fallback

2. **Live Page** (`Frontend/app/live/page.tsx`)
   - Current player image display
   - Uses `getPlayerImageUrl()` with error fallback

3. **Round Summary** (`Frontend/app/round-summary/page.tsx`)
   - Player images in sale history
   - Uses `getPlayerImageUrl()` with error fallback

### ⚠️ Potential Issues & Notes

1. **Google Drive Image Access:**
   - **Current Format:** `https://drive.google.com/uc?export=view&id=${fileId}`
   - **Requirement:** File must be publicly accessible or accessible by service account
   - **Recommendation:** Ensure Drive folder permissions allow "Anyone with the link can view" OR service account has access

2. **Image URL Priority:**
   - ✅ Correctly prioritizes `imageUrl` over `imageDriveId`
   - ✅ Falls back to placeholder if both missing

3. **Error Handling:**
   - ✅ All image displays have `onError` handlers to fallback to placeholder

4. **Backend State Population:**
   - ✅ `/state` endpoint populates `currentPlayer`, `currentBidder`, `history.player`, `history.team`
   - ✅ Socket.io emits include populated data

## Summary

### ✅ Working Correctly:
- ✅ Bid validation (amount > current, budget check)
- ✅ Sell player (updates player, team budget, roster)
- ✅ Socket.io real-time updates
- ✅ Drive image URL generation
- ✅ Image display with fallbacks
- ✅ Manual player selection
- ✅ Auction initialization

### 🔍 Recommendations:

1. **Drive Image Permissions:**
   - Verify Google Drive folder is accessible
   - Test image URLs load correctly in browser

2. **Image URL Format:**
   - Current: `https://drive.google.com/uc?export=view&id=${fileId}`
   - This is the standard format and should work if permissions are correct

3. **Error Logging:**
   - Consider adding console logs when images fail to load
   - Track which players have missing/invalid Drive IDs
