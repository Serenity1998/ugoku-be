import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  deviceId: { type: String, unique: true, required: true },
  pushToken: String,
  updatedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model('User', userSchema);
