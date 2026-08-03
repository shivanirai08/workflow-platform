import { createUser, findUserByEmail} from '../repositories/user.repository';
import bcrypt from 'bcryptjs';

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

    const { password, ...safeUser } = newUser;
    return safeUser;
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

    const { password : _, ...safeUser } = user;   // _ is a placeholder to avoid clash and just ignore
    return safeUser;
}