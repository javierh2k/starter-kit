import * as dotenv from 'dotenv';
import * as path from 'path';

import * as pkg from '../package.json';
import {
    getOsEnv,
    getOsPath,
    getOsPaths,
    normalizePort,
    toBool,
    toNumber
} from './lib/env';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
    path: path.join(
        process.cwd(),
        `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`
    ),
});

/**
 * Environment variables
 */

export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnv('APP_NAME'),
        salt: getOsEnv('SALT'),
        refreshSalt: getOsEnv('REFRESH_SALT'),
        tokenLife: getOsEnv('TOKEN_LIFE'),
        refreshTokenLife: getOsEnv('REFRESH_SALT_LIFE'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        host: getOsEnv('APP_HOST'),
        schema: getOsEnv('APP_SCHEMA'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER')),
        dirs: {
            migrations: getOsPaths('TYPEORM_MIGRATIONS'),
            migrationsDir: getOsPath('TYPEORM_MIGRATIONS_DIR'),
            entities: getOsPaths('TYPEORM_ENTITIES'),
            entitiesDir: getOsPath('TYPEORM_ENTITIES_DIR'),
            controllers: getOsPaths('CONTROLLERS'),
            middlewares: getOsPaths('MIDDLEWARES'),
            interceptors: getOsPaths('INTERCEPTORS'),
            subscribers: getOsPaths('SUBSCRIBERS'),
        },
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnv('LOG_JSON')),
        output: getOsEnv('LOG_OUTPUT'),
    },
    db: {
        type: getOsEnv('TYPEORM_CONNECTION_TYPE'),
        host: getOsEnv('TYPEORM_HOST'),
        port: toNumber(getOsEnv('TYPEORM_PORT')),
        username: getOsEnv('TYPEORM_USERNAME'),
        password: getOsEnv('TYPEORM_PASSWORD'),
        database: getOsEnv('TYPEORM_DATABASE'),
        synchronize: toBool(getOsEnv('TYPEORM_SYNCHRONIZE')),
        logging: toBool(getOsEnv('TYPEORM_LOGGING')),
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE'),
        file: getOsEnv('SWAGGER_FILE'),
        email: getOsEnv('SWAGGER_USERNAME'),
        password: getOsEnv('SWAGGER_PASSWORD'),
    },
    redis: {
        host: getOsEnv('REDIS_HOST'),
        port: getOsEnv('REDIS_PORT'),
    },
    monitor: {
        enabled: toBool(getOsEnv('MONITOR_ENABLED')),
        route: getOsEnv('MONITOR_ROUTE'),
        email: getOsEnv('MONITOR_USERNAME'),
        password: getOsEnv('MONITOR_PASSWORD'),
    },
};
