import { EntityRepository, Repository } from 'typeorm';
import { Md5 } from 'md5-typescript';
import { whereParams, offset } from '../../lib/app/utils';
import { User } from '../models/User';

@EntityRepository(User)
export class UserRepository extends Repository<User>  {

    public async checkIfExists(
        column: string,
        value: string
    ): Promise<boolean> {
        return (
            (await this
                .createQueryBuilder()
                .where(':column = :value', { column, value })
                .getCount()) > 0
        );
    }

    public _findOne(id: string): Promise<User | undefined> {
        return this.findOne({ id });
    }

    public async _create(user: User): Promise<User> {
        const newUser = await this.save(user);
        // this.eventDispatcher.dispatch(events.user.created, newUser);
        return newUser;
    }

    public _update(id: string, user: User): Promise<User> {
        user.id = id;
        return this.save(user);
    }

    public async _delete(id: string): Promise<void> {
        await this.delete(id);
        return;
    }

    public async _find(query: any): Promise<any> {
     //   this.log.info('Find all users');
        const { page, limit, sortBy, desc, filtered } = query;
        const { fieldsQuery, fieldValues } = whereParams(filtered);
        // console.log(this);
        const strQuery = this
            .createQueryBuilder()
            .skip(offset(page, limit))
            .take(limit)
            .where(fieldsQuery, fieldValues)
            .orderBy(sortBy, String(desc) === 'false' ? 'ASC' : 'DESC');

        const cacheId = Md5.init(
            JSON.stringify(strQuery.getQueryAndParameters())
        );
        const rows = await strQuery.cache(false).getMany();
        const count = await this
            .createQueryBuilder()
            .cache(cacheId)
            .getCount();
        // .getManyAndCount();

        return { rows, count };
    }
}
