import { Router } from 'express';
import { register, login, logout, refresh, getMe } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';

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


/** logout a user
* @openapi
* /api/auth/logout:
*   post:
*     summary: Logout a user
*     description: Logout a user
*     responses:
*       200:
*         description: User logged out successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: The message of the response
*       400:
*         description: Invalid refresh token
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Invalid refresh token
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

router.post('/logout', logout);


/** refresh a user
* @openapi
* /api/auth/refresh:
*   post:
*     summary: Refresh a user
*     description: Refresh a user
*     responses:
*       200:
*         description: User refreshed successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: The message of the response
*                 accessToken:
*                   type: string
*                   description: The access token of the user
*       400:
*         description: Invalid refresh token
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Invalid refresh token
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

router.post('/refresh', refresh);


/** get a user
* @openapi
* /api/auth/me:
*   get:
*     summary: Get a user
*     description: Get a user
*     responses:
*       200:
*         description: User fetched successfully
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
*       401:
*         description: Unauthorized
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Unauthorized
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

router.get('/me', authenticate, getMe);



export default router;
