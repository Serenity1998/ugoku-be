import mongoose from 'mongoose';
import { AlbumId } from './albumIDGenerator';

export const albumSchema = new mongoose.Schema({
  name: String,
  albumId: {
    type: String,
    unique: true,
  },
  albumDivision: Number,
  albumSubDivision: Number,
  albumAge: Number,
  albumVersion: {
    type: Number,
    default: 1,
  },
  totalViews: {
    type: Number,
    default: 0,
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  store: { type: String, ref: 'Store' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

albumSchema.pre('save', async function (next) {
  const doc = await AlbumId.findOneAndUpdate({}, { $inc: { value: 1 } }, { new: true, upsert: true });
  const id = doc.value.toString().padStart(7, '0');
  if (this.isNew) {
    this.albumId = `5${id}`;
    this.albumVersion = 1;
  } else this.albumVersion += 1;
  next();
});

export const Album = mongoose.model('Album', albumSchema);
