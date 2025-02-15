import { HydratedDocument, Types } from 'mongoose';

/**
 * All internal fields stored about a user
 */
export interface IEvent {
  /** SYSTEM DATA */
  /** The id of the user */
  _id: string;
  /** The linked calendar for the event */
  calendar: Types.ObjectId;
  /** The date of the event */
  date: Date;
  /** The name of the event */
  name: string;
  /** The description of the event */
  description: string;
  /** The color of the event */
  color: string;

  /** METADATA */
  /** The date the event was created */
  createdAt: Date;
  /** The date the event was last updated */
  updatedAt: Date;
}

// The methods and properties for a fetched document. This will be the most commonly used type
export type IEventSchema = HydratedDocument<IEvent>;
