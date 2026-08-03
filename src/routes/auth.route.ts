import { Router } from 'express';
import { register } from '../controllers/auth.controller';

const router = Router();


/** register a new user
* @openapi
* /api/auth/register:
*   post:
*     summary: Register a new user
*     description: Register a new user with email and password
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
*               password:
*                 type: string
*                 description: The password of the user
*             required:
*               - email
*               - password
*     responses:
*       201:
*         description: User registered successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: The message of the response
*                 user:
*                   type: object
*                   description: The user data
*       400:
*         description: Bad request
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: The message of the response
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*
* 
*/

router.post('/register', register);

export default router;
