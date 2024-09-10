import mongoose, {Schema, Document } from "mongoose";

export interface IPurchaseHistory extends Document{
  nameSupplier: string;
  codeProduct: string;
  unitQuantity: number;
  purchasePrice: number;
  purchaseDesc: string;
}

const purchaseHistorySchema: Schema = new Schema({
  
  nameSupplier: {
    type: String,
    required: true
  },
  codeProduct: {
    type: String,
    required: true
  },
  unitQuantity: {
    type: Number,
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  purchaseDesc: {
    type: String,
    required: true
  }
}, {timestamps: true});

const PurchaseHistory = mongoose.model<IPurchaseHistory>('PurcheProduct', purchaseHistorySchema);
export default PurchaseHistory 