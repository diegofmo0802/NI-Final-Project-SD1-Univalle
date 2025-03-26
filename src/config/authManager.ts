import JwtManager from "saml.servercore/build/Beta/JwtManager.js";
import ProjectDebug from "./ProjectDebug.js";
import AuthManager from "../managers/AuthManager.js";

const {
    JWT_SECRET = 'secret'
} = process.env;

if (JWT_SECRET === 'secret') ProjectDebug.warn('JWT_SECRET is not set, using default value');

export const jwt = new JwtManager('HS256', JWT_SECRET)
export const authManager = new AuthManager(jwt);

export default authManager;