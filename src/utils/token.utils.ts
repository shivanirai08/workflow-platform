import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config';



const accessToken = (userId : string) => {
    return jwt.sign({userId}, process.env.JWT_SECRET as string, { expiresIn: '15m' });
}

const refreshToken = (userId : string) => {
    return crypto.randomBytes(64).toString('hex');
}

const hashRefreshToken = (token : string) => {
    return crypto.createHash('sha256').update(token).digest('hex');
}

const verifyAccessToken = (token : string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
}

export { accessToken, refreshToken, verifyAccessToken, hashRefreshToken};