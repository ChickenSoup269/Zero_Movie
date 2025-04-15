import { Schema, Document, model, Types } from 'mongoose';

export interface IComment extends Document {
  userId: Types.ObjectId; 
  movieId: number; 
  content: string; 
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    movieId: { type: Number, required: true }, 
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

commentSchema.index({ movieId: 1, createdAt: -1 });

export default model<IComment>('Comment', commentSchema);