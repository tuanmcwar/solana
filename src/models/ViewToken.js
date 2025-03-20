import mongoose from 'mongoose';

const ViewTokenSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    data: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ViewToken = mongoose.model('ViewToken', ViewTokenSchema);
export default ViewToken;
