import mongoose from 'mongoose';

import { ICalendar } from './@types';

const calendarSchema = new mongoose.Schema<ICalendar>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ICalendar>('Calendar', calendarSchema);
