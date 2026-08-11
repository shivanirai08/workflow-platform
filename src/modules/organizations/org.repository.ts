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