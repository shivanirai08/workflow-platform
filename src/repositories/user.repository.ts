import prisma from '../config/db';
import type { User } from '../prisma/client';

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
