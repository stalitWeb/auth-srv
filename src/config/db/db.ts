import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const URI = process.env.AUTH_MONGOOSE_URI! /*|| 'mongodb://auth-mongodb-clusterip-srv:27013'*/;

async function DBconnection() {
    try {
        await mongoose.connect(URI);
        console.log('DB connected successfully!');
    } catch (err) {
        console.error(err);
    }
}

export { DBconnection };
