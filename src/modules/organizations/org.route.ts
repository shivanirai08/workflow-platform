import { Router } from 'express' ;
import { createOrganization, getOrganization, updateOrganization, deleteOrganization, getAllOrganizations, addMemberToOrganization, getMembersOfOrganization, removeMemberFromOrganization, updateMemberRole } from './org.controller';
import { authenticate } from '../../middleware/auth.middleware';


const router = Router();

/** create organization
 * @openapi
 * /api/organizations:
 *   post:
 *     tags:
 *       - Organizations
 *     summary: Create organization
 *     description: Create organization
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the organization
 *               slug:
 *                 type: string
 *                 description: The slug of the organization
 *                 pattern: ^[a-z0-9]+(?:-[a-z0-9]+)*$
 *                 minLength: 3
 *                 maxLength: 20
 *             required:
 *               - name
 *               - slug
 *     responses:
 *       200:
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 */

router.post('/', authenticate, createOrganization);


/** get organization by id
 * @openapi
 * /api/organizations/{id}:
 *   get:
 *     tags:
 *       - Organizations
 *     summary: Get organization by id
 *     description: Get organization by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the organization
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object  
 *                   description: Organization data
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 */

router.get('/:id', authenticate, getOrganization);


/** get all organizations of a user
 * @openapi
 * /api/organizations:
 *   get:
 *     tags:
 *       - Organizations
 *     summary: Get all organizations
 *     description: Get all organizations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All organizations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   description: All organizations data
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   description: All organizations data
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   description: All organizations data
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   description: All organizations data
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   description: All organizations data
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   description: All organizations data
 */

router.get('/', authenticate, getAllOrganizations);


/** update organization
 * @openapi
 * /api/organizations/{id}:
 *   patch:
 *     tags:
 *       - Organizations
 *     summary: Update organization
 *     description: Update organization
 *     security:
 *       - bearerAuth: []   
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the organization
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
 *                 description: The name of the organization
 *               slug:
 *                 type: string
 *                 description: The slug of the organization
 *                 pattern: ^[a-z0-9]+(?:-[a-z0-9]+)*$
 *                 minLength: 3
 *                 maxLength: 20
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 */ 

router.patch('/:id', authenticate, updateOrganization);


/** delete organization
 * @openapi
 * /api/organizations/{id}:
 *   delete:
 *     tags:
 *       - Organizations
 *     summary: Delete organization
 *     description: Delete organization
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the organization
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object   
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 *       500:
 *         description: Internal server error
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Organization data
 */

router.delete('/:id', authenticate, deleteOrganization);


/** add member to organization
 * @openapi
 * /api/organizations/{id}/members:
 *   post:
 *     tags:
 *       - Organizations
 *     summary: Add member to organization
 *     description: Add member to organization
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the organization
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
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               role:
 *                 type: string
 *                 description: The role of the user
 *                 enum:
 *                   - PROJECT_MANAGER
 *                   - EMPLOYEE
 *                 required: true
 *     responses:
 *       200:
 *         description: Member added to organization successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Member data
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Member data
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Member data
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Member data
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Member data
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: object
 *                   description: Member data
 */

router.post('/:id/members', authenticate, addMemberToOrganization);


/** get all members of an organization
 * @openapi
 * /api/organizations/{id}/members:
 *   get:
 *     tags:
 *       - Organizations
 *     summary: Get all members of an organization
 *     description: Get all members of an organization
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the organization
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Members fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   description: Members data
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   description: Members data
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   description: Members data
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   description: Members data
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   description: Members data
 */

router.get('/:id/members', authenticate, getMembersOfOrganization);



router.patch('/:id/members/:memberUserId', authenticate, updateMemberRole);

router.delete('/:id/members/:memberUserId', authenticate, removeMemberFromOrganization);

export default router;