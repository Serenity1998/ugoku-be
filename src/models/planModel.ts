import mongoose from 'mongoose';

export const planSchema = new mongoose.Schema({
  name: String,
  description: String,
  videoLimit: Number,
  price: Number,
  type: { type: String, enum: ['monthly', 'yearly', 'test_account'] },
  tags: [
    {
      type: String,
    },
  ],
  isTrial: Boolean,
});

export const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  videos: Number,
  price: Number,
  tags: [
    {
      type: String,
    },
  ],
});

export const Plan = mongoose.model('Plan', planSchema);
export const Product = mongoose.model('Products', productSchema);
