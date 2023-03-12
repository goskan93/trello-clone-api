import { Injectable } from '@nestjs/common';
import { TaskInput } from 'src/contracts/inputs/TaskInput';
import { TaskOutput } from 'src/contracts/outputs/TaskOutput';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../dto/task.schema';
import { Model } from 'mongoose';
import { insertElement } from 'src/helpers/arrayHelpers';
import { MoveTask } from 'src/contracts/inputs/MoveTask';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async getAll(): Promise<TaskOutput[]> {
    const tasks = await this.taskModel.find().populate('card');
    const mappedTasks = tasks.map((t) => {
      return new TaskOutput(t.name, t._id.toString(), t.card.id, t.index);
    });
    return mappedTasks;
  }

  async findById(id: string): Promise<TaskOutput> {
    return await this.taskModel.findById(id);
  }

  async findByCardId(id: string): Promise<TaskOutput[]> {
    const tasksForCard = await this.taskModel.find({ card: id });
    return tasksForCard.map((t) => {
      return new TaskOutput(t.name, t._id.toString(), t.card.id, t.index);
    });
  }

  async delete(id: string) {
    await this.taskModel.deleteOne({ _id: id });
  }

  private async update(taskId: string, cardId: string, index: number) {
    await this.taskModel.findOneAndUpdate(
      { _id: taskId },
      { card: cardId, index },
    );
  }

  async create(task: TaskInput): Promise<TaskOutput> {
    const cardTasks = await this.findByCardId(task.cardId);

    const newTask = new this.taskModel({
      ...task,
      card: task.cardId,
      index: cardTasks.length,
    });
    return newTask.save().then((savedTask) => {
      return new TaskOutput(
        savedTask.name,
        savedTask._id.toString(),
        savedTask.card.toString(),
        savedTask.index,
      );
    });
  }

  async move(context: MoveTask): Promise<void> {
    let toCardTasks = (await this.findByCardId(context.toCardId)).sort();
    let currentTask = await this.findById(context.taskId);
    if (context.fromCardId === context.toCardId) {
      toCardTasks = toCardTasks.filter((t) => t.id !== context.taskId);
    }
    toCardTasks = insertElement(toCardTasks, currentTask, context.index);
    toCardTasks.forEach(async (t, i) => {
      await this.update(t.id, context.toCardId, i);
    });
  }
}
