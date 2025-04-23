export class User {

}
export namespace User {
    export interface Profile {
        type: 'volunteer' | 'foundation';
        username: string;
        name: string | null;
        bio: string | null;
        avatar: string;
        phone: string | null;
        address: string | null;
    }
    export interface UserEmail {
        address: string;
        verified: boolean;
        verifyToken: string | null;
    }
    export interface Auth {
        verified: boolean;
        verifyToken: string | null;
        passwordHash: string;
        passwordSalt: string;
    }
    export interface Config {
        nameVisible: boolean;
        emailVisible: boolean;
        phoneVisible: boolean;
        addressVisible: boolean;
    }
    export interface Permissions {
        admin: boolean;
        login: boolean;
        volunteer: boolean;
        foundation: boolean;
    }
    export interface User {
        _id: string;
        profile: Profile;
        email: UserEmail;
        auth: Auth;
        config: Config;
        permissions: Permissions;
    }
    export type visible = Omit<User, 'auth'>;
}
export default User;