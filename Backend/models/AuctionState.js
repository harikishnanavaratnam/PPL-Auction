
import mongoose from 'mongoose';

const auctionStateSchema = new mongoose.Schema({
    isAuctionActive: { type: Boolean, default: false },
    constantId: { type: String, default: 'GLOBAL_STATE', unique: true }, // Singleton
    currentRound: { type: Number, default: 1 },
    currentPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
    currentBid: { type: Number, default: 50 },
    currentBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    history: [{
        player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        soldPrice: Number,
        team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
        round: { type: Number },
        timestamp: { type: Date, default: Date.now }
    }]
});

export default mongoose.model('AuctionState', auctionStateSchema);
