/*import {
    MicroframeworkLoader,
    MicroframeworkSettings
} from 'microframework-w3tec';
import * as winston from 'winston';
// import 'winston-syslog';
import * as MongoDB from 'winston-mongodb';

import { env } from '../env';
import * as fs from 'fs';
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const { splat, combine, timestamp, printf, colorize, label } = winston.format;

export const winstonLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined
) => {
    winston.configure({
        exceptionHandlers: [
            new winston.transports.File({
                filename: logDir + '/exceptions.log',
            }),
        ],
        format: combine(
            label({ label: 'app-server' }),
            // splat(),
            colorize(),
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            printf(info => {
                return `${info.timestamp} [${info.label}] [${
                    info.level
                }] : ${JSON.stringify(info.message)}`;
            })
        ),
        transports: [
            new winston.transports.Console({
                level: env.log.level,
                handleExceptions: true,
                // json: env.log.json,
                // timestamp: env.node !== 'development',
                // colorize: env.node === 'development',
            }),
            new winston.transports.MongoDB({
                level: env.log.level,
                name: 'logs',
                handleExceptions: true,
                timestamp: true,
                colorize: true,
                db: 'mongodb://localhost:27017/logs', // process.env.LOG_MONGODB_URI,
                collection: 'logs',
                // levels: config.levels,
                // colors: config.colors,
            }),
            new winston.transports.File({
                level: env.log.level,
                maxsize: 1024 * 1024 * 10, // 10MB
                filename: logDir + '/combined.log',
            }),

            / *new winston.transports.Syslog({
                level: env.log.level,
                name: 'syslog',
                // type: '5424',
                // protocol: 'unix',
                path: '/var/run/syslog',
            }),
* /
            / * new winston.transports.MongoDB({
                level: 'error',
                handleExceptions: true,
                timestamp: true,
                name: 'error',
                colorize: true,
                db: 'mongodb://localhost:27017/error', // process.env.LOG_MONGODB_URI,
                collection: 'error',
            }),* /
        ],
    });
};

*/
