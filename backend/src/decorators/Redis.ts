import { Container } from 'typedi';
import { Redis as redisDB, IRedis } from '../lib/Redis';

export function Redis(): any {
    return (object: any, propertyName: string, index?: number): any => {
        const redis = new redisDB();
        Container.registerHandler({
            object,
            propertyName,
            index,
            value: () => redis,
        });
    };
}

export { IRedis };
