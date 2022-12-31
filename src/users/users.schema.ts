import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    username: String,
    password: String,
  },
  { versionKey: false }, // avoid __v:0
);
