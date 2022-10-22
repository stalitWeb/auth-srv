import express, {Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../model/auth-model';
import { BadRequestError } from '../utils/errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { Password } from '../utils/password/Password';
import { isAuthenticated } from '../middlewares/isAuhtenticated';
import { NotAuthorizedError } from '../utils/errors/not-authorized-error';
// import { DBConnectionError } from '../utils/errors/db-error-handler'

interface UserPayload {
    id: string
}

const router = express.Router();

router
    .route('/signup')
    .post(
        [
            body('email').isEmail().withMessage('Not a valid type of email!'),
            body('email').notEmpty().withMessage('Email is required!'),
            body('password')
                .trim()
                .notEmpty()
                .withMessage('Password is required.'),
        ],
        validateRequest,
        async function (req , res, next) {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (user) {
                throw new BadRequestError('Email already exist!');
            }

            const newUser = User.build({ email, password });

            //thsesset of commented code have refactor with the Password class
            // const salt = await bcrypt.genSalt(10)
            // const hashPwd = await bcrypt.hash(a)

            const savedUser = await newUser.save();
            const payload = {
                _id: savedUser._id,
                // role: 0
            };
            jwt.sign(
                payload,
                /*process.env.JWT-SECRET ||*/ 'jwt-secret-key-phrase',
                function (error, token) {
                    req.session = { jwt: token };
                    res.status(201).json({
                        success: [
                            { message: 'Account registered successfully' },
                        ],
                    });
                }
            );
        }
    );

router
    .route('/signin')
    .get(
        [
            body('email').isEmail().withMessage('Email is required!'),
            body('password')
                .trim()
                .isLength({ min: 6, max: 20 })
                .withMessage('Password must be between 6 to 20 characters'),
        ],
        validateRequest,
        async function (req, res, next) {
            
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
               throw new NotAuthorizedError("Email or password doesn't exist")
            }

            const isPasswordValid = Password.compare(password, user.password);

            if (!isPasswordValid) {
                throw new NotAuthorizedError("Email or password doesn't exist")
            }

            const payload = {
                id: user._id,
            };

            jwt.sign(payload, process.env.JWT_SECRET!, function (err, token) {
                if (err) {
                    return console.log(err);
                }

                req.session = {
                    jwt: token,
                };
                return res.status(200).json({ token });
            });
        }
    );

router
    .route('/currentuser')
    .get(isAuthenticated, async function (req, res, next) {
        
        const { id } = req.user as UserPayload;
        const user = await User.findById(req.user.id);

        if (!user) {
            throw new BadRequestError('User information not found');
        }

        return res.status(200).json({ user });
    });

router.route('/signout').post(isAuthenticated, function (req ,res ,next) {
    req.session = null
    res.send({})
});

export default router;
