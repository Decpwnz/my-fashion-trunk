import { Schema } from 'mongoose';

export const ItemSchema = new Schema({
  name: String,
  category: String,
  imageUrl: String,
});
