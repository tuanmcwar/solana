import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    data: { type: Object, required: true },
});

const TokenModel = mongoose.model('Token', tokenSchema);

export default TokenModel;
