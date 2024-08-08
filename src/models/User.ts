import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string,
  password: string,
  role: string
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin'
  }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;