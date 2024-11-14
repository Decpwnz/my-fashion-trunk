import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [String] })
  keywords: string[];

  @Prop({ required: true, default: false })
  isProhibited: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
