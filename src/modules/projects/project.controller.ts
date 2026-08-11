import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';
import {
  createProjectService,
  deleteProjectService,
  getProjectService,
  listProjectsService,
  updateProjectService,
} from './project.services';

type AuthRequest = Request & { user?: { id: string } };


// creating project
export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, organizationId } = req.body;
    const userId = req.user!.id;

    if (!name || !organizationId) {
      return next(new AppError('Name and organizationId are required', 400, 'VALIDATION_ERROR'));
    }
    if (typeof name !== 'string' || name.length < 2 || name.length > 100) {
      return next(new AppError('Name must be between 2 and 100 characters', 400, 'VALIDATION_ERROR'));
    }
    if (description !== undefined && typeof description !== 'string') {
      return next(new AppError('Description must be a string', 400, 'VALIDATION_ERROR'));
    }

    const project = await createProjectService(userId, {
      name,
      description,
      organizationId,
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};


// getting all projects of an organization
export const listProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const organizationId = req.query.organizationId as string | undefined;

    if (!organizationId) {
      return next(new AppError('organizationId query param is required', 400, 'VALIDATION_ERROR'));
    }

    const projects = await listProjectsService(userId, organizationId);

    return res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};


// getting a project
export const getProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const projectId = req.params.id as string;

    const project = await getProjectService(userId, projectId);

    return res.status(200).json({
      success: true,
      message: 'Project fetched successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};


// updating a project
export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const projectId = req.params.id as string;
    const { name, description } = req.body;

    if (name === undefined && description === undefined) {
      return next(new AppError('Provide name and/or description to update', 400, 'VALIDATION_ERROR'));
    }
    if (name !== undefined && (typeof name !== 'string' || name.length < 2 || name.length > 100)) {
      return next(new AppError('Name must be between 2 and 100 characters', 400, 'VALIDATION_ERROR'));
    }
    if (description !== undefined && description !== null && typeof description !== 'string') {
      return next(new AppError('Description must be a string or null', 400, 'VALIDATION_ERROR'));
    }

    const project = await updateProjectService(userId, projectId, {
      name,
      description,
    });

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};


// deleting a project
export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const projectId = req.params.id as string;

    await deleteProjectService(userId, projectId);

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
