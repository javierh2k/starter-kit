import '../factories/TaskFactory';
import '../factories/UserFactory';

/*import { Connection } from 'typeorm/connection/Connection';

import { User } from '../../../src/api/models/User';
import { Factory, Seed } from '../../lib/seed/types';

export class CreateUsers implements Seed {

    public async seed(factory: Factory, connection: Connection): Promise<any> {
        await factory(User)().seedMany(10);
    }

}
*/
import { Connection } from 'typeorm/connection/Connection';

import { User } from '../../../src/api/models/User';
import { Task } from '../../api/models/Task';
import { Factory, Seed, times } from '../../lib/seed';

export class CreateUsers implements Seed {
    // User[]
    public async seed(factory: Factory, connection: Connection): Promise<any> {

        const users = [];
        const em = connection.createEntityManager();
        await times(1000, async (n) => {
            const user = await factory(User)().seed();
            const task = await factory(Task)({ user }).make();
            const savedTask = await em.save(task);
            user.tasks = [savedTask];
            users.push(user);
        });
        return users;
        // await factory(User)().seedMany(10);

    }

}
