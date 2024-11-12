import { Schema } from 'mongoose';

export const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true },
);
