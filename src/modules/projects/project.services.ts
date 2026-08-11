import { AppError } from '../../utils/AppError';
import { assertOrgManager, assertOrgMember } from '../../utils/orgAccess';
import { createProject, findProjectById, findProjectsByOrgId, updateProject, deleteProject } from './project.repository';


// creating a project
export const createProjectService = async (
  userId: string,
  data: { name: string; description?: string; organizationId: string }
) => {
  await assertOrgManager(userId, data.organizationId);

  return createProject({
    name: data.name,
    description: data.description ?? null,
    organizationId: data.organizationId,
    createdById: userId,
  });
};


// listing all projects of an organization
export const listProjectsService = async (userId: string, organizationId: string) => {
  await assertOrgMember(userId, organizationId);
  return findProjectsByOrgId(organizationId);
};


// getting a project by id
export const getProjectService = async (userId: string, projectId: string) => {
  const project = await findProjectById(projectId);
  if (!project) {
    throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
  }

  await assertOrgMember(userId, project.organizationId);
  return project;
};


// updating a project
export const updateProjectService = async (
  userId: string,
  projectId: string,
  data: { name?: string; description?: string | null }
) => {
  const project = await findProjectById(projectId);
  if (!project) {
    throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
  }

  await assertOrgManager(userId, project.organizationId);

  const updateData: { name?: string; description?: string | null } = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;

  return updateProject(projectId, updateData);
};


// deleting a project
export const deleteProjectService = async (userId: string, projectId: string) => {
  const project = await findProjectById(projectId);
  if (!project) {
    throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
  }

  await assertOrgManager(userId, project.organizationId);
  await deleteProject(projectId);
};
