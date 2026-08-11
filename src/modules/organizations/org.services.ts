import { createOrganization, findOrganizationBySlug, findMembershipWithOrgs, updateOrganization, deleteOrganization, addMember, findUserInOrganization, findMembersOfOrganization, updateMemberRole, removeMember } from './org.repository';
import { AppError } from '../../utils/AppError';
import { assertOrgAdmin, assertOrgMember } from '../../utils/orgAccess';
import { findUserByEmail } from '../auth/user.repository';

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


// adding member to organization
export const addMemberService = async (userId: string, orgId: string, email: string, role: 'PROJECT_MANAGER' | 'EMPLOYEE') => {
    await assertOrgAdmin(userId, orgId);
    const user = await findUserByEmail(email);
    if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    const userInOrg = await findUserInOrganization(orgId, user.id);
    if (userInOrg) {
        throw new AppError('User already in organization', 409, 'USER_ALREADY_IN_ORG');
    }
    const member = await addMember(orgId, user.id, role);
    return {id: member.userId, email: member.user.email, role: member.role};
};


// getting all members of an organization
export const getMembersOfOrganizationService = async (userId: string, orgId: string) => {
    await assertOrgMember(userId, orgId);
    const members = await findMembersOfOrganization(orgId);
    return members.map((m) => ({id: m.userId, email: m.user.email, role: m.role}) );
};


// removing member from organization
export const removeMemberFromOrganizationService = async (userId: string, orgId: string, memberUserId: string) => {
    await assertOrgAdmin(userId, orgId);
    const memberUser = await assertOrgMember(memberUserId, orgId);
    const member = await removeMember(memberUser.membership.id);
    return member;
};


// updating member role
export const updateMemberRoleService = async (userId: string, orgId: string, memberUserId: string, role: 'PROJECT_MANAGER' | 'EMPLOYEE') => {
    await assertOrgAdmin(userId, orgId);
    const memberUser = await assertOrgMember(memberUserId, orgId);
    const member = await updateMemberRole(memberUser.membership.id, role);
    return {id: member.userId, email: member.user.email, role: member.role};
};