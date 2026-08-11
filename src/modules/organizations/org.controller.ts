import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';
import { createOrganizationService, getOrganizationService, getAllOrganizationsService, updateOrganizationService, deleteOrganizationService, addMemberService, getMembersOfOrganizationService, removeMemberFromOrganizationService, updateMemberRoleService } from './org.services';


const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// create organization
export const createOrganization = async (req: Request & { user?: { id: string } }, res: Response, next: NextFunction) => {
    try{
        const { name, slug } = req.body;
        const userId = req.user!.id;
        if (!name || !slug) {
            return next(new AppError('Name and slug are required', 400, 'VALIDATION_ERROR'));
        }
        if (slug !== undefined && !SLUG_REGEX.test(slug)) {
            return next(new AppError('Slug must be lowercase letters, numbers, and hyphens only', 400, 'INVALID_SLUG'));
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
        if (!orgId) {
            return next(new AppError('Organization id is required', 400, 'VALIDATION_ERROR'));
        }
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
export const updateOrganization = async (req: Request & { user?: { id:string }}, res: Response, next: NextFunction) => {
    try{
        const orgId = req.params.id as string;
        const userId = req.user!.id;
        const { name, slug } = req.body;
        
        if (!orgId) {
            return next(new AppError('Organization id is required', 400, 'VALIDATION_ERROR'));
        }

        if (name === undefined && slug === undefined) {
            return next(new AppError('Provide data to update', 400, 'VALIDATION_ERROR'));
        }
        if (slug !== undefined && !SLUG_REGEX.test(slug)) {
            return next(new AppError('Slug must be lowercase letters, numbers, and hyphens only', 400, 'INVALID_SLUG'));
        }
        if (slug !== undefined && (slug.length < 3 || slug.length > 20)) {
            return next(new AppError('Slug must be between 3 and 20 characters', 400, 'VALIDATION_ERROR'));
        }
        if (name !== undefined && (name.length < 3 || name.length > 50)) {
            return next(new AppError('Name must be between 3 and 50 characters', 400, 'VALIDATION_ERROR'));
        }
        
        const organization = await updateOrganizationService(userId, orgId, { name: name || undefined, slug: slug || undefined });
        res.status(200).json({
            success: true,
            message: 'Organization updated successfully',
            data: organization,
        });
    } catch (error) {
        next(error);
    }
}

// delete organization
export const deleteOrganization = async (req: Request & { user?: { id:string }}, res: Response, next: NextFunction) => {
    try{
        const orgId = req.params.id as string;
        const userId = req.user!.id;
        const organization = await deleteOrganizationService(userId, orgId);
        res.status(200).json({
            success: true,
            message: 'Organization deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}


// add member to organization
export const addMemberToOrganization = async (req: Request & { user?: { id:string }}, res: Response, next: NextFunction) => {
    try{
        const orgId = req.params.id as string;
        const userId = req.user!.id;
        const { email, role } = req.body;
        if (!email || !role) {
            return next(new AppError('Email and role are required', 400, 'VALIDATION_ERROR'));
        }

        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
            return next(new AppError('Invalid email', 400, 'VALIDATION_ERROR'));
        }
        if (role !== 'PROJECT_MANAGER' && role !== 'EMPLOYEE') {
            return next(new AppError('Invalid role', 400, 'VALIDATION_ERROR'));
        }
        
        const organization = await addMemberService(userId, orgId, email, role);
        res.status(201).json({
            success: true,
            message: 'Member added to organization successfully',
            data: organization,
        });
    } catch (error) {
        next(error);
    }
}


// get all members of an organization
export const getMembersOfOrganization = async (req: Request & { user?: { id:string }}, res: Response, next: NextFunction) => {
    try{
        const orgId = req.params.id as string;
        const userId = req.user!.id;
        const members = await getMembersOfOrganizationService(userId, orgId);
        res.status(200).json({
            success: true,
            message: 'Members fetched successfully',
            data: members,
        });
    } catch (error) {
        next(error);
    }
}


// remove member from organization
export const removeMemberFromOrganization = async (req: Request & { user?: { id:string }}, res: Response, next: NextFunction) => {
    try{
        const orgId = req.params.id as string;
        const userId = req.user!.id;
        const memberUserId = req.params.memberUserId as string;
        await removeMemberFromOrganizationService(userId, orgId, memberUserId);
        res.status(200).json({
            success: true,
            message: 'Member removed from organization successfully',
        });
    } catch (error) {
        next(error);
    }
}


// update member role
export const updateMemberRole = async (req: Request & { user?: { id:string }}, res: Response, next: NextFunction) => {
    try{
        const orgId = req.params.id as string;
        const userId = req.user!.id;
        const memberUserId = req.params.memberUserId as string;
        const { role } = req.body;
        if (!role) {
            return next(new AppError('Role is required', 400, 'VALIDATION_ERROR'));
        }
        if (role !== 'PROJECT_MANAGER' && role !== 'EMPLOYEE') {
            return next(new AppError('Invalid role', 400, 'VALIDATION_ERROR'));
        }
        const member = await updateMemberRoleService(userId, orgId, memberUserId, role);
        res.status(200).json({
            success: true,
            message: 'Member role updated successfully',
            data: member,
        });
    } catch (error) {
        next(error);
    }
}