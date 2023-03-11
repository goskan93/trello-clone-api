import { Injectable } from '@nestjs/common';
import { TaskInput } from 'src/contracts/inputs/TaskInput';
import { TaskOutput } from 'src/contracts/outputs/TaskOutput';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../dto/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async getAll(): Promise<TaskOutput[]> {
    const tasks = await this.taskModel.find().populate('card');
    const mappedTasks = tasks.map((t) => {
      return new TaskOutput(t.name, t._id.toString(), t.card.id);
    });
    return mappedTasks;
  }

  async findById(id: string): Promise<TaskOutput> {
    return await this.taskModel.findById(id);
  }

  async delete(id: string) {
    await this.taskModel.deleteOne({ _id: id });
  }

  async create(task: TaskInput): Promise<string> {
    const newTask = new this.taskModel({ ...task, card: task.cardId });
    return newTask.save().then((savedTask) => savedTask._id.toString());
  }
}
