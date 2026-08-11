import { findMembership, findOrganizationById } from "../modules/organizations/org.repository";
import { AppError } from "./AppError";


export const assertOrgAdmin = async (userId: string, orgId: string) => {
    const org = await findOrganizationById(orgId);
    if (!org) throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
    const membership = await findMembership(orgId, userId);
    if (!membership || membership.role !== 'ORG_ADMIN') {
      throw new AppError('Forbidden', 403, 'FORBIDDEN_ACCESS');
    }
    return { org, membership };
}

export const assertOrgMember = async (userId: string, orgId: string) => {const org = await findOrganizationById(orgId);
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
}

export const assertOrgManager = async (userId: string, orgId: string) => {
    const org = await findOrganizationById(orgId);
    if (!org) {
        throw new AppError('Organization not found', 404, "ORG_NOT_FOUND");
    }
    const membership = await findMembership(orgId, userId);
    if (!membership || membership.role !== 'PROJECT_MANAGER' && membership.role !== 'ORG_ADMIN') {
        throw new AppError('Forbidden', 403, 'FORBIDDEN_ACCESS');
    }
    return { organization: org, membership: membership };
}