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
    return await this.taskModel.find();
  }

  async findById(id: string): Promise<TaskOutput> {
    return await this.taskModel.findById(id);
  }

  async delete(id: string) {
    await this.taskModel.deleteOne({ _id: id });
  }

  async create(task: TaskInput): Promise<string> {
    const newTask = new this.taskModel(task);
    return newTask.save().then((savedTask) => savedTask._id.toString());
  }
}
