import mongoose, { Document, Schema } from "mongoose";

export interface ISupplier extends Document {
  name: string,
  email: string,
  phone: string,
  address: string,
}

const supplierSchema: Schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true,
  }
}, { timestamps: true });

const Supplier = mongoose.model<ISupplier>('Supplier', supplierSchema);
export default Supplier