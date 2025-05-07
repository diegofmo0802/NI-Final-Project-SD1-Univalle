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
    server.addAction('POST', route('/auth/login'), (request, response) => {
        authRule.login(new ApiRequest(request, response));
    });
    server.addAction('POST', route('/auth/register'), (request, response) => {
        authRule.register(new ApiRequest(request, response));
    });
    server.addAction('POST', route('/auth/logout'), (request, response) => {
        authRule.logout(new ApiRequest(request, response));
    });
    server.addAction('GET', route('/auth/check'), (request, response) => {
        authRule.checkSession(new ApiRequest(request, response));
    });
    // User rules/Profile
    server.addAction('GET', route('/user'), (request, response) => {
        userRule.getUsers(new ApiRequest(request, response));
    });
    server.addAction('GET', route('/user/$uuid'), (request, response) => {
        userRule.getUser(new ApiRequest(request, response));
    });
    server.addAction('GET', route('/user/$uuid/avatar/$avatarID'), (request, response) => {
        userRule.getAvatar(new ApiRequest(request, response));
    });
    server.addAction('POST', route('/user/$uuid'), (request, response) => {
        userRule.editUser(new ApiRequest(request, response));
    });
    // Request rules
    server.addAction('GET', route('/user/$uuid/postulations'), (request, response) => {
        requestRule.getUserPostulations(new ApiRequest(request, response));
    });
    server.addAction('GET', route('/user/$uuid/request'), (request, response) => {
        requestRule.getUserRequests(new ApiRequest(request, response));
    });
    server.addAction('POST', route('/user/$uuid/request'), (request, response) => {
        requestRule.createRequest(new ApiRequest(request, response));
    });
    server.addAction('GET', route('/request'), (request, response) => {
        requestRule.getRequests(new ApiRequest(request, response));
    });
    server.addAction('GET', route('/request/$uuid'), (request, response) => {
        requestRule.getRequest(new ApiRequest(request, response));
    });
    server.addAction('GET', route('/request/$uuid/postulations'), (request, response) => {
        requestRule.getUserPostulations(new ApiRequest(request, response));
    });
    // All other routes
    server.addAction('GET', route('*'), (request, response) => {
        const apiRequest = new ApiRequest(request, response);
        apiRequest.sendError(`No router found to ${request.method} -> ${request.url}`, 404);
    });
}
export default addApiRoutes;