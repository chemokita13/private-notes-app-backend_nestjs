import { Schema } from 'mongoose';

export const NoteSchema = new Schema({
  title: String,
  content: String,
  author: String,
});
