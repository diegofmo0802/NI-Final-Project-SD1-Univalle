import Api from "./Api";

export class Auth {
    public static BASE_URL = '/api/auth';
    public static async login(username: string, password: string): Promise<Api.Response> {
        const response = await fetch(`${this.BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ username, password }),
        });
        return await response.json();
    }
    public static async register(data: Auth.newUser): Promise<Api.Response> {
        const formData = new FormData();
        formData.append('type', data.type);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);
        if (data.name) formData.append('name', data.name);
        if (data.bio) formData.append('bio', data.bio);
        if (data.avatar) formData.append('avatar', data.avatar);
        if (data.phone) formData.append('phone', data.phone);
        if (data.address) formData.append('address', data.address);

        console.log(data.avatar?.size);

        const response = await fetch(`${this.BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data', },
            body: formData,
        });
        return await response.json();
    }
    public static async check(): Promise<Api.Response> {
        const response = await fetch(`${this.BASE_URL}/check`, {
            method: 'GET',
        });
        return await response.json();
    }
    public static async logout(): Promise<Api.Response> {
        const response = await fetch(`${this.BASE_URL}/logout`, {
            method: 'POST',
        });
        return await response.json();
    }
}
export namespace Auth {
    export type userType = 'volunteer' | 'foundation';
    export interface newUser {
        type: userType;
        username: string;
        name?: string;
        bio?: string;
        avatar?: File;
        email: string;
        phone?: string;
        address?: string;
        password: string;
    }
}
export default Auth;