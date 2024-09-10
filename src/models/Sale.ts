import mongoose, { Types, Document, Schema } from "mongoose";

export type TSale = {
  idProduct: Types.ObjectId;  
  nameProduct: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ISale extends Document {
  nameCustomer: string;
  products: TSale[];
  totalPrice: number;
  description: string;
}

const productSchema: Schema<TSale> = new Schema({
  idProduct: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Product'  
  },
  nameProduct: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
});

export const saleSchema: Schema = new Schema({
  nameCustomer: {
    type: String,
    default: 'Anónimo',
  },
  products: [productSchema], 
  totalPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: null
  }
}, { timestamps: true });

const Sale = mongoose.model<ISale>('Sale', saleSchema);
export default Sale;