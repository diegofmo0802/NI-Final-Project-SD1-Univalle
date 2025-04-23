import authManager from "../config/authManager.js";
import ServerCore from "saml.servercore";
import User from "../managers/UserManager/User.js";

export class ApiRequest {
    private sended: boolean = false;
    public constructor(
        public readonly request: ServerCore.Request,
        private readonly response: ServerCore.Response
    ) {}
    public get ruleParams(): ServerCore.Rule.ruleParams {
        return this.request.ruleParams;
    }
    public get searchParams(): ServerCore.Request.GET {
        return this.request.queryParams;
    }
    public get post(): Promise<ServerCore.Request.POST> {
        return this.request.post;
    }
    public get cookies(): ServerCore.Cookie {
        return this.request.cookies;
    }
    public get authToken(): string | null {
        return this.cookies.get('auth-token') ?? null;
    }
    public set authToken(token: string | null) {
        if (!token) { this.cookies.delete('auth-token'); return; }
        const info = authManager.parseSessionToken(token);
        this.cookies.set('auth-token', token, {
            secure: true, httpOnly: true, path: '/',
            expires: info.valid ? new Date(info.content.expire) : undefined
        });
    }
    public send<result>(result: result, code: number = 200): void {
        if (this.sended) throw new Error("Response already sended");
        this.sended = true;
        const data: ApiRequest.response<result> = {
            success: true,
            code: code,
            result: result,
        };
        this.response.sendJson(data);
    }
    public sendFile(path: string): void {
        if (this.sended) throw new Error("Response already sended");
        this.sended = true;
        this.response.sendFile(path);
    }
    public unAuthorized(message: string = 'Unauthorized'): void {
        this.sendError(message, 401);
    }
    public redirect(url: string): void {
        if (this.sended) throw new Error("Response already sended");
        this.sended = true;
        this.response.sendHeaders(302, {
            location: url
        });
        this.response.send('');
    }
    public sendError(reason: string, code: number = 500): void {
        if (this.sended) throw new Error("Response already sended");
        this.sended = true;
        const data: ApiRequest.error = {
            success: false,
            code: code,
            reason: reason,
        };
        this.response.sendJson(data);
    }
    public validatePassword(user: User, password: string): boolean {
        return authManager.validatePassword(password, user.auth.passwordHash, user.auth.passwordSalt);
    }
    public generateSessionToken(user: User) {
        return authManager.generateSessionToken(user._id);
    }
}

export namespace ApiRequest {
    interface outPut {
        log?: string[];
        code: number;
    }
    export interface response<result = any> extends outPut {
        success: true;
        result: result;
    }
    export interface error extends outPut {
        success: false;
        reason: string;
    }
    export type PostMime = (
        'application/x-www-form-urlencoded' |
        'multipart/form-data' |
        'application/json'
    );
}

export default ApiRequest;