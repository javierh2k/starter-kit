import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { NewTask } from '../controllers/requests/NewTask';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { TaskRepository } from '../repositories/TaskRepository';

@Service()
export class TaskService {

    constructor(
        @OrmRepository() private taskRepository: TaskRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Task[]> {
        this.log.info('Find all task');
        return this.taskRepository._find();
    }

    public findOne(id: string): Promise<Task | undefined> {
        this.log.info('Find one task');
        return this.taskRepository._findOne(id);
    }

    public findByUserId(userId: string): Promise<Task[]> {
        this.log.info('Find all tasks of the current user');
        return this.taskRepository.find(userId);
    }

    public async create(newTask: NewTask, currentUser: User): Promise<Task> {
        this.log.info('Create a new task for the current user');
        return await this.taskRepository._create(newTask, currentUser);
    }

    public async update(taskId: string, task: Task, currentUser: User): Promise<Task> {
        this.log.info('Update task of the current user');
        return this.taskRepository._update(taskId, task, currentUser);
    }

}
