import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';
import { createOrganizationService, getOrganizationService, getAllOrganizationsService } from './org.services';




// create organization
export const createOrganization = async (req: Request & { user?: { id: string } }, res: Response, next: NextFunction) => {
    try{
        const { name, slug } = req.body;
        const userId = req.user!.id;
        if (!name || !slug) {
            return next(new AppError('Name and slug are required', 400, 'VALIDATION_ERROR'));
        }
        if (slug.length < 3 || slug.length > 20) {
            return next(new AppError('Slug must be between 3 and 20 characters', 400, 'VALIDATION_ERROR'));
        }
        if (name.length < 3 || name.length > 50) {
            return next(new AppError('Name must be between 3 and 50 characters', 400, 'VALIDATION_ERROR'));
        }
        const organization = await createOrganizationService({name, slug, createdById: userId});
        res.status(201).json({
            success: true,
            message: 'Organization created successfully',
            data: organization,
        });
    } catch (error) {
        next(error);
    }
}


// get organization
export const getOrganization = async (req: Request & { user?: { id:string }}, res: Response, next: NextFunction) => {
    try{
        const orgId = req.params.id as string;
        const userId = req.user!.id;
        const organization = await getOrganizationService(orgId, userId);
        res.status(200).json({
            success: true,
            message: 'Organization fetched successfully',
            data: organization,
        });
    } catch (error) {
        next(error);
    }
}


// get all organizations of a user
export const getAllOrganizations = async (req: Request & { user?: { id:string }}, res: Response, next: NextFunction) => {
    try{
        const userId = req.user!.id;
        const organizations = await getAllOrganizationsService(userId);
        res.status(200).json({
            success: true,
            message: 'All organizations fetched successfully',
            data: organizations,
        });
    } catch (error) {
        next(error);
    }
}

// update organization
export const updateOrganization = async (req: Request, res: Response, next: NextFunction) => {

}

// delete organization
export const deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {

}