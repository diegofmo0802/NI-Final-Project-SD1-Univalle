export class User {
    public static BASE_URL = '/api/user';
    public static async getAll(page: number, limit: number = 10): Promise<{
        page: number; limit: number; count: number;
        users: User.visible[]
    }> {
        const response = await fetch(`${this.BASE_URL}/?page=${page}&limit=${limit}`, { method: 'GET' });
        const data = await response.json();
        if (response.ok) {
            if (data.success) return data.result;
            else throw new Error(data.reason);
        } else throw new Error(data.reason);
    }
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