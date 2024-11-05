import crypto from 'crypto';

export const hashPassword = (password: string): string => {
    const hash = crypto.createHash('sha256'); 
    hash.update(password);
    
    return hash.digest('hex');
};

export const comparePassword = (password: string, hash: string): boolean => {
    const hashedPassword = hashPassword(password);
    
    return hashedPassword === hash;
};
