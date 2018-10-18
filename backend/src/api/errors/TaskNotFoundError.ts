import { HttpError } from 'routing-controllers';

export class TaskNotFoundError extends HttpError {
    constructor() {
        super(404, 'Task not found!');
    }
}
