import type { Request, Response } from 'express';
import { registerUser, loginUser, logoutUser, refreshUser, getUser } from './auth.services';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        
        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required",
            })
        }

        if(!emailRegex.test(email)){
            return res.status(400).json({
                message: "Invalid email address",
            })
        }
        
        if(typeof password !== 'string' || password.length < 6 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)){
            return res.status(400).json({
                message: "Password must have at least 6 characters, 1 letter, 1 number and 1 special character.",
            })
        }
        const user = await registerUser({email, password, name});
        
        const { access, refreshToken, ...safeUser } = user;

        res.cookie('refresh', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(201).json({
            message: "User registered Successfully",
            user: safeUser,
            accessToken: access,
        });
    }
    catch (error) {
        if(error instanceof Error){
            return res.status(400).json({
                message: error.message,
            })
        }
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}


export const login = async (req : Request, res : Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required",
            })
        }

        if(!emailRegex.test(email)){
            return res.status(400).json({
                message: "Invalid email address",
            })
        }

        const user = await loginUser(email, password);

        const { access, refreshToken, ...safeUser } = user;

        res.cookie('refresh', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

        return res.status(200).json({
            message: "User logged in Successfully",
            user: safeUser,
            accessToken: access,
        });
    }
    catch (error) {
        if(error instanceof Error){
            return res.status(400).json({
                message: error.message,
            })
        }
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}


export const logout = async (req: Request, res: Response) => {
    try {
        const refresh = req.cookies.refresh;

        if(!refresh){
            return res.status(401).json({
                message: "Refresh token is required",
            })
        }

        const message = await logoutUser(refresh);

        res.clearCookie('refresh', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict',});   

        return res.status(200).json(message);
    }
    catch (error) {

        if(error instanceof Error){
            return res.status(400).json({
                message: error.message,
            })
        }
        return res.status(500).json({
            message: "Internal Server Error",
        })

    }
}


export const refresh = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refresh;

    if(!refreshToken){
        return res.status(401).json({
            message: "Refresh token is required",
        })
    }

    const access = await refreshUser(refreshToken);
    
    return res.status(200).json({
        message: "User refreshed successfully",
        accessToken: access,
    });
    }
    catch (error) {
        if(error instanceof Error){
            return res.status(400).json({
                message: error.message,
            })
        }
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}


export const getMe = async (req: Request & { user?: { id: string } }, res: Response) => {
    try {
        const userId = req.user?.id;

        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
            })
        }

        const user = await getUser(userId);

        if(!user){
            return res.status(404).json({
                message: "User not found",
            })
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user: user,
        });
    }
    catch (error) {
        if(error instanceof Error){
            return res.status(400).json({
                message: error.message,
            })
        }
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}