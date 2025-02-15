import { Model, HydratedDocument, Types } from 'mongoose';

/**
 * All internal fields stored about a user
 */
export interface IUser {
  /** SYSTEM DATA */
  /** The id of the user */
  _id: Types.ObjectId;
  /** The first name of the user */
  firstName: string;
  /** The last name of the user */
  lastName: string;
  /** The email of the user */
  email: string;
  /** The refresh token of the user */
  refreshToken?: string;
  /** All of the information about the user's notifications */
  notificationPushTokens: string[];
  /** The calendars that the user has access to */
  calendars: Types.ObjectId[];

  /** METADATA */
  /** The date the user was created */
  createdAt: Date;
  /** The date the user was last updated */
  updatedAt: Date;
}

/**
 * All fields that are sanitized and sent to the client about a user
 */
export interface ISanitizedUser {
  /** SYSTEM DATA */
  /** The id of the user */
  _id: string;
  /** The first name of the user's user */
  firstName: string;
  /** The last name of the user's user */
  lastName: string;
  /** The email of the user's user */
  email: string;
  /** The list of calendars */
  calendars: Types.ObjectId[];

  /** METADATA */
  /** The date the user was created */
  createdAt: Date;
  /** The date the user was last updated */
  updatedAt: Date;
}

/**
 * All methods that can be called on a users schema
 */
export interface IUserMethods {
  /** Sanitize fields of the user and return an object that can be sent to the client */
  sanitize: () => ISanitizedUser;
  /** Create an access token for the user */
  createAccessToken: () => Promise<string>;
  /** Create a refresh token for the user */
  createRefreshToken: () => Promise<string>;
  /** Check if the passed refresh token is a valid session for the user */
  validateRefreshToken: (refreshTokenId: string) => Promise<boolean>;
}

// The methods and properties for a fetched document. This will be the most commonly used type
export type IUserSchema = HydratedDocument<IUser, IUserMethods>;

// How we interact with the database: IE what methods we can call on the schema (create, find, etc)
// This is NOT the methods or properties that we can call on a fetched document
export type UserModel = Model<IUser, {}, IUserMethods>;
