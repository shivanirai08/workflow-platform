import { createOrganization, findOrganizationBySlug, findOrganizationById, findMembership, findMembershipWithOrgs, updateOrganization, deleteOrganization } from './org.repository';
import { AppError } from '../../utils/AppError';


// creating organization
export const createOrganizationService = async (organization: {
    name: string;
    slug: string;
    createdById: string ;
}) => {
    const existingOrg = await findOrganizationBySlug(organization.slug);
    if (existingOrg) {
        throw new AppError('Organization with this slug already exists', 409, "SLUG_ALREADY_EXISTS");
    }
    const newOrg = await createOrganization(organization);
    return newOrg;
};


// getting organization data
export const getOrganizationService = async (orgId : string, userId : string) => {
    const org = await findOrganizationById(orgId);
    if (!org) {
        throw new AppError('Organization not found', 404, "ORG_NOT_FOUND");
    }
    const membership = await findMembership(orgId, userId);
    if (!membership) {
        throw new AppError('You are not a member of this organization', 403, "FORBIDDEN_ACCESS");
    }
    return {
        organization: org,
        membership: membership,
    };
};


// user's all organizations
export const getAllOrganizationsService = async (userId : string) => {
    const memberships = await findMembershipWithOrgs(userId);
    return memberships.map((m) => ({...m.organization, role: m.role}) )
};


// updating organization
export const updateOrganizationService = async (userId: string, orgId: string, organization: {
    name: string | undefined;
    slug: string | undefined;
}) => {
    const org = await findOrganizationById(orgId);
    if (!org) {
        throw new AppError('Organization not found', 404, "ORG_NOT_FOUND");
    }
    const membership = await findMembership(orgId, userId);
    if (!membership || membership.role !== 'ORG_ADMIN') {
        throw new AppError('You are not authorized to update this organization', 403, "FORBIDDEN_ACCESS");
    }

    let data: { name?: string; slug?: string } = {};
    if(organization.name !== undefined) data.name = organization.name;
    if(organization.slug !== undefined) {
        const existingOrg = await findOrganizationBySlug(organization.slug);
        if(existingOrg && existingOrg.id !== orgId) {
            throw new AppError('Slug already exists', 400, 'SLUG_ALREADY_EXISTS');
        }
        data.slug = organization.slug;
    }

    const updatedOrg = await updateOrganization(orgId, data);
    return updatedOrg;
};


// deleting organization
export const deleteOrganizationService = async (userId: string, orgId: string) => {
    const org = await findOrganizationById(orgId);
    if (!org) {
        throw new AppError('Organization not found', 404, "ORG_NOT_FOUND");
    }
    const membership = await findMembership(orgId, userId);
    if (!membership || membership.role !== 'ORG_ADMIN') {
        throw new AppError('You are not authorized to delete this organization', 403, "FORBIDDEN_ACCESS");
    }
    const deletedOrg = await deleteOrganization(orgId);
    return deletedOrg;
};