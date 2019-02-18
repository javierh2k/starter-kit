import { createClient, ClientOpts } from 'redis';
import { env } from '../env';
import { promisify } from 'util';

const options: ClientOpts = {
    host: env.redis.host,
    port: parseInt(env.redis.port, 10),
};

export interface IRedis {
    save(key: string, value: string): void;
    load(key: string): string;
    saveObject(key: string, object: object): void;
    loadObject(key: string): any;
    get(key: string): any;
}

export class Redis {
    private store: any;

    constructor() {
        this.store = createClient(options);
    }

    public saveObject(key: string, object: object): void {
        this.store.set(key, JSON.stringify(object));
    }

    public loadObject(key: string): any {
        const objectResponse = [];
        this.store.get(key, (err, data) => {
            if (err) {
                throw new Error('Error non object');
            }
            objectResponse.push(JSON.parse(data));
        });
        return objectResponse;
    }

    public save(key: string, value: string): void {
        this.store.set(key, value);
    }

    public load(key: string): string {
        return this.store.get(key, (err, data) => {
            if (err) {
                throw new Error('Error non object');
            }
            return data;
        });
    }
}
