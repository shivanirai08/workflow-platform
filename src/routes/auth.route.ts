import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

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
*                   description: Either wrong input or already registered user
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: The message of the response
*
* 
*/

router.post('/register', register);

/** login a user
* @openapi
* /api/auth/login:
*   post:
*     summary: Login a user
*     description: Login a user with email and password
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
*       200:
*         description: User logged in successfully
*         content:

*       400:
*         description: Invalid email or password
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Either invalid email/password or user not registered
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Internal server error
* */

router.post('/login', login);

export default router;
