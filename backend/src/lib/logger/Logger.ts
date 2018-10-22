import * as path from 'path';
import * as winston from 'winston';

// tslint:disable-next-line:no-var-requires
import 'winston-mongodb';
import 'winston-syslog';

// require('winston-syslog').Syslog;

// winston.add(winston.transports.Syslog, {

// });

// winston.log('info', 'Hello distributed log files!');
// winston.info('Hello again distributed log files!');

/*
winston.add(winston.transports.File, {
    filename: 'somefile.log',
    level: 'info',
    json: true,
    //    eol: '\r\n', // for Windows, or `eol: ‘n’,` for *NIX OSs
    timestamp: true,
});*/

// winston.log('info', 'Httetstst', { test: 'adv' });
// winston.log('error', 'new', { test: 'adv' });
// winston.info('info', 'restttt');

/**
 * core.Log
 * ------------------------------------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 *
 * By Default it uses the debug-adapter, but you are able to change
 * this in the start up process in the core/index.ts file.
 */

export class Logger {
    public static DEFAULT_SCOPE = 'app';

    private static parsePathToScope(filepath: string): string {
        if (filepath.indexOf(path.sep) >= 0) {
            filepath = filepath.replace(process.cwd(), '');
            filepath = filepath.replace(`${path.sep}src${path.sep}`, '');
            filepath = filepath.replace(`${path.sep}dist${path.sep}`, '');
            filepath = filepath.replace('.ts', '');
            filepath = filepath.replace('.js', '');
            filepath = filepath.replace(path.sep, ':');
        }
        return filepath;
    }

    private scope: string;

    constructor(scope?: string) {
        this.scope = Logger.parsePathToScope(
            scope ? scope : Logger.DEFAULT_SCOPE
        );
        // winston.info('info', 'instancia');
    }

    public debug(message: string, ...args: any[]): void {
        this.log('debug', message, args);
    }

    public info(message: string, ...args: any[]): void {
        this.log('info', message, args);
    }

    public verbose(message: string, ...args: any[]): void {
        this.log('verbose', message, args);
    }

    public warn(message: string, ...args: any[]): void {
        this.log('warn', message, args);
    }

    public error(message: string, ...args: any[]): void {
        this.log('error', message, args);
    }

    private log(level: string, message: string, args: any[]): void {
        if (winston) {
            // mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database
            // winston.add(winston.transports.MongoDB, getDefaults('info'));
            // winston.add(winston.transports.MongoDB, getDefaults('errror'));
            // new winston.transports.MongoDB(getDefaults('info')),

            // const loggger = new winston.Logger({
            //     transports: [
            //         new winston.transports.MongoDB({
            //             name: 'mongodb-info',
            //             dbUri: 'mongodb://localhost:27017',
            //         }),
            //         new winston.transports.MongoDB({
            //             name: 'mongodb-error',
            //             dbUri: 'mongodb://localhost:27017',
            //         }),
            //     ],
            // });
            /*
            winston.configure({
                transports: [
                    new winston.transports.File({
                        filename: 'logs/info.log',
                        name: 'file.info',
                        level: 'info',
                    }),
                    new winston.transports.File({
                        filename: 'logs/warn.log',
                        name: 'file.error',
                        level: 'error',
                    }),
                ],
            });*/
            // loggger.log('info', 'tet');
            // winston.log(level, `${this.formatScope()} ${message}`);
            //   winston.info('info', 'restttt');
            winston[level](`${this.formatScope()} ${message}`, args);
        }
    }

    private formatScope(): string {
        return `[${this.scope}]`;
    }
}
