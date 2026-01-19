
import express from 'express';
import AuctionState from '../models/AuctionState.js';
import Player from '../models/Player.js';
import Team from '../models/Team.js';
import { listFiles } from '../services/driveService.js';
import { getIO } from '../lib/socket.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const DEFAULT_TEAMS = [
    { name: 'ASSAULT ARUMUGAM AVENGERS', logo: '/Teams/ASSAULT ARUMUGAM AVENGERS.png' },
    { name: 'CHILD CHINNA CHAMPIONS', logo: '/Teams/CHILD CHINNA CHAMPIONS.png' },
    { name: 'ERIMALAI WARRIORS', logo: '/Teams/ERIMALAI WARRIORS.png' },
    { name: 'KAIPULLA KINGS', logo: '/Teams/KAIPULLA KINGS.png' },
    { name: 'NESAMANI XI', logo: '/Teams/NESAMANI XI.png' },
    { name: 'SNAKE BABU SUPER STRIKERS', logo: '/Teams/SNAKE BABU SUPER STRIKERS.png' }
];

const seedTeamsIfNeeded = async () => {
    const teamCount = await Team.countDocuments({});
    if (teamCount > 0) return { didSeed: false, count: teamCount };

    for (const t of DEFAULT_TEAMS) {
        await Team.updateOne({ name: t.name }, t, { upsert: true });
    }
    const newCount = await Team.countDocuments({});
    return { didSeed: true, count: newCount };
};

// Scan local PLAYERS folder
const scanLocalPlayersFolder = () => {
    try {
        // Path to Frontend/public/PLAYERS folder (relative to Backend folder)
        const playersFolderPath = path.join(__dirname, '../../Frontend/public/PLAYERS');
        
        if (!fs.existsSync(playersFolderPath)) {
            console.warn(`Local PLAYERS folder not found at: ${playersFolderPath}`);
            return [];
        }

        const files = fs.readdirSync(playersFolderPath);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
        }).sort(); // Sort to maintain order

        console.log(`Found ${imageFiles.length} image files in local PLAYERS folder`);
        return imageFiles;
    } catch (error) {
        console.error('Error scanning local PLAYERS folder:', error);
        return [];
    }
};

const importPlayersIfNeeded = async () => {
    const playerCount = await Player.countDocuments({});
    if (playerCount > 0) return { didImport: false, added: 0, skipped: playerCount, errors: 0, total: playerCount };

    console.log('Auto-import: Scanning local PLAYERS folder...');
    const imageFiles = scanLocalPlayersFolder();

    if (imageFiles.length === 0) {
        return { didImport: false, added: 0, skipped: 0, errors: 0, total: 0, warning: 'No image files found in Frontend/public/PLAYERS folder' };
    }

    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const filename of imageFiles) {
        try {
            // Extract player name from filename (remove extension)
            const nameWithoutExt = path.parse(filename).name;
            // Use filename as player name, or you can customize this logic
            const playerName = nameWithoutExt; // e.g., "001" or you can map to actual names
            
            const exists = await Player.findOne({ name: playerName });
            if (!exists) {
                // Store local path: /PLAYERS/filename.png
                const imagePath = `/PLAYERS/${filename}`;
                await Player.create({
                    name: playerName,
                    imageUrl: imagePath, // Local path instead of Drive URL
                    status: 'Unsold',
                    basePrice: 100
                });
                addedCount++;
                console.log(`Auto-import: Added player: ${playerName} (${imagePath})`);
            } else {
                skippedCount++;
            }
        } catch (fileError) {
            errorCount++;
            console.error(`Auto-import: Error processing file ${filename}:`, fileError);
        }
    }

    const total = await Player.countDocuments({});
    return { didImport: true, added: addedCount, skipped: skippedCount, errors: errorCount, total };
};

// Helper function to emit state update
const emitStateUpdate = async () => {
    const io = getIO();
    if (!io) return;

    const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' })
        .populate('currentPlayer')
        .populate('currentBidder')
        .populate('history.player')
        .populate('history.team');

    const teams = await Team.find({}).populate('roster');

    io.emit('auction:state-update', { state, teams });
};

// Initialize Auction (Reset/Seed)
router.post('/initialize', async (req, res) => {
    try {
        // 0. Auto seed teams / import players (only if DB is empty)
        const seeded = await seedTeamsIfNeeded();
        const imported = await importPlayersIfNeeded();

        // 1. Reset Teams (Budget, Roster, Captain, Fixed Players)
        await Team.updateMany({}, {
            $set: { 
                budget: 5000, 
                round1Budget: 5000,
                round2Budget: 0,
                roster: [], 
                spent: 0,
                captain: null,
                fixedPlayers: []
            }
        });

        // 2. Reset Players (set basePrice to 100)
        await Player.updateMany({}, {
            $set: { status: 'Unsold', soldPrice: 0, team: null, basePrice: 100 }
        });

        // 3. Reset State
        let state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' });
        if (!state) {
            state = new AuctionState();
        }
        // Reset should NOT auto-start. Admin will press "Start Auction".
        state.isAuctionActive = false;
        state.currentRound = 1;
        state.currentPlayer = null;
        state.currentBid = 0;
        state.currentBidder = null;
        state.history = [];
        await state.save();

        emitStateUpdate();

        res.json({ 
            message: 'Auction initialized successfully',
            setup: {
                teams: seeded,
                players: imported
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Auction (set LIVE without resetting)
router.post('/start-auction', async (req, res) => {
    try {
        const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' });
        if (!state) {
            return res.status(400).json({ message: 'Auction not initialized yet. Please Reset Auction first.' });
        }

        state.isAuctionActive = true;
        await state.save();

        emitStateUpdate();

        res.json({ message: 'Auction started', state });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Import Players from Local PLAYERS folder (One-time setup)
router.post('/import-players', async (req, res) => {
    try {
        console.log('Import: Scanning local PLAYERS folder...');
        const imageFiles = scanLocalPlayersFolder();

        if (imageFiles.length === 0) {
            return res.status(400).json({ 
                message: 'No image files found in Frontend/public/PLAYERS folder',
                hint: 'Make sure image files (PNG, JPG, etc.) are in the Frontend/public/PLAYERS folder'
            });
        }

        // This logic assumes file name (without extension) is player name. Adjust as needed.
        let addedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        const processedNames = [];

        for (const filename of imageFiles) {
            try {
                // Extract player name from filename (remove extension)
                const nameWithoutExt = path.parse(filename).name;
                const playerName = nameWithoutExt; // e.g., "001" or you can map to actual names
                
                // Skip if name is empty
                if (!playerName || playerName.trim() === '') {
                    errorCount++;
                    console.warn(`Skipping file with empty name: ${filename}`);
                    continue;
                }

                // Check if we already processed this name in this batch (duplicate files)
                if (processedNames.includes(playerName)) {
                    skippedCount++;
                    console.log(`Skipped duplicate name in batch: ${playerName}`);
                    continue;
                }

                const exists = await Player.findOne({ name: playerName });
                if (!exists) {
                    // Store local path: /PLAYERS/filename.png
                    const imagePath = `/PLAYERS/${filename}`;
                    await Player.create({
                        name: playerName,
                        imageUrl: imagePath, // Local path instead of Drive URL
                        status: 'Unsold',
                        basePrice: 100 // Rule 13: Base price is 100
                    });
                    addedCount++;
                    processedNames.push(playerName);
                    console.log(`Imported player: ${playerName} (${imagePath})`);
                } else {
                    skippedCount++;
                    console.log(`Skipped existing player: ${playerName}`);
                }
            } catch (fileError) {
                errorCount++;
                console.error(`Error processing file ${filename || 'unknown'}:`, fileError);
            }
        }

        const total = await Player.countDocuments({});
        res.json({ 
            message: `Import complete: ${addedCount} added, ${skippedCount} skipped, ${errorCount} errors. Total players: ${total}`,
            added: addedCount,
            skipped: skippedCount,
            errors: errorCount,
            total: total,
            filesFound: imageFiles.length
        });
    } catch (error) {
        console.error('Import players error:', error);
        res.status(500).json({ error: error.message || 'Failed to import players from local folder' });
    }
});

// Seed Teams (Run once)
router.post('/seed-teams', async (req, res) => {
    try {
        for (const t of DEFAULT_TEAMS) {
            await Team.updateOne({ name: t.name }, t, { upsert: true });
        }
        res.json({ message: 'Teams seeded', count: DEFAULT_TEAMS.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Current State
router.get('/state', async (req, res) => {
    const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' })
        .populate('currentPlayer')
        .populate('currentBidder')
        .populate('history.player')
        .populate('history.team');

    // Also fetch teams for dashboard with populated rosters
    const teams = await Team.find({}).populate('roster');

    res.json({ state, teams });
});

// Draw Next Player
router.post('/next-player', async (req, res) => {
    try {
        const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' });

        // Find random unsold player
        const count = await Player.countDocuments({ status: 'Unsold' });
        if (count === 0) return res.status(400).json({ message: 'No unsold players left' });

        const random = Math.floor(Math.random() * count);
        const player = await Player.findOne({ status: 'Unsold' }).skip(random);

        state.currentPlayer = player._id;
        state.currentBid = player.basePrice;
        state.currentBidder = null;
        await state.save();

        emitStateUpdate();

        res.json({ message: 'Next player drawn', player });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Place Bid
router.post('/bid', async (req, res) => {
    const { teamId, amount } = req.body;
    try {
        const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' });
        const team = await Team.findById(teamId).populate('roster');

        if (!state.currentPlayer) return res.status(400).json({ message: 'No active player' });
        if (amount <= state.currentBid) return res.status(400).json({ message: 'Bid must be higher than current' });
        if (team.budget < amount) return res.status(400).json({ message: 'Insufficient budget' });

        // Auction Rules Validation:
        const rosterSize = Array.isArray(team.roster) ? team.roster.length : 0;
        const fixedPlayersCount = Array.isArray(team.fixedPlayers) ? team.fixedPlayers.length : 0;
        const totalSquadSize = rosterSize + fixedPlayersCount + (team.captain ? 1 : 0);

        // Rule 9: If team finishes the given 5000 points, they cannot bid
        if (state.currentRound === 1 && team.spent >= 5000) {
            return res.status(400).json({ message: 'Round 1 budget exhausted. Cannot bid in round 1.' });
        }

        // Rule 3: Maximum squad size is 15
        if (totalSquadSize >= 15) {
            return res.status(400).json({ message: 'Maximum squad size (15) reached' });
        }

        // Rule 8: If team needs to complete 13 players, ensure minimum 100 per remaining player
        const playersNeeded = 13 - totalSquadSize;
        if (playersNeeded > 0) {
            const remainingBudget = team.budget - amount;
            const minRequired = playersNeeded * 100;
            if (remainingBudget < minRequired) {
                return res.status(400).json({ 
                    message: `Need ${playersNeeded} more players. Minimum ${minRequired} points required (100 per player).` 
                });
            }
        }

        // Rule 6 & 7: If team finishes 5000 points, they must have 13 players
        if (state.currentRound === 1 && (team.spent + amount) >= 5000) {
            if (totalSquadSize + 1 < 13) {
                return res.status(400).json({ 
                    message: `Cannot exhaust 5000 points. Need at least 13 players in squad (currently ${totalSquadSize + 1}).` 
                });
            }
        }

        state.currentBid = amount;
        state.currentBidder = teamId;
        await state.save();

        emitStateUpdate();

        res.json({ message: 'Bid placed', currentBid: amount, bidder: team.name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sell Player
router.post('/sell', async (req, res) => {
    try {
        const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' });
        if (!state.currentPlayer || !state.currentBidder) return res.status(400).json({ message: 'Cannot sell' });

        const player = await Player.findById(state.currentPlayer);
        const team = await Team.findById(state.currentBidder).populate('roster');

        // Validate squad size before selling
        const rosterSize = Array.isArray(team.roster) ? team.roster.length : 0;
        const fixedPlayersCount = Array.isArray(team.fixedPlayers) ? team.fixedPlayers.length : 0;
        const totalSquadSize = rosterSize + fixedPlayersCount + (team.captain ? 1 : 0);

        // Rule 3: Maximum squad size is 15
        if (totalSquadSize >= 15) {
            return res.status(400).json({ message: 'Maximum squad size (15) reached' });
        }

        // Update Player
        player.status = 'Sold';
        player.soldPrice = state.currentBid;
        player.team = team._id;
        await player.save();

        // Update Team
        team.budget -= state.currentBid;
        team.spent += state.currentBid;
        team.roster.push(player._id);
        
        // Update round budgets
        if (state.currentRound === 1) {
            team.round1Budget -= state.currentBid;
        } else {
            team.round2Budget -= state.currentBid;
        }
        
        await team.save();

        // Update History
        state.history.push({
            player: player._id,
            soldPrice: state.currentBid,
            team: team._id
        });

        // Reset State for next
        state.currentPlayer = null;
        state.currentBid = 0;
        state.currentBidder = null;
        await state.save();

        emitStateUpdate();

        res.json({ message: 'Player Sold', player: player.name, team: team.name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark Unsold
router.post('/unsold', async (req, res) => {
    try {
        const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' });
        if (!state.currentPlayer) return res.status(400).json({ message: 'No active player' });

        const player = await Player.findById(state.currentPlayer);
        // Player remains 'Unsold', but we might want to flag them as 'Passed' for this round if needed.
        // For now, just reset state so they go back to pool.

        state.currentPlayer = null;
        state.currentBid = 0;
        state.currentBidder = null;
        await state.save();

        emitStateUpdate();

        res.json({ message: 'Player marked Unsold' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Unsold Players (for manual selection)
router.get('/unsold-players', async (req, res) => {
    try {
        const unsoldPlayers = await Player.find({ status: 'Unsold' }).select('name imageUrl basePrice category').sort({ name: 1 });
        res.json({ players: unsoldPlayers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Players (for fixed players management)
router.get('/all-players', async (req, res) => {
    try {
        const allPlayers = await Player.find({}).select('name imageUrl basePrice category status team').sort({ name: 1 });
        res.json({ players: allPlayers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manual Player Selection (select specific player)
router.post('/select-player', async (req, res) => {
    try {
        const { playerId } = req.body;
        const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' });
        
        const player = await Player.findById(playerId);
        if (!player) return res.status(404).json({ message: 'Player not found' });
        if (player.status !== 'Unsold') return res.status(400).json({ message: 'Player already sold' });

        state.currentPlayer = player._id;
        state.currentBid = player.basePrice;
        state.currentBidder = null;
        await state.save();

        emitStateUpdate();

        res.json({ message: 'Player selected', player });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Increment Round
router.post('/next-round', async (req, res) => {
    try {
        const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' });
        if (state.currentPlayer) {
            return res.status(400).json({ message: 'Cannot start new round while player is active' });
        }
        
        // Rule 2: Each team gets remaining points for 2nd round
        if (state.currentRound === 1) {
            const teams = await Team.find({});
            for (const team of teams) {
                // Remaining budget from round 1 becomes round 2 budget
                team.round2Budget = team.budget;
                team.budget = team.budget; // Keep current budget for round 2
                await team.save();
            }
        }
        
        state.currentRound += 1;
        await state.save();

        emitStateUpdate();

        res.json({ message: 'Round incremented', round: state.currentRound });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Set Captain and Fixed Players
router.post('/set-team-fixed', async (req, res) => {
    try {
        const { teamId, captainId, fixedPlayerIds } = req.body;
        const team = await Team.findById(teamId);

        if (!team) return res.status(404).json({ message: 'Team not found' });

        // Validate: Captain + Fixed players = 2 total (Rule 4)
        const fixedCount = Array.isArray(fixedPlayerIds) ? fixedPlayerIds.length : 0;
        const totalFixed = (captainId ? 1 : 0) + fixedCount;
        
        if (totalFixed > 2) {
            return res.status(400).json({ message: 'Can only have 2 total (Captain + Fixed players). Currently: ' + totalFixed });
        }
        
        if (captainId && fixedCount > 1) {
            return res.status(400).json({ message: 'Can only have 1 captain and 1 fixed player (2 total)' });
        }
        
        if (!captainId && fixedCount > 2) {
            return res.status(400).json({ message: 'Can only have 2 fixed players if no captain' });
        }

        // Validate players exist
        if (captainId) {
            const captain = await Player.findById(captainId);
            if (!captain) return res.status(404).json({ message: 'Captain player not found' });
        }
        
        if (fixedCount > 0) {
            for (const playerId of fixedPlayerIds) {
                const player = await Player.findById(playerId);
                if (!player) return res.status(404).json({ message: `Fixed player ${playerId} not found` });
            }
        }

        team.captain = captainId || null;
        team.fixedPlayers = fixedPlayerIds || [];
        await team.save();

        emitStateUpdate();

        res.json({ message: 'Team fixed players updated', team: team.name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Stop Auction
router.post('/stop-auction', async (req, res) => {
    try {
        const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' });
        state.isAuctionActive = false;
        await state.save();

        emitStateUpdate();

        // Get all teams with populated rosters
        const teams = await Team.find({}).populate('roster');

        res.json({ 
            message: 'Auction stopped', 
            state,
            teams: teams.map(t => ({
                _id: t._id,
                name: t.name,
                budget: t.budget,
                spent: t.spent,
                rosterSize: t.roster.length
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Round Summary
router.get('/round-summary', async (req, res) => {
    try {
        const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' }).populate('history.player');
        const teams = await Team.find({}).populate('roster');
        
        // Calculate round statistics
        const roundHistory = state.history.filter(h => {
            // For now, all history is shown. In future, filter by round if needed
            return true;
        });

        res.json({
            round: state.currentRound,
            totalSold: state.history.length,
            totalValue: state.history.reduce((sum, h) => sum + (h.soldPrice || 0), 0),
            highestBid: Math.max(...state.history.map(h => h.soldPrice || 0), 0),
            history: roundHistory,
            teams
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
