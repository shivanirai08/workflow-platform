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
