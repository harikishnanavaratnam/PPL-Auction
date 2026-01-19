
import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, default: 'General' }, // e.g., Batsman, Bowler, All-Rounder
    basePrice: { type: Number, default: 100 },
    soldPrice: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Unsold', 'Sold', 'Pending'],
        default: 'Unsold'
    },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    imageDriveId: { type: String }, // Google Drive File ID
    imageUrl: { type: String }, // Direct link if available
    order: { type: Number } // Random order assigned at start
});

export default mongoose.model('Player', playerSchema);
