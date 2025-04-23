import { randomUUID } from "crypto";

import { user } from "../../config/dbScheme.js";
import User from "./User.js";
import Auth from "../../helper/Auth.js";
import { CollectionSession, Schema } from "../../DBManager/Manager";
import ProjectDebug from "../../config/ProjectDebug.js";
import Avatar from "../../helper/Avatar.js";

export class UserManager {
    public constructor(
        public readonly collection: CollectionSession<{
            user: typeof user;
            [Key: string]: Schema<any>
        }, 'user'>,
    ) {}
    
    public async getUserById(uuid: string): Promise<User | null> {
        return this.collection.operation(async (db, collection) => {
            const result = await collection.findOne({ _id: uuid });
            return result ? new User(this, result) : null;
        });
    }
    public async getUserByEmail(email: string): Promise<User | null> {
        return this.collection.operation(async (db, collection) => {
            const result = await collection.findOne({ 'email.address': email });
            return result ? new User(this, result) : null;
        });
    }
    public async getUserByUsername(username: string): Promise<User | null> {
        return this.collection.operation(async (dn, collection) => {
            const result = await collection.findOne({ 'profile.username': username });
            return result ? new User(this, result) : null;
        });
    }
    public async getUsers(page: number, limit: number): Promise<User.data[]> {
        const skip = (page - 1) * limit;
        return await this.collection.operation(async (db, collection) => {
            return await collection.aggregate<User.data>([
                { $match: {} },
                { $skip: skip },
                { $limit: limit },
            ]);
        });
    }
    public async createUser(data: User.newUser): Promise<User | string> {
        /* Checking if the username is already in use */
        const error = await this.collection.operation(async (db, collection) => {
            const existingUser = await collection.findOne({ 'profile.username': data.username });
            if (existingUser) return 'api.auth.register.register.username-already-exists';
            return null;
        });
        if (error) return error;
        /* Creating an uuid for the user */
        const uuid: string = await this.collection.operation(async (db, collection) => {
            let uuid = randomUUID();
            let valid = false;
            do {
                const info = await collection.findOne({ _id: uuid });
                if (!info) valid = true;
                else uuid = randomUUID();
            } while (!valid);
            return uuid;
        });
        /* Encrypting the password */
        const salt = Auth.authSalt();
        const hash = Auth.encryptPassword(data.password, salt);
        /** saving avatar */
        let avatar: string | null = null;
        if (data.avatar != null) {
            try {
                const avatarID = await Avatar.save(uuid, data.avatar);
                avatar = Avatar.getUrl(uuid, avatarID);
            } catch (error) {
                ProjectDebug.error(error);
                return 'api.auth.register.avatar-error';
            }
        }

        return this.collection.transaction(async (db, collection) => {
            console.log(collection.Schema);
            await collection.insertOne({
                _id: uuid,
                profile: {
                    type: data.type,
                    username: data.username,
                    name: data.name,
                    bio: data.bio,
                    avatar: avatar ? avatar : undefined,
                    phone: data.phone,
                    address: data.address,
                },
                config: {},
                permissions: {},
                email: { address: data.email },
                auth: { passwordHash: hash, passwordSalt: salt }
            });
            const user = await collection.findOne({ _id: uuid }, { projection: { _id: 1 } });
            if (!user) throw new Error('could not create user');
            return new User(this, user);
        });
    }
    public isValidUsernames(username: string): UserManager.validatorResponse {
        if (username.length < 3) return { valid: false, reason: 'username is too short' };
        if (username.length > 20) return { valid: false, reason: 'username is too long' };
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return { valid: false, reason: 'username contains invalid characters' };
        return { valid: true };
    }
    public isValidPassword(password: string): UserManager.validatorResponse {
        if (password.length < 8) return { valid: false, reason: 'password is too short' };
        if (password.length > 100) return { valid: false, reason: 'password is too long' };
        // if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return { valid: false, reason: 'password must contain at least one lowercase letter' };
        return { valid: true };
    }
    public isValidEmails(email: string): UserManager.validatorResponse {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) return { valid: false, reason: 'email is invalid' };
        return { valid: true };
    }
    public isValidUserType(type: string): type is User.userType {
        return ['volunteer', 'foundation'].includes(type);
    }
}

export namespace UserManager {
    namespace validations {
        export interface validResponse {
            valid: true;
        }
        export interface invalidResponse {
            valid: false;
            reason: string;
        }
    }
    export type validatorResponse = validations.validResponse | validations.invalidResponse;
}

export default UserManager;