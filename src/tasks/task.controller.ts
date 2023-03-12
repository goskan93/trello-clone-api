import {
  Controller,
  Get,
  HttpCode,
  Param,
  Res,
  Post,
  Body,
  Delete,
  HttpStatus,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { TaskOutput } from 'src/contracts/outputs/TaskOutput';
import { TaskService } from './task.service';
import { Response } from 'express';
import { TaskInput } from 'src/contracts/inputs/TaskInput';
import { MoveTask } from 'src/contracts/inputs/MoveTask';
@Controller('api/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @HttpCode(200)
  async getAll(): Promise<TaskOutput[]> {
    try {
      return this.taskService.getAll();
    } catch (error) {
      throw new InternalServerErrorException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error,
        },
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TaskOutput> {
    const task = await this.taskService.findById(id);
    if (task) {
      res.status(HttpStatus.OK);
      return task;
    }

    res.status(HttpStatus.NOT_FOUND);
    return {} as TaskOutput;
  }

  @Post()
  async create(@Body() task: TaskInput): Promise<TaskOutput> {
    try {
      const newTask = await this.taskService.create(task);
      return newTask;
    } catch (error) {
      throw new InternalServerErrorException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error,
        },
        {
          cause: error,
        },
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.taskService.delete(id);
  }

  @Patch('move')
  async move(@Body() moveContext: MoveTask) {
    await this.taskService.move(moveContext);
  }
}
