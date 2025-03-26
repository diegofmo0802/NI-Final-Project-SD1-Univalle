import ServerCore from 'saml.servercore';
import './config/env.js';
import ServerOptions from './config/Server.js';
import addApiRoutes from './apiRouter.js';

const server = new ServerCore(ServerOptions.port, ServerOptions.host, ServerOptions.ssl || undefined);

addApiRoutes(server);

server.addAction('ALL', '/*', (request, response) => {
    response.sendJson({
        message: 'Hello World',
        route: `[${request.method}] -> ${request.url}`
    });
});