import type { Request, Response } from 'express';
import { registerUser, loginUser } from './auth.services';

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
        
        return res.status(201).json({
            message: "User registered Successfully",
            user,
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

        return res.status(200).json({
            message: "User logged in Successfully",
            user,
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
