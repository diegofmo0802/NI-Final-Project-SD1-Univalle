import User from '../helper/User.js';
import ApiRequest from '../helper/ApiRequest.js';
import authManager from '../config/authManager.js';
import ProjectDebug from '../config/ProjectDebug.js';


export async function login(apiRequest: ApiRequest) {
    ProjectDebug.log('executing login');
    ProjectDebug.log('getting post data in mimetype json');
    const post = await apiRequest.post;
    if (post.mimeType !== 'application/json') return void apiRequest.sendError('Invalid mime type', 400);
    ProjectDebug.log('getting post data in json');
    const {
        username, password
    } = await post.content;
    ProjectDebug.log('checking if username and password are set');
    if (!username || !password) return void apiRequest.sendError('Invalid data', 400);
    const user = await User.getUserByUserName(username);
    ProjectDebug.log('checking if user exists');
    if (!user) return void apiRequest.sendError('User not found', 404);
    ProjectDebug.log('checking if password is valid');
    if (!apiRequest.validatePassword(user, password)) return void apiRequest.sendError('Invalid password', 401);
    apiRequest.authToken = apiRequest.generateSessionToken(user);
    console.log("before send response success");
    apiRequest.send({
        user: user.publicData,
        session: apiRequest.authToken
    });
}

export async function logout(apiRequest: ApiRequest) {
    if (!apiRequest.authToken) return void apiRequest.sendError('Not logged in', 401);
    apiRequest.authToken = null;
    apiRequest.send({ message: "session closed" });
}

export async function checkSession(apiRequest: ApiRequest) {
    if (!apiRequest.authToken) return void apiRequest.sendError('Not logged in', 401);
    const info = authManager.parseSessionToken(apiRequest.authToken);
    if (!info.valid) return void apiRequest.sendError('Invalid session', 401);
    const user = await User.getUser(info.content.uuid);
    if (!user) return void apiRequest.sendError('User not found', 404);
    apiRequest.authToken = apiRequest.generateSessionToken(user);
    apiRequest.send({
        user: user.publicData,
        session: apiRequest.authToken
    });
}