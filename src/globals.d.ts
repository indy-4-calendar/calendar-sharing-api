import { IUserSchema } from '@/models/@types';

declare global {
  declare namespace Express {
    export interface Request {
      user?: IUserSchema;
    }
  }
}
