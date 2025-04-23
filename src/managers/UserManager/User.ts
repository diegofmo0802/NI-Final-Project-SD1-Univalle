import { Utilities } from "saml.servercore";
import { user } from "../../config/dbScheme.js";
import UserManager from "./UserManager.js";

export class User implements User.data {
    public readonly _id: string;
    protected readonly userManager: UserManager;
    protected _profile: User.profile;
    protected _email: User.email;
    protected _auth: User.auth;
    protected _config: User.config;
    protected _permissions: User.Permission;
    public constructor(userManager: UserManager, data: User.data) {
        this.userManager = userManager;
        this._id = data._id;
        this._profile = data.profile;
        this._email = data.email;
        this._auth = data.auth;
        this._config = data.config;
        this._permissions = data.permissions;
    }
    public get profile(): User.profile { return this._profile; }
    public get auth(): User.auth { return this._auth; }
    public get email(): User.email { return this._email; }
    public get config(): User.config { return this._config; }
    public get permissions(): User.Permission { return this._permissions; }
    public get publicData(): User.publicData {
        return {
            _id: this._id,
            profile: this._profile,
            email: this._email,
            config: this._config,
            permissions: this._permissions,
        };
    }
    public update(value: User.updateData): Promise<User.data | null> {
        return this.userManager.collection.transaction(async (db, collection) => {
            const toUpdate = Utilities.flattenObject(value);
            const update = await collection.updateOne({ _id: this._id }, { $set: toUpdate });
            const user = await collection.findOne({ _id: update.upsertedId ?? this._id });
            return user ? user : null;
        });
    }
}
export namespace User {
    export type userType = 'volunteer' | 'foundation';
    type PartialRecursive<T> = {
        [K in keyof T]?: T[K] extends object ? PartialRecursive<T[K]> : T[K];
    };
    export type publicData = Omit<data, 'auth'>;
    export type data = typeof user.infer;
    export type profile = data['profile'];
    export type email = data['email'];
    export type auth = data['auth'];
    export type config = data['config'];
    export type Permission = data['permissions'];
    export type updateData = PartialRecursive<data>;
    export interface newUser {
        type: userType;
        username: string;
        name?: string;
        bio?: string;
        avatar?: Buffer;
        email: string;
        phone?: string;
        address?: string;
        password: string;
    }
}
export default User;