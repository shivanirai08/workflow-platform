import { AppError } from '../../utils/AppError';
import { assertOrgMember } from '../../utils/orgAccess';
import { findMembership } from '../organizations/org.repository';
import { findProjectById } from '../projects/project.repository';
import type { TaskPriority, TaskStatus } from '../../prisma/client';
import {
  createTask,
  deleteTask,
  findTaskById,
  findTasks,
  updateTask,
} from './task.repository';


const assertAssigneeInOrg = async (assigneeId: string, organizationId: string) => {
  const membership = await findMembership(organizationId, assigneeId);
  if (!membership) {
    throw new AppError('Assignee must be a member of the organization', 400, 'INVALID_ASSIGNEE');
  }
};


// creating a task
export const createTaskService = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    projectId: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date | null;
    assigneeId?: string | null;
  }
) => {
  const project = await findProjectById(data.projectId);
  if (!project) {
    throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
  }

  await assertOrgMember(userId, project.organizationId);

  if (data.assigneeId) {
    await assertAssigneeInOrg(data.assigneeId, project.organizationId);
  }

  return createTask({
    title: data.title,
    description: data.description ?? null,
    projectId: data.projectId,
    status: data.status,
    priority: data.priority,
    dueDate: data.dueDate ?? null,
    assigneeId: data.assigneeId ?? null,
    reporterId: userId,
  });
};


// listing all tasks of a project
export const listTasksService = async (userId: string, projectId: string, options: {
  page: number;
  limit: number;
  assigneeId?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}) => {
  const project = await findProjectById(projectId);
  if (!project) {
    throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
  }

  await assertOrgMember(userId, project.organizationId);

  const skip = (options.page - 1) * options.limit;
  const take = options.limit;
  const { tasks, total } = await findTasks({
    projectId,
    skip,
    take,
    assigneeId: options.assigneeId ,
    status: options.status ,
    priority: options.priority,
    sortBy: options.sortBy,
    sortOrder: options.sortOrder,
  });

  return {
    tasks,
    page: options.page,
    limit: options.limit,
    total,
    totalPages: Math.ceil(total / options.limit) || 0,
  }
};


// getting a task by id
export const getTaskService = async (userId: string, taskId: string) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
  }

  const project = await findProjectById(task.projectId);
  if (!project) {
    throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
  }

  await assertOrgMember(userId, project.organizationId);
  return task;
};


// updating a task
export const updateTaskService = async (
  userId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date | null;
    assigneeId?: string | null;
  }
) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
  }

  const project = await findProjectById(task.projectId);
  if (!project) {
    throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
  }

  await assertOrgMember(userId, project.organizationId);

  if (data.assigneeId) {
    await assertAssigneeInOrg(data.assigneeId, project.organizationId);
  }

  const updateData: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date | null;
    assigneeId?: string | null;
  } = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
  if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;

  return updateTask(taskId, updateData);
};


// deleting a task
export const deleteTaskService = async (userId: string, taskId: string) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
  }

  const project = await findProjectById(task.projectId);
  if (!project) {
    throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
  }

  await assertOrgMember(userId, project.organizationId);
  await deleteTask(taskId);
};
