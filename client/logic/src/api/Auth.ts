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
    public static async register(username: string, email: string, password: string): Promise<Api.Response> {
        const response = await fetch(`${this.BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ username, email, password }),
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

}
export default Auth;