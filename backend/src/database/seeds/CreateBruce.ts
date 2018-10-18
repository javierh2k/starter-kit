import { Connection } from 'typeorm';

import { Task } from '../../../src/api/models/Task';
import { User } from '../../../src/api/models/User';
import { Factory, Seed } from '../../lib/seed/types';

export class CreateBruce implements Seed {

    public async seed(factory: Factory, connection: Connection): Promise<User> {
        // const userFactory = factory<User, { role: string }>(User as any);
        // const adminUserFactory = userFactory({ role: 'admin' });

        // const bruce = await adminUserFactory.make();
        // console.log(bruce);

        // const bruce2 = await adminUserFactory.seed();
        // console.log(bruce2);

        // const bruce3 = await adminUserFactory
        //     .map(async (e: User) => {
        //         e.firstName = 'Bruce';
        //         return e;
        //     })
        //     .seed();
        // console.log(bruce3);

        // return bruce;

        // const connection = await factory.getConnection();
        const em = connection.createEntityManager();

        /*const bruce = new User();
        bruce.firstName = 'Bruce';
        bruce.lastName = 'Wayne';
        bruce.email = 'bruce.wayne@wayne-enterprises.com';
        bruce.username = 'bruce';
        bruce.password = '1234';
        const user = await em.save(bruce);
        user.tasks = await factory(Task)({ user }).seedMany(4);
        return user;*/

        const bruce = new User();
        bruce.username = 'bruce';
        bruce.firstName = 'Bruce';
        bruce.lastName = 'Wayne';
        bruce.email = 'bruce.wayne@wayne-enterprises.com';
        bruce.password = '1234';
        const user = await em.save(bruce);
        user.tasks = await factory(Task)({ user }).seedMany(4);
        return user;

    }

}
