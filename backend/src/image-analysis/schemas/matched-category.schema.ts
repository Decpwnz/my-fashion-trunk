import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class MatchedCategorySchema {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true, type: [String] })
  matches: string[];

  @Prop({ required: true })
  confidence: number;

  @Prop({ required: true })
  isProhibited: boolean;
}

export const MatchedCategorySchemaFactory = SchemaFactory.createForClass(
  MatchedCategorySchema,
);
