import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../../prisma/client';

export const listTaskQuerySchema = z.object({
    projectId: z.string().min(1, 'Project ID is required'),
    page: z.coerce.number().int().min(1, 'Page must be greater than 0').default(1),
    limit: z.coerce.number().int().min(1, 'Limit must be greater than 0').max(50, 'Limit must be less than 50').default(10),
    assigneeId: z.string().min(1).optional(),
    status: z.enum(TaskStatus).optional(),
    priority: z.enum(TaskPriority).optional(),
    sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'title']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});


export type ListTaskQuery = z.infer<typeof listTaskQuerySchema>;