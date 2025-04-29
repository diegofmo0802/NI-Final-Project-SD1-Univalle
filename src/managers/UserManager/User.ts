import { Utilities } from "saml.servercore";
import { user } from "../../config/dbScheme.js";
import UserManager from "./UserManager.js";

export class User implements User.data {
    public readonly _id!: string;
    protected readonly userManager: UserManager;
    protected _profile!: User.profile;
    protected _email!: User.email;
    protected _auth!: User.auth;
    protected _config!: User.config;
    protected _permissions!: User.Permission;
    protected toUpdate!: User.updateData;
    public constructor(userManager: UserManager, data: User.data) {
        this.userManager = userManager;
        this.setData(data);
    }
    /**
     * Set data for the user.
     * @param data - The data to set.
     */
    protected setData(data: User.data): void {
        this._profile = data.profile;
        this._email = data.email;
        this._auth = data.auth;
        this._config = data.config;
        this._permissions = data.permissions;
        this.toUpdate = {};
    }
    public get profile(): User.profile { return this._profile; }
    public get auth(): User.auth { return this._auth; }
    public get email(): User.email { return this._email; }
    public get config(): User.config { return this._config; }
    public get permissions(): User.Permission { return this._permissions; }
    public set profile(profile: Partial<User.profile>) { this.toUpdate.profile = profile; }
    public set auth(auth: Partial<User.auth>) { this.toUpdate.auth = auth; }
    public set email(email: Partial<User.email>) { this.toUpdate.email = email; }
    public set config(config: Partial<User.config>) { this.toUpdate.config = config; }
    public set permissions(permissions: Partial<User.Permission>) { this.toUpdate.permissions = permissions; }
    public get publicData(): User.publicData {
        const { _id, profile, email, config, permissions } = this;
        return { _id, profile, email, config, permissions };
    }
    /**
     * Check if there are any changes to the database.
     * @returns true if there are changes, false otherwise.
     */
    public needUpdate(): boolean { return Object.keys(this.toUpdate).length > 0; }
    /**
     * Cancel changes to the database.
     */
    public cancelChanges(): void { this.toUpdate = {}; }
    /**
     * Save changes to the database.
     * @throws Error if user not found or failed to update.
     */
    public async saveChanges(): Promise<this> {
        if (!this.needUpdate()) return this;
        return await this.userManager.collection.transaction(async (db, collection) => {
            const toUpdate = Utilities.flattenObject(this.toUpdate);
            const update = await collection.updateOne({ _id: this._id }, { $set: toUpdate });
            const newData = await collection.findOne({ _id: update.upsertedId ?? this._id });
            if (!newData) throw new Error('User not found');
            this.setData(newData);
            return this;
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