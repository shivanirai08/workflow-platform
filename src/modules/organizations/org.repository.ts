import prisma from '../../config/db';


// creating organization in db
export const createOrganization = async (organization: {
    name: string;
    slug: string;
    createdById: string;
}) => {
   return prisma.$transaction(async (txt) => {
    const org= await txt.organization.create({
        data: {
            name: organization.name,
            slug: organization.slug,
            createdById: organization.createdById,
        }
    });
    await txt.membership.create({
        data: {
            userId: organization.createdById,
            organizationId: org.id,
            role: 'ORG_ADMIN',
        }
    });
    return org;
  });
};


// finding organization by slug
export const findOrganizationBySlug = async (slug: string) => {
    return await prisma.organization.findUnique({
        where: {
            slug: slug,
        },
    });
};


// finding organization by id
export const findOrganizationById = async (id: string) => {
    return await prisma.organization.findUnique({
        where: {
            id: id,
        },
    });
};


// finding membership by organization id and user id
export const findMembership = async (orgId: string, userId: string) => {
    return await prisma.membership.findFirst({
        where: {
            organizationId: orgId,
            userId: userId,
        },
    });
};


// finding all organizations of a user
export const findMembershipWithOrgs = async (userId: string) => {
    return await prisma.membership.findMany({
        where: {
            userId: userId,
        },
        include: {
            organization: true,
        }
    });
};


// updating organization
export const updateOrganization = async (orgId: string, organization: {
    name?: string;
    slug?: string;
}) => {
    
    return await prisma.organization.update({ 
        where: { id: orgId }, 
        data: organization, 
    });
};


// deleting organization
export const deleteOrganization = async (orgId: string) => {
    return await prisma.organization.delete({
        where: { id: orgId },
    });
};


// adding member to organization
export const addMember = async (orgId: string, userId: string, role: 'PROJECT_MANAGER' | 'EMPLOYEE') => {
    return await prisma.membership.create({
        data: {
            userId: userId,
            organizationId: orgId,
            role: role,
        },
        include: {
            user: true,
        },
    });
};

// finding user already in organization
export const findUserInOrganization = async (orgId: string, userId: string) => {
    return await prisma.membership.findFirst({
        where: {
            organizationId: orgId,
            userId: userId,
        },
    });
};


// finding all members of an organization
export const findMembersOfOrganization = async (orgId: string) => {
    return await prisma.membership.findMany({
        where: {
            organizationId: orgId,
        },
        include: {
            user: true,
        },
    });
};


// removing member from organization
export const removeMember = async (memberId: string) => {
    return await prisma.membership.delete({
        where: {
            id: memberId,
        },
    });
};


// updating member role
export const updateMemberRole = async (memberId: string, role: 'PROJECT_MANAGER' | 'EMPLOYEE') => {
    return await prisma.membership.update({
        where: {
            id: memberId,
        },
        data: { role: role },
        include: {
            user: true,
        },
    });
};