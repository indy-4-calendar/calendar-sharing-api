import { z } from 'zod';
import dotenvExtended from 'dotenv-extended';

const env = dotenvExtended.load({
  path: process.env.ENV_FILE || './config/.env.test',
  schema: './config/.env.schema',
  defaults: './config/.env.defaults',
  includeProcessEnv: true,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: false,
});

const LogLevel = z.enum([
  'silent',
  'error',
  'warn',
  'info',
  'http',
  'verbose',
  'debug',
  'silly',
]);

const NodeEnv = z.enum(['dev', 'prod', 'test']);
const AppBundleId = z.enum(['com.calendarsharing']);

const ConfigSchema = z.object({
  /** The applications core information  */
  LoggerLevel: LogLevel,
  Port: z.coerce.number(),

  /** The environments of the application */
  NodeEnv: NodeEnv,
  IsDevelopmentEnv: z.boolean(),
  IsTestingEnv: z.boolean(),
  IsProductionEnv: z.boolean(),

  /** Database information */
  DBUri: z.string(),
  DBName: z.string(),

  /** Security information  */
  SaltFactor: z.coerce.number(),

  /** External API keys and tokens */
  ExpoNotificationsAuthorizationToken: z.string(),

  /** JWT public and private keys */
  JWTAccessTokenExpirationTime: z.string(),
  JWTAccessTokenPublicKey: z.string(),
  JWTAccessTokenPrivateKey: z.string(),
  JWTRefreshTokenExpirationTime: z.string(),
  JWTRefreshTokenPublicKey: z.string(),
  JWTRefreshTokenPrivateKey: z.string(),

  /** Backend configuration */
  PaginationLimit: z.coerce.number(),
  MinimumClientVersion: z.string(),
  LatestClientVersion: z.string(),
  AppBundleId: AppBundleId,
});

const config = ConfigSchema.parse({
  /** The applications core information */
  LoggerLevel: env.LOGGER_LEVEL,
  Port: env.PORT,

  /** The environments of the application */
  NodeEnv: env.NODE_ENV,
  IsDevelopmentEnv: env.NODE_ENV === 'dev',
  IsTestingEnv: env.NODE_ENV === 'test',
  IsProductionEnv: env.NODE_ENV === 'prod',

  /** Database information */
  DBUri: env.DB_URI,
  DBName: env.DB_NAME,

  /** Security information */
  SaltFactor: env.SALT_FACTOR,

  /** External API keys and tokens */
  ExpoNotificationsAuthorizationToken:
    env.EXPO_NOTIFICATIONS_AUTHORIZATION_TOKEN,

  /** JWT public and private keys */
  JWTAccessTokenExpirationTime: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWTAccessTokenPublicKey: env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
  JWTAccessTokenPrivateKey: env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
  JWTRefreshTokenExpirationTime: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWTRefreshTokenPublicKey: env.JWT_REFRESH_TOKEN_PUBLIC_KEY,
  JWTRefreshTokenPrivateKey: env.JWT_REFRESH_TOKEN_PRIVATE_KEY,

  /** Backend configuration */
  PaginationLimit: env.PAGINATION_LIMIT,
  MinimumClientVersion: '1.0.80',
  LatestClientVersion: '1.0.80',
  AppBundleId: 'com.calendarsharing',
});

export default config;
