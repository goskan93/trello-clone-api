import { Injectable } from '@nestjs/common';
import { TaskInput } from 'src/contracts/inputs/TaskInput';
import { TaskOutput } from 'src/contracts/outputs/TaskOutput';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './dto/task.schema';
import { Model } from 'mongoose';
import { insertElement } from 'src/helpers/arrayHelpers';
import { MoveTask } from 'src/contracts/inputs/MoveTask';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async getAllByUserId(userId: string): Promise<TaskOutput[]> {
    const tasks = await this.taskModel.find({ user: userId }).populate('card');
    const mappedTasks = tasks.map((t) => {
      return new TaskOutput(t.name, t._id.toString(), t.card.id, t.index);
    });
    return mappedTasks;
  }

  async findById(userId: string, taskId: string): Promise<TaskOutput> {
    const task = await this.taskModel.findById(taskId);

    if (task && task.user.toString() === userId) {
      return new TaskOutput(
        task.name,
        task._id.toString(),
        task.card.id,
        task.index,
      );
    }
    return null;
  }

  private async findByCardId(
    userId: string,
    cardId: string,
  ): Promise<TaskOutput[]> {
    const tasksInCard = await this.taskModel.find({
      card: cardId,
      user: userId,
    });
    return tasksInCard.map((t) => {
      return new TaskOutput(t.name, t._id.toString(), t.card.id, t.index);
    });
  }

  async delete(userId: string, taskId: string) {
    await this.taskModel.deleteOne({ user: userId, _id: taskId });
  }

  private async update(taskId: string, cardId: string, index: number) {
    await this.taskModel.findOneAndUpdate(
      { _id: taskId },
      { card: cardId, index },
    );
  }

  async create(userId: string, task: TaskInput): Promise<TaskOutput> {
    const cardTasks = await this.findByCardId(userId, task.cardId);

    const newTask = new this.taskModel({
      ...task,
      card: task.cardId,
      index: cardTasks.length,
      user: userId,
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

  async move(userId: string, context: MoveTask): Promise<void> {
    let cardTasks = (await this.findByCardId(userId, context.toCardId)).sort(
      (a, b) => a.index - b.index,
    );
    let currentTask = await this.findById(userId, context.taskId);
    const sortedTasks = this.prepareToMove(
      cardTasks,
      currentTask,
      context.index,
      context.fromCardId === context.toCardId,
    );
    let i = 0;
    for await (const t of sortedTasks) {
      await this.update(t.id, context.toCardId, i);
      i++;
    }
  }

  private prepareToMove(
    tasks: TaskOutput[],
    task: TaskOutput,
    index: number,
    moveInsideCard: boolean,
  ): TaskOutput[] {
    let _index = index;
    let _tasks = tasks;
    if (moveInsideCard) {
      const indextOfTask = tasks.findIndex((t) => t.id === task.id);
      if (indextOfTask < _index) {
        _index--;
      }
      _tasks = _tasks.filter((t) => t.id !== task.id);
    }
    _tasks = insertElement(_tasks, task, _index);
    return _tasks;
  }
}
