
import express from 'express';
import AuctionState from '../models/AuctionState.js';
import Player from '../models/Player.js';
import Team from '../models/Team.js';
import { listFiles } from '../services/driveService.js';

const router = express.Router();

// Initialize Auction (Reset/Seed)
router.post('/initialize', async (req, res) => {
    try {
        // 1. Reset Teams (Budget, Roster)
        await Team.updateMany({}, {
            $set: { budget: 5000, roster: [], spent: 0 }
        });

        // 2. Reset Players
        await Player.updateMany({}, {
            $set: { status: 'Unsold', soldPrice: 0, team: null }
        });

        // 3. Reset State
        let state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' });
        if (!state) {
            state = new AuctionState();
        }
        state.isAuctionActive = true;
        state.currentRound = 1;
        state.currentPlayer = null;
        state.currentBid = 0;
        state.currentBidder = null;
        state.history = [];
        await state.save();

        res.json({ message: 'Auction Initialized successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Import Players from Drive (One-time setup)
router.post('/import-players', async (req, res) => {
    try {
        const folderId = process.env.DRIVE_FOLDER_ID;
        const files = await listFiles(folderId);

        // This logic assumes file name is player name. Adjust as needed.
        let addedCount = 0;
        for (const file of files) {
            if (file.mimeType.startsWith('image/')) {
                const name = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                const exists = await Player.findOne({ name: name });
                if (!exists) {
                    await Player.create({
                        name: name,
                        imageDriveId: file.id,
                        imageUrl: file.webContentLink,
                        status: 'Unsold'
                    });
                    addedCount++;
                }
            }
        }
        res.json({ message: `Imported ${addedCount} players from Drive` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Seed Teams (Run once)
router.post('/seed-teams', async (req, res) => {
    const teams = [
        { name: 'ASSAULT ARUMUGAM AVENGERS', logo: '/Teams/ASSAULT ARUMUGAM AVENGERS.png' },
        { name: 'CHILD CHINNA CHAMPIONS', logo: '/Teams/CHILD CHINNA CHAMPIONS.png' },
        { name: 'ERIMALAI WARRIORS', logo: '/Teams/ERIMALAI WARRIORS.png' },
        { name: 'KAIPULLA KINGS', logo: '/Teams/KAIPULLA KINGS.png' },
        { name: 'NESAMANI XI', logo: '/Teams/NESAMANI XI.png' },
        { name: 'SNAKE BABU SUPER STRIKERS', logo: '/Teams/SNAKE BABU SUPER STRIKERS.png' }
    ];

    try {
        for (const t of teams) {
            await Team.updateOne({ name: t.name }, t, { upsert: true });
        }
        res.json({ message: 'Teams seeded' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Current State
router.get('/state', async (req, res) => {
    const state = await AuctionState.findOne({ constantId: 'GLOBAL_STATE' })
        .populate('currentPlayer')
        .populate('currentBidder');

    // Also fetch teams for dashboard
    const teams = await Team.find({});

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
        const team = await Team.findById(teamId);

        if (!state.currentPlayer) return res.status(400).json({ message: 'No active player' });
        if (amount <= state.currentBid) return res.status(400).json({ message: 'Bid must be higher than current' });
        if (team.budget < amount) return res.status(400).json({ message: 'Insufficient budget' });

        state.currentBid = amount;
        state.currentBidder = teamId;
        await state.save();

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
        const team = await Team.findById(state.currentBidder);

        // Update Player
        player.status = 'Sold';
        player.soldPrice = state.currentBid;
        player.team = team._id;
        await player.save();

        // Update Team
        team.budget -= state.currentBid;
        team.spent += state.currentBid;
        team.roster.push(player._id);
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
        
        state.currentRound += 1;
        await state.save();

        res.json({ message: 'Round incremented', round: state.currentRound });
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
