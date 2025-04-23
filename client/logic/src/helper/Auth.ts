import Api from "api/Api";

export class Auth {
    public static async checkAuth(auth?: Auth.AuthExec): Promise<boolean> {
        const response = await Api.auth.check();
        if (!response.success) return false;
        return auth != null ? auth(response.result.user) : true;
    }
}
export namespace Auth {
    export type AuthExec = (user: Api.user.visible) => boolean;
}
export default Auth;