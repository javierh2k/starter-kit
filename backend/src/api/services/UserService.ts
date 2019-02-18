import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";

import {
    EventDispatcher,
    EventDispatcherInterface
} from "../../decorators/EventDispatcher";
import { Logger, ILogger } from "../../decorators/Logger";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { events } from "../subscribers/events";

// import uuid = require('uuid');
// uuid.v4();

// import * as redis from 'redis'
//     import config from '../../config/config'
//     const client = redis.createClient(config.redis.port, host, config.redis.options);
//     client.on('ready', () => {
//     console.log('redis is ready.')
//     });

@Service()
export class UserService {
    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: ILogger
    ) {}

    public findOne(id: string): Promise<User | undefined> {
        this.log.info("Find one user");
        return this.userRepository._findOne(id);
    }

    public async create(user: User): Promise<User> {
        this.log.info("Create a new user => ", user.toString());
        const newUser = await this.userRepository.save(user);
        this.eventDispatcher.dispatch(events.user.created, newUser);
        return newUser;
    }

    public update(id: string, user: User): Promise<User> {
        this.log.info("Update a user");
        user.id = id;
        return this.userRepository.save(user);
    }

    public async delete(id: string): Promise<void> {
        this.log.info("Delete a user");
        await this.userRepository._delete(id);
        return;
    }

    public async find(query: any): Promise<any> {
        this.log.info("Find all users");
        this.log.verbose("find", "allusers");
        // console.log(this.userRepository);
        const data = this.userRepository._find(query);
        return data;
    }
}
