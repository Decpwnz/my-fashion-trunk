import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  imageUrl: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
