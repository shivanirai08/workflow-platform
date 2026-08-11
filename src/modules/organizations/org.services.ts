import { createOrganization, findOrganizationBySlug, findMembershipWithOrgs, updateOrganization, deleteOrganization } from './org.repository';
import { AppError } from '../../utils/AppError';
import { assertOrgAdmin, assertOrgMember } from '../../utils/orgAccess';


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
    return await assertOrgMember(userId, orgId);
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
    await assertOrgAdmin(userId, orgId);

    let data: { name?: string; slug?: string } = {};
    if(organization.name !== undefined) data.name = organization.name;
    if(organization.slug !== undefined) {
        const existingOrg = await findOrganizationBySlug(organization.slug);
        if(existingOrg && existingOrg.id !== orgId) {
            throw new AppError('Slug already exists', 409, 'SLUG_ALREADY_EXISTS');
        }
        data.slug = organization.slug;
    }

    const updatedOrg = await updateOrganization(orgId, data);
    return updatedOrg;
};


// deleting organization
export const deleteOrganizationService = async (userId: string, orgId: string) => {
    await assertOrgAdmin(userId, orgId);
    const deletedOrg = await deleteOrganization(orgId);
    return deletedOrg;
};