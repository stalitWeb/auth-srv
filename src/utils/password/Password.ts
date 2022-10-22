import bcryprjs from 'bcryptjs';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// interface PasswordSchema {
//     hash(password: string): string;
//     compare(suppliedPassword: string, storedPassword: string): string;
// }

const scryptAsync = promisify(scrypt);

class Password  {
    
    static async hash(password: string) {
        
        const salt = randomBytes(8).toString('hex');
        const buff = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buff.toString('hex')}.${salt}`;
    }

    static async compare(
        suppliedPassword: string,
        storedPassword: string
    ) {
        // const isValidPassword= await bcryprjs.compare(password , hashedPassword)

        // return isValidPassword

        // if (!isValidPassword) {
        //     throw new BadRequestError('Email or Password is incorrect!')
        // }

        const [hashedPassword, salt] = storedPassword.split('.');
        const buff = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
        return buff.toString('hex') === hashedPassword;
    }
}

export { Password };
