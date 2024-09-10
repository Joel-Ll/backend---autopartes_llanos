import mongoose, { Types, Schema } from "mongoose";

export interface IProductManagement {
  codeProduct: string,
  productId:  Types.ObjectId,
  productPrice: number,
  productQuantity: number,
  salesQuantity: number,
  income: number,
  expenses: number,
}

export const productManagementSchema: Schema = new Schema({
  codeProduct: {
    type: String,
    required: true,
    unique: true,
  },
  productId: {
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  productPrice: {
    type: Number,
    requered: true,
    default: 0
  },
  productQuantity: {
    type: Number,
    default: 0
  },
  salesQuantity: {
    type: Number,
    default: 0
  },
  income: {
    type: Number,
    default: 0
  },
  expenses: {
    type: Number,
    default: 0
  }
}, { timestamps: true});

const ProductManagement = mongoose.model<IProductManagement>('ProductManagement', productManagementSchema);
export default ProductManagement;