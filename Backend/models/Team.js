
import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logo: { type: String, required: true }, // Path or URL to logo
    budget: { type: Number, default: 5000 },
    initialBudget: { type: Number, default: 5000 },
    roster: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    spent: { type: Number, default: 0 }
});

export default mongoose.model('Team', teamSchema);
