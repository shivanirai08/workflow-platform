import { createUser, findUserByEmail} from './user.repository';
import bcrypt from 'bcryptjs';
import { createRefreshToken, findRefreshToken, deleteRefreshToken } from './user.repository';
import { accessToken } from '../../utils/token.utils';

type User = {
    email: string;
    password: string;
    name?: string;
}

//registering a user
export const registerUser = async (user: User) => {
    const existingUser = await(findUserByEmail(user.email));
    if (existingUser){
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await createUser({
        email: user.email,
        password: hashedPassword,
        name: user.name || null,
    });

    const refreshToken = await createRefreshToken(newUser.id);
    const access = accessToken(newUser.id);

    const { password, ...safeUser } = newUser;
    return { ...safeUser, access, refreshToken };
}


// login a user
export const loginUser = async (email: string, password: string) => {

    const user = await findUserByEmail(email);

    if(!user){
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Invalid email or password');
    }

    const refreshToken = await createRefreshToken(user.id);
    const access = accessToken(user.id);

    const { password : _, ...safeUser } = user;   // _ is a placeholder to avoid clash and just ignore
    return { ...safeUser, access, refreshToken };
}


// logout a user
export const logoutUser = async (refreshToken : string) => {

    const row = await findRefreshToken(refreshToken);

    if(!row){
        throw new Error('Invalid refresh token');
    }

    await deleteRefreshToken(refreshToken);

    return { message: 'Logged out successfully' };
}


// refresh a user
export const refreshUser = async (refreshToken : string) => {

    const row = await findRefreshToken(refreshToken);

    if(!row){
        throw new Error('Invalid refresh token');
    }

    if(row.expiresAt < new Date()){
        throw new Error('Refresh token expired');
    }

    if(row.revokedAt) {
        throw new Error('Refresh token revoked');
    }
    
    const access = accessToken(row.userId);

    return access;
}