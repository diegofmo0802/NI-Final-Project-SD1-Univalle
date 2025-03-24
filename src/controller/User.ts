import { randomUUID } from 'crypto';

import db from '../config/DBManager.js';
import { user } from '../config/DBScheme.js';
import Auth from './Auth.js';

export class User implements User.data {
    public readonly _id: string;
    public _profile: User.profile;
    public _auth: User.auth;
    private constructor(data: User.data) {
        this._id = data._id;
        this._profile = data.profile;
        this._auth = data.auth;
    }
    public get profile(): User.profile { return this._profile; }
    public get auth(): User.auth { return this._auth; }
    public static async create(data: User.newUser): Promise<User> {
        const uuid = await db.collection('user').transaction(async (db, collection) => {
            let uuid = randomUUID();
            while ((await collection.find({ _id: uuid })).length > 0) {
                uuid = randomUUID();
            }
            const passwordSalt = Auth.authSalt();
            const passwordHash = Auth.encryptPassword(data.password, passwordSalt);
            const insertInfo = await collection.insertOne({
                _id: uuid,
                profile: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    username: data.username,
                    email: data.email
                },
                auth: {
                    verified: false,
                    verifyToken: null,
                    passwordHash,
                    passwordSalt
                }
            })
            return insertInfo.insertedId;
        });
        const newUser = await db.collection('user').operation(async (db, collection) => {
            const user = await collection.findOne({ _id: uuid });
            return user
        });
        if (!newUser) throw new Error('Error to create user');
        return new User(newUser);
    }
}
export namespace User {
    export type data = typeof user.infer;
    export type profile = data['profile'];
    export type auth = data['auth'];
    export interface newUser {
        firstName?: string;
        lastName?: string;
        username: string;
        email: string;
        password: string;
    }
}
export default User;