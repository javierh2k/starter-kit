import { join } from 'path';

export function getOsEnv(key: string): string {
    return process.env[key] as string;
}

export function getPath(path: string): string {
    return process.env.NODE_ENV === 'production'
        ? join(
              process.cwd(),
              path.replace('src/', 'dist/').slice(0, -3) + '.js'
          )
        : join(process.cwd(), path);
}

export function getPaths(paths: string[]): string[] {
    return paths.map(p => getPath(p));
}

export function getOsPath(key: string): string {
    return getPath(getOsEnv(key));
}

export function getOsPaths(key: string): string[] {
    return getPaths(getOsEnvArray(key));
}

export function getOsEnvArray(key: string, delimiter: string = ','): string[] {
    return (process.env[key] && process.env[key].split(delimiter)) || [];
}

export function toNumber(value: string): number {
    return parseInt(value, 10);
}

export function toBool(value: string): boolean {
    return value === 'true';
}

export function normalizePort(port: string): number | string | boolean {
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) {
        // named pipe
        return port;
    }
    if (parsedPort >= 0) {
        // port number
        return parsedPort;
    }
    return false;
}

export function fixForPostgres(cols: any): [any] {
    return cols.map(col => {
        if (getOsEnv('TYPEORM_CONNECTION_TYPE') === 'postgres') {
            if (col.name.match('id')) {
                col.type = 'uuid';
                col.generationStrategy = 'uuid';
                col.isGenerated = true;
                delete col.length;
                if (col.name.match('_id')) {
                    col.isNullable = true;
                    delete col.isGenerated;
                    delete col.generationStrategy;
                }
                return col;
            }
            if (col.type.match('int')) {
                delete col.length;
                return col;
            }

            if (col.name.match('created')) {
                col.type = 'timestamptz';
                col.default = 'now()';
                delete col.length;
                return col;
            }

            if (col.name.match('modified')) {
                col.type = 'timestamptz';
                col.default = 'now()';
                delete col.length;
                return col;
            }
        }
        return col;
    });
}
