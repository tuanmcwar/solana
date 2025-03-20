import mongoose from 'mongoose';

const newTokenSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    data: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now } 
}, { timestamps: true });

const NewToken = mongoose.model('NewToken', newTokenSchema);
export default NewToken;
