import ServerCore from 'saml.servercore';
import './config/env.js';
import ServerOptions from './config/Server.js';

const server = new ServerCore(ServerOptions.port, ServerOptions.host, ServerOptions.ssl || undefined);

server.addAction('ALL', '/*', (request, response) => {
    response.sendJson({
        message: 'Hello World',
        route: `[${request.method}] -> ${request.url}`
    });
});
