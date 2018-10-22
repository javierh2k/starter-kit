import {
    MicroframeworkLoader,
    MicroframeworkSettings
} from 'microframework-w3tec';
import * as winston from 'winston';
// import 'winston-syslog';

import { env } from '../env';

const config = {
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warn: 4,
        notice: 5,
        info: 6,
        debug: 7,
    },
    colors: {
        emerg: 'red',
        alert: 'yellow',
        crit: 'red',
        error: 'red',
        warn: 'red',
        notice: 'green',
        info: 'cyan',
        debug: 'white',
    },
};

export const winstonLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined
) => {
    winston.configure({
        transports: [
            new winston.transports.Console({
                level: env.log.level,
                handleExceptions: true,
                json: env.log.json,
                timestamp: env.node !== 'development',
                colorize: env.node === 'development',
            }),
            new winston.transports.MongoDB({
                level: env.log.level,
                name: 'logs',
                handleExceptions: true,
                timestamp: true,
                colorize: true,
                db: 'mongodb://localhost:27017/logs', // process.env.LOG_MONGODB_URI,
                collection: 'logs',
                levels: config.levels,
                colors: config.colors,
            }),

            /*new winston.transports.Syslog({
                level: env.log.level,
                name: 'syslog',
                // type: '5424',
                // protocol: 'unix',
                path: '/var/run/syslog',
            }),
*/
            /*new winston.transports.MongoDB({
                level: 'error',
                handleExceptions: true,
                timestamp: true,
                name: 'error',
                colorize: true,
                db: 'mongodb://localhost:27017/error', // process.env.LOG_MONGODB_URI,
                collection: 'error',
            }),*/
        ],
    });
};
