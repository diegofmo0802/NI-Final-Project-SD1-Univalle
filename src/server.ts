import ServerCore from 'saml.servercore';
import './config/env.js';
import ServerOptions from './config/Server.js';
import addApiRoutes from './apiRouter.js';
import addClientRules from './clientRouter.js';

const server = new ServerCore(ServerOptions.port, ServerOptions.host, ServerOptions.ssl || undefined);

addApiRoutes(server);
addClientRules(server);

server.addAction('ALL', '/*', (request, response) => {
    response.sendJson({
        message: 'Hello World',
        route: `[${request.method}] -> ${request.url}`
    });
});