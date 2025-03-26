import ServerCore from "saml.servercore";
import ApiRequest from "./helper/ApiRequest.js";
import * as authRule from "./actions/auth.js";

function route(rule: string): string {
    rule = rule.startsWith('/') ? rule.slice(1) : rule;
    return `/api/${rule}`;
}

export function addApiRoutes(server: ServerCore) {
    // Auth rules/session
    server.addAction('POST', route('auth/login'), (request, response) => {
        authRule.login(new ApiRequest(request, response));
    });
    server.addAction('POST', route('auth/logout'), (request, response) => {
        authRule.logout(new ApiRequest(request, response));
    });
    server.addAction('GET', route('auth/check'), (request, response) => {
        authRule.checkSession(new ApiRequest(request, response));
    });
    // All other routes
    server.addAction('GET', route('*'), (request, response) => {
        response.sendJson({
            message: 'router not found',
            route: `[${request.method}] -> ${request.url}`
        });
    });
}
export default addApiRoutes;