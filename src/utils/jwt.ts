import jwt from 'jsonwebtoken';
import Types from 'mongoose';

type UserPayload = {
  id: Types.ObjectId
}

export const generateJWT = (payload: UserPayload) => {
  const wordSecret = process.env.JWT_SECRET

  const token = jwt.sign(payload, wordSecret, {
    expiresIn: '100d',
  });

  return token;
}