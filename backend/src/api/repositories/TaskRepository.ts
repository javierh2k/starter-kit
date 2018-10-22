import { EntityRepository, Repository } from 'typeorm';

import { Task } from '../models/Task';
import { NewTask } from '../controllers/requests/NewTask';
import { NotAllowedError } from '../errors/NotAllowedError';
import { User } from '../models/User';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>  {

    public _find(): Promise<Task[]> {
        return this.find({ relations: ['user'] });
    }

    public _findOne(id: string): Promise<Task | undefined> {
        return this.findOne({ id });
    }

    public _findByUserId(userId: string): Promise<Task[]> {
        return this.find({
            where: { userId },
        });
    }

    public async _create(newTask: NewTask, currentUser: User): Promise<Task> {
        const task = new Task();
        task.title = newTask.title;
        task.userId = currentUser.id;
        task.isCompleted = false;
        return await this.save(task);
    }

    public async _update(taskId: string, task: Task, currentUser: User): Promise<Task> {

        const currentTask = await this.findOne(taskId);
        if (currentTask.userId !== currentUser.id) {
            throw new NotAllowedError();
        }

        task.id = taskId;
        return this.save(task);
    }

}
