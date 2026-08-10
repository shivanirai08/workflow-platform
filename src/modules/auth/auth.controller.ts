import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, logoutUser, refreshUser, getUser } from './auth.services';
import { AppError } from '../../utils/AppError';


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};


// register user
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        
        if(!email || !password){
            throw new AppError("Email and password are required", 400, "INVALID_REQUEST");
        }

        if(!emailRegex.test(email)){
            throw new AppError("Invalid email address", 400, "INVALID_EMAIL");
        }
        
        if(typeof password !== 'string' || password.length < 6 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)){
            throw new AppError("Password must have at least 6 characters, 1 letter, 1 number and 1 special character.", 400, "INVALID_PASSWORD");
        }
        const user = await registerUser({email, password, name});
        
        const { access, refreshToken, ...safeUser } = user;

    res.cookie('refresh', refreshToken, refreshCookieOptions);

    return res.status(201).json({
      success: true,
      message: 'User registered Successfully',
      data: {
        user: safeUser,
        accessToken: access,
      },
    });
  } catch (error) {
    next(error);
  }
};


// login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'VALIDATION_ERROR');
    }

    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email address', 400, 'INVALID_EMAIL');
    }

    const user = await loginUser(email, password);
    const { access, refreshToken, ...safeUser } = user;

    res.cookie('refresh', refreshToken, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      message: 'User logged in Successfully',
      data: {
        user: safeUser,
        accessToken: access,
      },
    });
  } catch (error) {
    next(error);
  }
};


// logout user
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh = req.cookies.refresh;

    if (!refresh) {
      throw new AppError('Refresh token is required', 401, 'REFRESH_TOKEN_REQUIRED');
    }

    const result = await logoutUser(refresh);

    res.clearCookie('refresh', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};


// refresh user
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401, 'REFRESH_TOKEN_REQUIRED');
    }

    const access = await refreshUser(refreshToken);

    return res.status(200).json({
      success: true,
      message: 'User refreshed successfully',
      data: {
        accessToken: access,
      },
    });
  } catch (error) {
    next(error);
  }
};


// get user
export const getMe = async (
  req: Request & { user?: { id: string } },
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const user = await getUser(userId);

    return res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
