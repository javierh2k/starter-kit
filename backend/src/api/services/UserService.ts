import { Md5 } from 'md5-typescript';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { cameltoLowerCase, capitalize } from '../../lib/env/utils';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { events } from '../subscribers/events';

// import uuid = require('uuid');
// uuid.v4();

// import * as redis from 'redis'
//     import config from '../../config/config'
//     const client = redis.createClient(config.redis.port, host, config.redis.options);
//     client.on('ready', () => {
//     console.log('redis is ready.')
//     });

const offset = (page, limit) => {
    const base = (page - 1) < 0 ? 0 : page - 1;
    return base * limit;
};

@Service()
export class UserService {

    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async checkIfExists(column: string, value: string): Promise<boolean> {
        return await this.userRepository
            .createQueryBuilder()
            .where(':column = :value', { column, value })
            .getCount() > 0;
    }

    public whereParams(params: string): any {
        // console.log('---', params.length, '--');
        if (typeof (params) === 'undefined' || params.length < 5) { return { fieldsQuery: '', fieldValues: '' }; }
        const filterObject = params.split(',');
        const fieldArray = [];
        const fieldValues = {};
        filterObject.forEach(element => {

            const objectParam = element.split(':');
            const fieldNameString = objectParam[0].split('|');
            let operator = fieldNameString[1] || '=';
            const fieldName = capitalize(cameltoLowerCase(fieldNameString[0]));
            const fieldNameRef = fieldName.replace('.', '_');
            const fieldvalue = operator === 'in' ? objectParam[1].split('-').map(k => `${k}`) : objectParam[1];
            const likeChar = operator === 'like' ? '%' : '';

            switch (operator.toLocaleLowerCase()) {
                case 'in':
                    fieldValues[fieldNameRef] = [fieldvalue];
                    operator = '= ANY';
                    break;
                case 'notin':
                    fieldValues[fieldNameRef] = [fieldvalue];
                    operator = '!= ANY';
                    break;
                case 'null':
                    fieldValues[fieldNameRef] = [fieldvalue];
                    operator = ' IS NULL';
                    break;
                case 'notnull':
                    fieldValues[fieldNameRef] = [fieldvalue];
                    operator = ' IS NOT NULL';
                    break;
                case 'like':
                    fieldValues[fieldNameRef] = likeChar + fieldvalue + likeChar;
                    break;
                default:
                    fieldValues[fieldNameRef] = fieldvalue;
                    break;
            }
            fieldArray.push(` ${fieldName} ${operator} (:${fieldNameRef}) `);
        });
        return { fieldsQuery: fieldArray.join(' AND'), fieldValues };
    }

    public async find(query: any): Promise<any> {
        this.log.info('Find all users');
        const { page, limit, sortBy, desc, filtered } = query;
        console.log(this.whereParams(filtered));
        const { fieldsQuery, fieldValues } = this.whereParams(filtered);
        // const whereString = this.whereParams(filtered);
        const strQuery = this.userRepository.createQueryBuilder()
            .skip(offset(page, limit))
            .take(limit)
            .where(fieldsQuery, fieldValues)
            .orderBy(sortBy, (String(desc) === 'false') ? 'ASC' : 'DESC');

        const cacheId = Md5.init(JSON.stringify(strQuery.getQueryAndParameters()));
        const rows = await strQuery.cache(false).getMany();
        const count = await this.userRepository.createQueryBuilder().cache(cacheId).getCount();
        // .getManyAndCount();

        return { rows, count };
    }

    public findOne(id: string): Promise<User | undefined> {
        this.log.info('Find one user');
        return this.userRepository.findOne({ id });
    }

    public async create(user: User): Promise<User> {
        this.log.info('Create a new user => ', user.toString());
        const newUser = await this.userRepository.save(user);
        this.eventDispatcher.dispatch(events.user.created, newUser);
        return newUser;
    }

    public update(id: string, user: User): Promise<User> {
        this.log.info('Update a user');
        user.id = id;
        return this.userRepository.save(user);
    }

    public async delete(id: string): Promise<void> {
        this.log.info('Delete a user');
        await this.userRepository.delete(id);
        return;
    }

}
