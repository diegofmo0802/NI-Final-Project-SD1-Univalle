export class Auth {

}
export namespace Auth {
    export interface Profile {
        email: string;
        firstName: string;
        lastName: string;
        username: string;
        avatar: string;
    }
    export interface Permissions {
        admin: boolean;
        login: boolean;
    }
    export interface visible {
        _id: string;
        profile: Profile;
        permissions: Permissions;
    }
}
export default Auth;