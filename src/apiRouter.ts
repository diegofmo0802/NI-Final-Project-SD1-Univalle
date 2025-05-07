import ServerCore from "saml.servercore";

import ApiRequest from "./helper/ApiRequest.js";
import * as authRule from "./actions/auth.js";
import * as userRule from "./actions/user.js";
import * as requestRule from "./actions/requests.js";

function route(rule: string): string {
    rule = rule.startsWith('/') ? rule.slice(1) : rule;
    return `/api/${rule}`;
}

export function addApiRoutes(server: ServerCore) {
    // Auth rules/session
    server.addAction('POST', route('/api/auth/login'), (request, response) => {
        authRule.login(new ApiRequest(request, response));
    });
    server.addAction('POST', route('/api/auth/register'), (request, response) => {
        authRule.register(new ApiRequest(request, response));
    });
    server.addAction('POST', route('/api/auth/logout'), (request, response) => {
        authRule.logout(new ApiRequest(request, response));
    });
    server.addAction('GET', route('/api/auth/check'), (request, response) => {
        authRule.checkSession(new ApiRequest(request, response));
    });
    // User rules/Profile
    server.addAction('GET', '/api/user/', (request, response) => {
        userRule.getUsers(new ApiRequest(request, response));
    });
    server.addAction('GET', route('api/user/$uuid'), (request, response) => {
        userRule.getUser(new ApiRequest(request, response));
    });
    server.addAction('GET', route('api/user/$uuid/avatar/$avatarID'), (request, response) => {
        userRule.getAvatar(new ApiRequest(request, response));
    });
    server.addAction('POST', route('/api/user/$uuid'), (request, response) => {
        userRule.editUser(new ApiRequest(request, response));
    });
    // Request rules
    server.addAction('GET', '/api/user/$uuid/postulations', (request, response) => {
        requestRule.getUserPostulations(new ApiRequest(request, response));
    });
    server.addAction('GET', '/api/user/$uuid/requests', (request, response) => {
        requestRule.getUserRequests(new ApiRequest(request, response));
    });
    server.addAction('GET', route('/api/request/$uuid'), (request, response) => {
        requestRule.getRequest(new ApiRequest(request, response));
    });
    server.addAction('POST', '/api/user/$uuid/request', (request, response) => {
        requestRule.createRequest(new ApiRequest(request, response));
    });
    server.addAction('GET', route('/api/request/$uuid/postulations'), (request, response) => {
        requestRule.getUserPostulations(new ApiRequest(request, response));
    });
    // All other routes
    server.addAction('GET', route('*'), (request, response) => {
        const apiRequest = new ApiRequest(request, response);
        apiRequest.sendError(`No router fount to ${request.method} -> ${request.url}`, 404);
    });
}
export default addApiRoutes;