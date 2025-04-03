import _Auth from "./Auth.js";
import _User from './User.js';

export namespace Api {
    export import auth = _Auth;
    export import user = _User;
    export namespace Response {
        export interface Base {
            success: boolean;
            code: number;
        }
        export interface Success<T extends any = any> extends Base {
            success: true;
            result: T;
        }
        export interface Error {
            success: true;
            reason: string;
        }
    }
}
export default Api;