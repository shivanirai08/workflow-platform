import { createUser, findUserByEmail } from './user.repository';
import bcrypt from 'bcryptjs';
import { createRefreshToken, findRefreshToken, deleteRefreshToken, findUserById } from './user.repository';
import { accessToken } from '../../utils/token.utils';
import { AppError } from '../../utils/AppError';

type User = {
  email: string;
  password: string;
  name?: string;
};


// register user
export const registerUser = async (user: User) => {
  const existingUser = await findUserByEmail(user.email);
  if (existingUser) {
    throw new AppError('User already exists', 409, 'USER_ALREADY_EXISTS');
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
};


// login user
export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const refreshToken = await createRefreshToken(user.id);
  const access = accessToken(user.id);

  const { password: _, ...safeUser } = user;
  return { ...safeUser, access, refreshToken };
};


// logout user
export const logoutUser = async (refreshToken: string) => {
  const row = await findRefreshToken(refreshToken);

  if (!row) {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  await deleteRefreshToken(refreshToken);

  return { message: 'Logged out successfully' };
};


// refresh user
export const refreshUser = async (refreshToken: string) => {
  const row = await findRefreshToken(refreshToken);

  if (!row) {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  if (row.expiresAt < new Date()) {
    throw new AppError('Refresh token expired', 401, 'REFRESH_TOKEN_EXPIRED');
  }

  if (row.revokedAt) {
    throw new AppError('Refresh token revoked', 401, 'REFRESH_TOKEN_REVOKED');
  }

  return accessToken(row.userId);
};


// get user
export const getUser = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const { password, ...safeUser } = user;
  return safeUser;
};
