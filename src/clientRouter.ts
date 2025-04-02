import ServerCore from "saml.servercore";

function sendIndex(request: ServerCore.Request, response: ServerCore.Response) {
    response.sendTemplate('client/index.html', {
        tittle: "Home"
    });
}

export function addClientRules(server: ServerCore) {
    server.addFolder('/client', './client');
    server.addAction('GET', '/', sendIndex);
    server.addAction('GET', '/app/*', sendIndex);
}
export default addClientRules;