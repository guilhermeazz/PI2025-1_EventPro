import mongoose, { Schema, Document, model } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  rating: number;       // Por exemplo, de 0 a 5
  comment?: string;     // Comentário opcional
  reviewableId: mongoose.Types.ObjectId; // ID da entidade avaliada
  reviewableType: 'Event' | 'Inscription'; // Define o tipo da entidade
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    reviewableId: { type: Schema.Types.ObjectId, required: true },
    reviewableType: { type: String, enum: ['Event', 'Inscription'], required: true },
  },
  { timestamps: true }
);

export default model<IReview>('Review', reviewSchema);