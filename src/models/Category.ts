import mongoose, {Schema, Document} from 'mongoose';

export interface ICategory extends Document {
  name: string,
}

const categorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, {timestamps: true}) 

const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category


