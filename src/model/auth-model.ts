import mongoose from 'mongoose';
import { Password } from '../utils/password/Password';

// try {

//An interface that describes the properties
//that are required to create a new user
interface UserAttrs {
    email: string;
    password: string;
}

//An interface that describe the properties
//that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(user: UserAttrs): UserDoc;
}

//Interface that describes the properties
//that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    updatedAt: string;
    createdAt: string;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            },
        },
        timestamps: true,
    }
);

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = Password.hash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = function (user: UserAttrs) {
    return new User(user);
};

const User = mongoose.model<UserDoc, UserModel>('user', userSchema);

export { User };

// }catch (err) {
//     console.error(err);
// }
