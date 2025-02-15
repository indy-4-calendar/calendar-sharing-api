import { HydratedDocument } from 'mongoose';

/**
 * All internal fields stored about a user
 */
export interface ICalendar {
  /** SYSTEM DATA */
  /** The id of the user */
  _id: string;
  /** The name of the calendar */
  name: string;
  /** The description of the calendar */
  description: string;
  /** The color of the calendar */
  color: string;

  /** METADATA */
  /** The date the calendar was created */
  createdAt: Date;
  /** The date the calendar was last updated */
  updatedAt: Date;
}

// The methods and properties for a fetched document. This will be the most commonly used type
export type ICalendarSchema = HydratedDocument<ICalendar>;
