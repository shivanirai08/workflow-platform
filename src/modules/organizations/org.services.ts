import { createOrganization, findOrganizationBySlug, findOrganizationById, findMembership } from './org.repository';
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


// updating organization