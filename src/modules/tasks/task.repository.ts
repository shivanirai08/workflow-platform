import prisma from '../../config/db';
import type { TaskPriority, TaskStatus } from '../../prisma/client';


export const createTask = async (data: {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
  projectId: string;
  assigneeId?: string | null;
  reporterId: string;
}) => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ?? null,
      projectId: data.projectId,
      assigneeId: data.assigneeId ?? null,
      reporterId: data.reporterId,
    },
  });
};


export const findTaskById = async (id: string) => {
  return prisma.task.findUnique({
    where: { id },
  });
};


export const findTasksByProjectId = async (projectId: string) => {
  return prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });
};


export const updateTask = async (
  id: string,
  data: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date | null;
    assigneeId?: string | null;
  }
) => {
  return prisma.task.update({
    where: { id },
    data,
  });
};


export const deleteTask = async (id: string) => {
  return prisma.task.delete({
    where: { id },
  });
};


export const findTasks = async (options: {
  projectId: string;
  skip: number;
  take: number;
  assigneeId?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}) => {
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: {
        projectId: options.projectId,
        ...(options.assigneeId ? { assigneeId: options.assigneeId } : {}),
        ...(options.status ? { status: options.status } : {}),
        ...(options.priority ? { priority: options.priority } : {}),
      },
      skip: options.skip,
      take: options.take,
      orderBy: {
        [options.sortBy ?? 'createdAt']: options.sortOrder ?? 'desc',
      },
    }),
    prisma.task.count({ where: {
      projectId: options.projectId,
      ...(options.assigneeId ? { assigneeId: options.assigneeId } : {}),
      ...(options.status ? { status: options.status } : {}),
      ...(options.priority ? { priority: options.priority } : {}),
    } }),
  ]) 
  return { tasks, total };
};