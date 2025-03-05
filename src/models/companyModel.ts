import mongoose from 'mongoose';

export const companySchema = new mongoose.Schema({
  companyName: String,
  companyPostcode: String,
  companyPrefectures: String,
  companyCity: String,
  companyTown: String,
  companyBuilding: String,
  companyPosition: String,
  companyEstablished: String,
  companyOwnerName: String,
  companyOwnerFurigana: String,
  companySecondOwnerName: String,
  companySecondOwnerFurigana: String,
  companyPhone: String,
  companyAccountantPhone: String,
  companyTrialUsed: Boolean,
  companyDistributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Distributor',
  },
  companyPromoCode: {
    type: String,
    required: false,
  },
});

export const Company = mongoose.model('Company', companySchema);
