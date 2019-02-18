import {
    MicroframeworkLoader,
    MicroframeworkSettings
} from 'microframework-w3tec';
import * as winston from 'winston';
import * as fs from 'fs';
import { env } from '../env';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    // Create the directory if it does not exist
    fs.mkdirSync(logDir);
}

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

const twoDigit = '2-digit';
const options = {
    day: twoDigit,
    month: twoDigit,
    year: twoDigit,
    hour: twoDigit,
    minute: twoDigit,
    second: twoDigit,
};

function formatter(args: any): any {
    const dateTimeComponents = new Date()
        .toLocaleTimeString('en-us', options)
        .split(',');
    const logMessage =
        dateTimeComponents[0] +
        dateTimeComponents[1] +
        ' - ' +
        args.level +
        ': ' +
        args.message;
    return logMessage;
}

export const winstonLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined
) => {
    winston.configure({
        exceptionHandlers: [
            new winston.transports.File({
                filename: logDir + '/exceptions.log',
            }),
        ],
        transports: [
            new winston.transports.Console({
                level: env.log.level,
                handleExceptions: true,
                json: env.log.json,
                timestamp: env.node !== 'development',
                colorize: env.node === 'development',
            }),
            new winston.transports.File({
                level: env.log.level,
                tailable: true,
                // datePattern: 'yyy-MM-dd HH:mm:ss',
                // prepend: true,
                json: false,
                formatter,
                timestamp: true,
                filename: logDir + '/info.log',
                // timestamp: true,
                colorize: true,
                maxsize: 1024 * 1024 * 10, // 10MB
                // filename: logDir + '/combined.log',
            }),
            new winston.transports.MongoDB({
                level: env.log.level,
                name: 'logs',
                handleExceptions: true,
                timestamp: true,
                colorize: true,
                storeHost: true,
                db: 'mongodb://localhost:27017/logger', // process.env.LOG_MONGODB_URI,
                collection: 'logs',
                levels: config.levels,
                colors: config.colors,
            }),

            new winston.transports.Syslog({
                level: env.log.level,
                host: 'localhost',
                port: 514,
                name: 'syslog',
                json: true,
                // type: '5424',
                // protocol: 'unix',
                path: 'nodejs.log',
            }),

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
