import { Schema } from 'mongoose';

export const NoteSchema = new Schema(
  {
    title: String,
    content: String,
    author: String,
  },
  { versionKey: false }, // avoid __v:0
);
