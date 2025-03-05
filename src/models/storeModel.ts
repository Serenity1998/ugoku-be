import mongoose from 'mongoose';

export const storeSchema = new mongoose.Schema({
  _id: String,
  loginEmail: String,
  storeName: String,
  storePostcode: String,
  storePrefectures: String,
  storeCity: String,
  storeTown: String,
  storeBuilding: String,
  storeOwnerName: String,
  storeOwnerFurigana: String,
  storePhone: String,
  storePrimary: Boolean,
  cardString: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  status: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreStatus' },
  statusText: { type: String, enum: ['Active', 'Inactive', 'Suspended', 'Canceled', 'Changed'] },
  cancelReason: {
    type: String,
    default: null,
  },
});

export const storeStatusSchema = new mongoose.Schema({
  planStart: Date,
  planEnd: Date,
  //counter - will be refreshed every month
  videosCreated: Number,
  //allowed videos per month - will be changed during monthly trigger if plan changed
  planVideos: Number,
  //purchased video quantity - refresh every month
  //purchasedVideo - max(videosCreated - planVideos, 0)
  purchasedVideos: Number,
  activePlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    default: null,
  },
  //update only this field if user change plan
  nextPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    default: null,
  },
  store: { type: String, ref: 'Store' },
});

export const Store = mongoose.model('Store', storeSchema);
export const StoreStatus = mongoose.model('StoreStatus', storeStatusSchema);
