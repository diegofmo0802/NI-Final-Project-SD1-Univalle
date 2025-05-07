import _Auth from "./Auth.js";
import _User from './User.js';
import _Request from "./Request.js";

export namespace Api {
    export import auth = _Auth;
    export import user = _User;
    export import request = _Request;
    export namespace Response {
        export interface Base {
            success: boolean;
            code: number;
        }
        export interface Success<T extends any = any> extends Base {
            success: true;
            result: T;
        }
        export interface Error extends Base{
            success: false;
            reason: string;
        }
    }
    export type Response<T extends any = any> = (Response.Success<T> | Response.Error);
}
export default Api;