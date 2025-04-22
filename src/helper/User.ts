import { randomUUID } from 'crypto';

import Manager, { Collection } from '../DBManager/Manager.js';
import db from '../config/dbManager.js';
import { user } from '../config/dbScheme.js';
import Auth from './Auth.js';

export class User implements User.data {
    public readonly _id: string;
    public _profile: User.profile;
    public _permissions: User.Permission;
    public _auth: User.auth;
    private _original_profile: User.profile;
    private _original_config: User.config;
    private _original_permissions: User.Permission;
    private _original_auth: User.auth;
    private constructor(data: User.data) {
        this._id = data._id;
        this._profile = data.profile;
        this._permissions = data.permissions;
        this._auth = data.auth;
        this._original_profile = { ...data.profile };
        this._original_config = { ...data.config };
        this._original_permissions = { ...data.permissions };
        this._original_auth = { ...data.auth };
    }
    public get publicData(): User.publicData{
        const { _id, profile, config, permissions } = this.data;
        return { _id, profile, config, permissions };
    }
    public get data(): User.data {
        return {
            _id: this._id,
            profile: this._original_profile,
            config: this._original_config,
            permissions: this._original_permissions,
            auth: this._original_auth
        }
    }
    public get profile(): User.profile { return this._profile; }
    public get config(): User.config { return this._original_config; }
    public get permissions(): User.Permission { return this._permissions; }
    public get auth(): User.auth { return this._auth; }
    public set profile(data: User.profile) {
        this.profile = { ...this._profile, ...data };
    }
    public set permissions(data: User.Permission) {
        this.permissions = { ...this._original_permissions, ...data };
    }
    public set auth(data: User.auth) {
        this.auth = { ...this._original_auth, ...data };
    }
    /**
     * Cancels the update of the user.
     */
    public cancelUpdate(): void {
        this._profile = this._original_profile;
        this._permissions = this._original_permissions;
        this._auth = this._original_auth;
    }
    /**
     * Updates the user.
     */
    public async executeUpdate(): Promise<void> {
        await db.collection('user').transaction(async (db, collection) => {
             await collection.updateOne({ _id: this._id }, {
                $set: {
                    profile: this._profile,
                    permissions: this._permissions,
                    auth: this._auth
                }
            });
        });
        this._original_auth = this._auth;
        this._original_permissions = this._permissions;
        this._original_profile = this._profile;
    }
    /**
     * Gets a user by their email address.
     * @param email - The email address of the user.
     */
    public static async getUserByEmailAddress(email: string): Promise<User | null> {
        return await db.collection('user').operation(async (db, collection) => {
            const user = await collection.findOne({ 'profile.email': email });
            if (!user) return null;
            return new User(user);
        });
    }
    /**
     * Gets a user by their username.
     * @param username - The username of the user.
     */
    public static async getUserByUserName(username: string): Promise<User | null> {
        return await db.collection('user').operation(async (db, collection) => {
            const user = await collection.findOne({ 'profile.username': username });
            if (!user) return null;
            return new User(user);
        });
    }
    /**
     * Gets a user by their UUID.
     * @param uuid - The UUID of the user.
     */
    public static async getUser(uuid: string): Promise<User | null> {
        return await db.collection('user').operation(async (db, collection) => {
            const user = await collection.findOne({ _id: uuid });
            if (!user) return null;
            return new User(user);
        });
    }
    /**
     * Creates a new user.
     * @param data - The data to create the user with.
     */
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
                    type: data.type,
                    username: data.username,
                    name: data.name,
                    bio: data.bio,
                    avatar: data.avatar,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                },
                config: {},
                permissions: {},
                auth: {
                    verifyToken: null,
                    verified: false,
                    passwordHash,
                    passwordSalt
                }
            });
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
    export type publicData = Omit<data, 'auth'>;
    export type profile = data['profile'];
    export type config = data['config'];
    export type Permission = data['permissions'];
    export type auth = data['auth'];
    export interface newUser {
        type: 'volunteer' | 'foundation';
        username: string;
        name: string;
        bio: string;
        avatar: string;
        email: string;
        phone: string;
        address: string;
        password: string;
    }
}
export default User;