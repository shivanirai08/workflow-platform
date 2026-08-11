import prisma from '../../config/db';


export const createProject = async (data: {
  name: string;
  description?: string | null;
  organizationId: string;
  createdById: string;
}) => {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      organizationId: data.organizationId,
      createdById: data.createdById,
    },
  });
};


export const findProjectById = async (id: string) => {
  return prisma.project.findUnique({
    where: { id },
  });
};


export const findProjectsByOrgId = async (organizationId: string) => {
  return prisma.project.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
  });
};


export const updateProject = async (
  id: string,
  data: { name?: string; description?: string | null }
) => {
  return prisma.project.update({
    where: { id },
    data,
  });
};


export const deleteProject = async (id: string) => {
  return prisma.project.delete({
    where: { id },
  });
};
