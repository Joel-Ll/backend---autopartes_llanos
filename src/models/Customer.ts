import mongoose, {Schema, Document} from 'mongoose';

export interface ICustomer extends Document {
  name: string,
  nit_ci: string,
  phone: string,
  address: string,
  createdAt?: Date,
  updatedAt?: Date
}

const customerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nit_ci: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  }
},{timestamps: true});

const Customer = mongoose.model<ICustomer>('Customer', customerSchema);
export default Customer;