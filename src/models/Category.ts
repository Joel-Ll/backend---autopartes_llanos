import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose';
import { IProduct } from './Product';

export interface ICategory extends Document {
  name: string,
  products: PopulatedDoc<IProduct & Document>[]
}

const categorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  products: [
    {
      type: Types.ObjectId,
      ref: 'Product'
    }
  ]
}, {timestamps: true}) 

const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category


