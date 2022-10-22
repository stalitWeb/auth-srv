import express from 'express';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';

import { DBconnection } from './config/db/db';
import { errorHandler } from './middlewares/error-handler';


import router from './routes/auth-route';

const app = express();
// const PORT = Number(process.env.PORT) || 3000;

app.set('trust proxy', true); //it informs express of the traffic that would be coming from proxy, ingress-nginx to be trusted.
app.use(express.json());
app.use(
    cookieSession({
        signed: false, //disables encryption
        secure: true, //can only be used from request coming from https
    })
);
// app.use(dotenv.config())

app.use('/api/users', router);
app.all('*', function (req, res, next) {
    res.status(404).json({ errors: [{ message: 'Route not found' }] });
});
app.use(errorHandler);

/**function that handles the execution of the server */
function start() {
    if (!process.env.AUTH_MONGOOSE_URI) {
        throw new Error('error: auth-mongoose env variable missing.');
    }

    if (!process.env.PORT) {
        throw new Error('error: auth-port env variable missing.');
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('error: auth-jwt-secret env variable missing.');
    }

    DBconnection();

    app.listen(process.env.PORT || 3000, function () {
        console.log(`
            Auth Service is listening on port:${process.env.PORT}
            Auth Service is up and running!
        `);
    });
}

start();
