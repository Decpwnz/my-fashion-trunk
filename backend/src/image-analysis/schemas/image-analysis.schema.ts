import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MatchedCategorySchema } from './matched-category.schema';

export type ImageAnalysisDocument = ImageAnalysis & Document;

@Schema({ timestamps: true })
export class ImageAnalysis {
  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  isValid: boolean;

  @Prop({ type: [MatchedCategorySchema], required: true })
  matchedCategories: MatchedCategorySchema[];

  @Prop({ type: [String], required: true })
  detectedLabels: string[];

  @Prop()
  rejectionReason?: string;
}

export const ImageAnalysisSchema = SchemaFactory.createForClass(ImageAnalysis);
