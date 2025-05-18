import { Schema, model, Document } from 'mongoose';

interface IImage extends Document {
  url: string;
  public_id: string;
  createdAt: Date;
}

const imageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IImage>('Image', imageSchema);
