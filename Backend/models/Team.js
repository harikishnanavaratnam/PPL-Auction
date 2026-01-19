
import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logo: { type: String, required: true }, // Path or URL to logo
    budget: { type: Number, default: 5000 },
    initialBudget: { type: Number, default: 5000 },
    roster: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    spent: { type: Number, default: 0 },
    captain: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
    fixedPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // Captain + Fixed players (2 total)
    round1Budget: { type: Number, default: 5000 }, // Budget for round 1
    round2Budget: { type: Number, default: 0 } // Remaining budget for round 2
});

export default mongoose.model('Team', teamSchema);
