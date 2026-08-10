import prisma from '../../config/db';
import { refreshToken, hashRefreshToken } from '../../utils/token.utils';


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


// finding user by id
export const findUserById = async (userId : string) => {
    return await prisma.user.findUnique({
        where: { id: userId },
    });
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


// deleting refresh token
export const deleteRefreshToken = async (token : string) => {
    return await prisma.refreshToken.delete({
        where: {
            token: hashRefreshToken(token),
        }
    })
}