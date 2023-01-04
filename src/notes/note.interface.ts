import { Document } from 'mongoose';

export interface Note extends Document {
  readonly _id: string;
  readonly title: string;
  readonly content: string;
  readonly author: string;
}
