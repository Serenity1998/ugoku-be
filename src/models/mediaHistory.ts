import mongoose from 'mongoose';

export const mediaHistorySchema = new mongoose.Schema({
  mediaUrl: String,
  mediaId: String,
  store: { type: String, ref: 'Store' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const MediaHistory = mongoose.model('MediaHistory', mediaHistorySchema);
