import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { ExpoPushMessage } from 'expo-server-sdk';

import {
  type IUserMethods,
  type UserModel,
  type IUser,
  type IUserSchema,
} from './@types';

import jwt from '@/lib/jwt';
import config from '@/constants';
import expo from '@/lib/expo';

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    /** System Data */
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    refreshToken: { type: String, required: false },
    calendars: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
      default: [],
    },

    /** Notifications */
    notificationPushToken: { type: String, required: false },
  },
  { timestamps: true },
);

/**
 * Refresh token hashing
 * This is a pre-save hook that hashes the refresh token before saving it to the database
 */
userSchema.pre<IUserSchema>('save', function (next) {
  if (!this.isModified('refreshToken')) return next();
  if (!this.refreshToken) return next();

  bcrypt.hash(this.refreshToken, config.SaltFactor, (err, hash) => {
    if (err) return next(err);
    this.refreshToken = hash;
    next();
  });
});

/**
 * Compare Refresh Token
 * This is a method that compares the refresh token to a hashed version
 */
userSchema.methods.validateRefreshToken = async function (
  this: IUserSchema,
  refreshToken: string,
) {
  if (!this.refreshToken) return false;
  const isEqual = await bcrypt.compare(refreshToken, this.refreshToken);
  return isEqual;
};

/**
 * Create an access token for the user
 */
userSchema.methods.createAccessToken = async function (this: IUserSchema) {
  return jwt.createAccessToken(this.id);
};

/**
 * Create a refresh token for the user
 */
userSchema.methods.createRefreshToken = async function (this: IUserSchema) {
  const token = jwt.createRefreshToken(this.id);
  this.refreshToken = token;
  await this.save();
  return token;
};

/**
 * Send notification
 * This method sends a notification to all of the user's push tokens.
 */
userSchema.methods.sendNotification = async function (
  this: IUserSchema,
  { title, body },
) {
  if (this.notificationPushToken) {
    const pushNotification = {
      title,
      body,
    };

    const message: ExpoPushMessage[] = [
      { to: this.notificationPushToken, ...pushNotification },
    ];

    // Create chunks of 100 messages to send, then send them
    const chunks = expo.chunkPushNotifications(message);
    await Promise.all(chunks.map((c) => expo.sendPushNotificationsAsync(c)));
  }
};

/**
 * Sanitize
 * Remove sensitive information from user object before using it
 * Used for client-side responses
 */
userSchema.methods.sanitize = function (this: IUserSchema) {
  return {
    _id: this.id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    calendars: this.calendars,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model<IUser, UserModel>('User', userSchema);
