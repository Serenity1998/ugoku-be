import mongoose from 'mongoose';

export const mediaSchema = new mongoose.Schema({
  mediaUrl: String,
  mediaThumb: String,
  fileName: String,
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  store: { type: String, ref: 'Store' },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Media = mongoose.model('Media', mediaSchema);
