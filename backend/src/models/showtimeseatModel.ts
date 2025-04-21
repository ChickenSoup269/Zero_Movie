  import { Schema, Document, model } from 'mongoose';
  import { Types } from 'mongoose';

  export interface IShowtimeSeat extends Document {
    _id: Types.ObjectId;
    showtimeId: Types.ObjectId;
    seatId: Types.ObjectId;
    status: 'available' | 'booked' | 'reserved';
    createdAt?: Date;
    updatedAt?: Date;
  }

  const showtimeSeatSchema = new Schema<IShowtimeSeat>({
    showtimeId: { type: Schema.Types.ObjectId, ref: 'Showtime', required: true },
    seatId: { type: Schema.Types.ObjectId, ref: 'Seat', required: true },
    status: {
      type: String,
      enum: ['available', 'booked', 'reserved'],
      default: 'available',
    },
  }, {
    timestamps: true,
  });

  showtimeSeatSchema.index({ showtimeId: 1, seatId: 1 }, { unique: true });
  export default model<IShowtimeSeat>('ShowtimeSeat', showtimeSeatSchema);