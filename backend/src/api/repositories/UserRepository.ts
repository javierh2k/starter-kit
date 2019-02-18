import { EntityRepository, Repository } from 'typeorm';
import { Md5 } from 'md5-typescript';
import { whereParams, offset } from '../../lib/app/utils';
import { User } from '../models/User';
import { Logger } from '../../lib/logger/Logger';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public async checkIfExists(
        column: string,
        value: string,
        andWhere?: string
    ): Promise<boolean> {
        return (
            (await this.createQueryBuilder()
                .where(':column = :value :addWhere ', {
                    column,
                    value,
                    andWhere,
                })
                .andWhere('and deleted is not null')
                .getCount()) > 0
        );
    }

    public _findOne(id: string): Promise<User | undefined> {
        return this.findOne({ id });
    }

    public _findOneEmail(email: string): Promise<User | undefined> {
        return this.findOne({ where: { email, deleted: null } });
    }

    public async _softDelete(id: string): Promise<any> {
        // const c = new Logger(__filename);
        // c.warn('Deleted by ', redis.userLogged);

        return this.createQueryBuilder()
            .update(User)
            .set({ deleted: new Date() })
            .where('id = :id', { id })
            .execute();
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

    public async _find({
        page,
        limit,
        sortBy,
        desc,
        filtered,
    }: any): Promise<any> {
        //   this.log.info  ('Find all users');

        const { fieldsQuery, fieldValues } = whereParams(filtered);
        // console.log(this);
        const strQuery = this.createQueryBuilder()
            .skip(offset(page || 0, limit || 0))
            .take(limit)
            .where(fieldsQuery, fieldValues)
            .orderBy(sortBy, String(desc) === 'false' ? 'ASC' : 'DESC');

        const cacheId = Md5.init(
            JSON.stringify(strQuery.getQueryAndParameters())
        );
        const rows = await strQuery.cache(false).getMany();
        const count = await this.createQueryBuilder()
            .cache(cacheId)
            .getCount();
        // .getManyAndCount();

        return { rows, count };
    }
}
