import mongoose from 'mongoose';

export const notificationSchema = new mongoose.Schema({
  title: String,
  body: String,
  topic: String,
  albumDivision: {
    type: Number,
    default: null,
  },
  albumSubDivision: {
    type: Number,
    default: null,
  },
  albumAge: {
    type: Number,
    default: null,
  },
  all: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = mongoose.model('Notification', notificationSchema);
