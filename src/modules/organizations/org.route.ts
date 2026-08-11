import { Router } from 'express' ;
import { createOrganization, getOrganization, updateOrganization, deleteOrganization, getAllOrganizations } from './org.controller';
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
 *               description:
 *                 type: string
 *                 description: The description of the organization
 *             required:
 *               - name
 *               - description
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
 * /api/organizations/:id:
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



router.patch('/:id', authenticate, updateOrganization);
router.delete('/:id', authenticate, deleteOrganization);

export default router;