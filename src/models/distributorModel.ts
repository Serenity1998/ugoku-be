import mongoose from 'mongoose';

export const distributorSchema = new mongoose.Schema({
  name: String,
  displayName: {
    type: String,
    unique: true,
  },
  contactName: String,
  email: String,
  contactAddress: String,
});

export const Distributor = mongoose.model('Distributor', distributorSchema);
