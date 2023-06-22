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
  UseGuards,
} from '@nestjs/common';
import {
  TaskOutput,
  TaskInput,
  MoveTask,
} from '@goskan93/trello-clone-contracts';
import { TaskService } from './task.service';
import { Response } from 'express';
import { AuthGuard } from '../authentication/auth.guard';
import { PermissionGuard } from '../authentication/permissions.guard';
import { RequiredPermissions } from '../authentication/permissions.decorator';
import { PERMISSIONS } from '../authentication/permissions';

@UseGuards(AuthGuard, PermissionGuard)
@Controller('api/users/:userId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @HttpCode(200)
  @RequiredPermissions(PERMISSIONS.TASK_GET)
  async getAllByUserId(@Param('userId') userId: string): Promise<TaskOutput[]> {
    try {
      return this.taskService.getAllByUserId(userId);
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

  @Get(':taskId')
  @RequiredPermissions(PERMISSIONS.TASK_GET)
  async getById(
    @Param('userId') userId: string,
    @Param('taskId') taskId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TaskOutput> {
    const task = await this.taskService.findById(userId, taskId);
    if (task) {
      res.status(HttpStatus.OK);
      return task;
    }

    res.status(HttpStatus.NOT_FOUND);
    return {} as TaskOutput;
  }

  @Post()
  @RequiredPermissions(PERMISSIONS.TASK_CREATE)
  async create(
    @Param('userId') userId: string,
    @Body() task: TaskInput,
  ): Promise<TaskOutput> {
    try {
      const newTask = await this.taskService.create(userId, task);
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

  @Delete(':taskId')
  @RequiredPermissions(PERMISSIONS.TASK_DELETE)
  async delete(
    @Param('userId') userId: string,
    @Param('taskId') taskId: string,
  ) {
    await this.taskService.delete(userId, taskId);
  }

  @Patch('move')
  @RequiredPermissions(PERMISSIONS.TASK_MOVE)
  async move(@Param('userId') userId: string, @Body() moveContext: MoveTask) {
    await this.taskService.move(userId, moveContext);
  }
}
