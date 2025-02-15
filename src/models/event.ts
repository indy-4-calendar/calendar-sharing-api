import mongoose from 'mongoose';

import { IEvent } from './@types';

const eventSchema = new mongoose.Schema<IEvent>(
  {
    calendar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Calendar',
      required: true,
    },
    date: { type: Date, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IEvent>('Event', eventSchema);
