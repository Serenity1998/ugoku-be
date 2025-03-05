import mongoose from 'mongoose';

export const paymentSchema = new mongoose.Schema({
  amount: Number,
  distributor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  store: { type: String, ref: 'Store' },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Payment = mongoose.model('Payment', paymentSchema);
