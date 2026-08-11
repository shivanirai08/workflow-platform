import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { createProject, listProjects, getProject, updateProject, deleteProject } from './project.controller';

const router = Router();

/** create a project
 * @openapi
 * /api/projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create a project
 *     description: Create a project in an organization (ORG_ADMIN or PROJECT_MANAGER)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - organizationId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               organizationId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       403:
 *         description: Forbidden
 *       401:
 *         description: Unauthorized
 */

router.post('/', authenticate, createProject);


/** list all projects of an organization
 * @openapi
 * /api/projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: List projects by organization
 *     description: List all projects for an organization (any org member)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *       400:
 *         description: organizationId missing
 *       403:
 *         description: Forbidden
 */

router.get('/', authenticate, listProjects);


/** get a project by id
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get project by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *       404:
 *         description: Project not found
 *       403:
 *         description: Forbidden
 */

router.get('/:id', authenticate, getProject);


/** update a project
 * @openapi
 * /api/projects/{id}:
 *   patch:
 *     tags:
 *       - Projects
 *     summary: Update a project
 *     description: Update project name/description (ORG_ADMIN or PROJECT_MANAGER)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
 */

router.patch('/:id', authenticate, updateProject);


/** delete a project
 * @openapi
 * /api/projects/{id}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete a project
 *     description: Delete a project (ORG_ADMIN or PROJECT_MANAGER)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
 */

router.delete('/:id', authenticate, deleteProject);


export default router;
