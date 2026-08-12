import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';
import { TaskPriority, TaskStatus } from '../../prisma/client';
import {
  createTaskService,
  deleteTaskService,
  getTaskService,
  listTasksService,
  updateTaskService,
} from './task.services';

type AuthRequest = Request & { user?: { id: string } };

const TASK_STATUSES = Object.values(TaskStatus);
const TASK_PRIORITIES = Object.values(TaskPriority);

const parseDueDate = (value: unknown): Date | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new AppError('dueDate must be an ISO date string or null', 400, 'VALIDATION_ERROR');
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError('dueDate must be a valid ISO date string', 400, 'VALIDATION_ERROR');
  }
  return date;
};


// creating task
export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, projectId, status, priority, dueDate, assigneeId } = req.body;
    const userId = req.user!.id;

    if (!title || !projectId) {
      return next(new AppError('title and projectId are required', 400, 'VALIDATION_ERROR'));
    }
    if (typeof title !== 'string' || title.length < 2 || title.length > 200) {
      return next(new AppError('title must be between 2 and 200 characters', 400, 'VALIDATION_ERROR'));
    }
    if (typeof projectId !== 'string') {
      return next(new AppError('projectId must be a string', 400, 'VALIDATION_ERROR'));
    }
    if (description !== undefined && typeof description !== 'string') {
      return next(new AppError('description must be a string', 400, 'VALIDATION_ERROR'));
    }
    if (status !== undefined && !TASK_STATUSES.includes(status)) {
      return next(new AppError('Invalid status', 400, 'VALIDATION_ERROR'));
    }
    if (priority !== undefined && !TASK_PRIORITIES.includes(priority)) {
      return next(new AppError('Invalid priority', 400, 'VALIDATION_ERROR'));
    }
    if (assigneeId !== undefined && assigneeId !== null && typeof assigneeId !== 'string') {
      return next(new AppError('assigneeId must be a string or null', 400, 'VALIDATION_ERROR'));
    }

    const finalAssigneeId = typeof assigneeId === 'string' ? assigneeId.trim() || null : assigneeId ?? null;

    const parsedDueDate = parseDueDate(dueDate);

    const task = await createTaskService(userId, {
      title,
      description,
      projectId,
      status,
      priority,
      dueDate: parsedDueDate,
      assigneeId: finalAssigneeId,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};


// listing tasks of a project
export const listTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const projectId = req.query.projectId as string | undefined;
    const page = req.query.page !== undefined ? Number(req.query.page) : 1;
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;
    const assigneeId = req.query.assigneeId as string | undefined;
    const status = req.query.status as TaskStatus | undefined;
    const priority = req.query.priority as TaskPriority | undefined;
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder;

    if (!projectId) {
      return next(new AppError('projectId query param is required', 400, 'VALIDATION_ERROR'));
    }

    if( !Number.isInteger(limit) || (limit < 1 || limit > 50)) {
      return next(new AppError('limit must be between 1 and 50', 400, 'VALIDATION_ERROR'));
    }
    if( !Number.isInteger(page) || (page < 1)) {
      return next(new AppError('page must be greater than 0', 400, 'VALIDATION_ERROR'));
    }
    if(sortBy !== undefined && sortBy !== 'createdAt' && sortBy !== 'dueDate' && sortBy !== 'priority' && sortBy !== 'title') {
      return next(new AppError('sortBy must be createdAt, dueDate, priority or title', 400, 'VALIDATION_ERROR'));
    }
    if(sortOrder !== undefined && sortOrder !== 'asc' && sortOrder !== 'desc') {
      return next(new AppError('sortOrder must be asc or desc', 400, 'VALIDATION_ERROR'));
    }
    if( status !== undefined && !TASK_STATUSES.includes(status)) {
      return next(new AppError('Invalid status', 400, 'VALIDATION_ERROR'));
    }
    if( priority !== undefined && !TASK_PRIORITIES.includes(priority)) {
      return next(new AppError('Invalid priority', 400, 'VALIDATION_ERROR'));
    }

    const tasks = await listTasksService(userId, projectId, {
      page: page,
      limit: limit,
      assigneeId: assigneeId || undefined,
      status: status || undefined,
      priority: priority || undefined,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    });

    return res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};


// getting a task
export const getTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id as string;

    const task = await getTaskService(userId, taskId);

    return res.status(200).json({
      success: true,
      message: 'Task fetched successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};


// updating a task
export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id as string;
    const { title, description, status, priority, dueDate, assigneeId } = req.body;

    if (
      title === undefined &&
      description === undefined &&
      status === undefined &&
      priority === undefined &&
      dueDate === undefined &&
      assigneeId === undefined
    ) {
      return next(new AppError('Provide at least one field to update', 400, 'VALIDATION_ERROR'));
    }
    if (title !== undefined && (typeof title !== 'string' || title.length < 2 || title.length > 200)) {
      return next(new AppError('title must be between 2 and 200 characters', 400, 'VALIDATION_ERROR'));
    }
    if (description !== undefined && description !== null && typeof description !== 'string') {
      return next(new AppError('description must be a string or null', 400, 'VALIDATION_ERROR'));
    }
    if (status !== undefined && !TASK_STATUSES.includes(status)) {
      return next(new AppError('Invalid status', 400, 'VALIDATION_ERROR'));
    }
    if (priority !== undefined && !TASK_PRIORITIES.includes(priority)) {
      return next(new AppError('Invalid priority', 400, 'VALIDATION_ERROR'));
    }
    if (assigneeId !== undefined && assigneeId !== null && typeof assigneeId !== 'string') {
      return next(new AppError('assigneeId must be a string or null', 400, 'VALIDATION_ERROR'));
    }

    const finalAssigneeId = typeof assigneeId === 'string' ? assigneeId.trim() || null : assigneeId ?? null;

    const parsedDueDate = parseDueDate(dueDate);

    const task = await updateTaskService(userId, taskId, {
      title,
      description,
      status,
      priority,
      dueDate: parsedDueDate,
      assigneeId: finalAssigneeId,
    });

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};


// deleting a task
export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id as string;

    await deleteTaskService(userId, taskId);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
