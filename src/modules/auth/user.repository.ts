import prisma from '../../config/db';
import type { User } from '../../prisma/client';
import { refreshToken, hashRefreshToken } from '../../utils/token.utils';
import crypto from 'crypto';

//creating user in db
export const createUser = async (user: {
        email: string,
        password: string,
        name?: string | null;
    }) => {
        return await prisma.user.create({ data: user })
}

// searching user by email
export const findUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    })
    return user;
}

// creating refresh token
export const createRefreshToken = async (userId : string) => {
    const token = refreshToken(userId);
    const hash = hashRefreshToken(token);
    await prisma.refreshToken.create({
        data: {
            token: hash,
            userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    return token;
}


// finding refresh token
export const findRefreshToken = async (token : string) => {
    return await prisma.refreshToken.findUnique({
        where: {
            token: hashRefreshToken(token),
        },
    });
}