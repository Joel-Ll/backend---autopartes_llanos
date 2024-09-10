import mongoose, {Document, Schema, Types} from "mongoose";

const productStatus = {
  NOT_MANAGED: 'notManaged',
  AVAILABLE: 'available',
  NOT_AVAILABLE: 'notAvailable',
  LOW_STOCK: 'lowStock',
} as const

export type ProductStatus = typeof productStatus[keyof typeof productStatus];

export interface IProduct extends Document {
  productManagementId: Types.ObjectId,
  category: Types.ObjectId,
  name: string,
  code: string,
  description: string,
  salePrice: number,
  stock: number;
  state: ProductStatus,
}

const productSchema: Schema = new Schema({
  productManagementId: { 
    type: Types.ObjectId, 
    ref: 'ProductManagement',
    default: null,
  },
  category: {
    type: Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true 
  },
  salePrice: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0,
  },
  state: {
    type: String,
    enum: Object.values(productStatus),
    default: productStatus.NOT_MANAGED
  }
},{timestamps: true});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;