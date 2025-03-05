import mongoose from 'mongoose';

const uniqueIdSchema = new mongoose.Schema({
  value: {
    type: Number,
    default: 0,
  },
});

export const AlbumId = mongoose.model('AlbumId', uniqueIdSchema);
