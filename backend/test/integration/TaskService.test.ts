import { NewTask } from 'src/api/controllers/requests/NewTask';
import { Container } from 'typedi';
import { Connection } from 'typeorm';

import { Task } from '../../src/api/models/Task';
import { User } from '../../src/api/models/User';
import { TaskService } from '../../src/api/services/TaskService';
import { closeDatabase, createDatabaseConnection, migrateDatabase } from '../utils/database';
import { configureLogger } from '../utils/logger';

describe('TaskService', () => {

    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    let connection: Connection;
    beforeAll(async () => {
        configureLogger();
        connection = await createDatabaseConnection();
    });
    beforeEach(() => migrateDatabase(connection));

    // -------------------------------------------------------------------------
    // Tear down
    // -------------------------------------------------------------------------

    afterAll(() => closeDatabase(connection));

    // -------------------------------------------------------------------------
    // Test cases
    // -------------------------------------------------------------------------

    test('should create a new task in the database', async (done) => {
        const task = new Task();
        const user = new User();
        user.id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

        task.id = 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx';
        task.title = 'test';
        task.isCompleted = true;
        const service = Container.get<TaskService>(TaskService);
        const resultCreate = await service.create(task, user);
        expect(resultCreate.title).toBe(task.title);
        expect(resultCreate.isCompleted).toBe(task.isCompleted);

        const resultFind = await service.findOne(resultCreate.id);
        if (resultFind) {
            expect(resultFind.title).toBe(task.title);
            expect(resultFind.isCompleted).toBe(task.isCompleted);
        } else {
            fail('Could not find task');
        }
        done();
    });

});
