import { Utilities } from 'saml.servercore';

import User from '../managers/UserManager/User.js';
import ApiRequest from '../helper/ApiRequest.js';
import authManager from '../config/authManager.js';
import ProjectDebug from '../config/ProjectDebug.js';
import userManager from '../config/userManager.js';
import { Image } from '../helper/Image.js';

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
    const user = await userManager.getUserByUsername(username);
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

export async function register(apiRequest: ApiRequest) {
    /* Getting sended data from the request */
    const post = await apiRequest.post;
    if (post.mimeType !== 'multipart/form-data') return void apiRequest.sendError('Invalid mime type', 400);
    const {
        type = 'volunteer',        // user type to the creation
        username, email, password, // user creation     - (required)
        name, bio, phone, address  // user profile data - (optional)
    } = post.content;
    const avatar = post.files.avatar; // user avatar     - (optional)
    /* Checking if all required data is sended */
    if (username == null) return void apiRequest.sendError('missing username', 400);
    if (email    == null) return void apiRequest.sendError('missing email', 400);
    if (password == null) return void apiRequest.sendError('missing password ', 400);
    /* Checking if the required data is valid */
    if (!userManager.isValidUserType(type))             return void apiRequest.sendError('Invalid type', 400);
    if (!userManager.isValidUsernames(username).valid) return void apiRequest.sendError('Invalid username', 400);
    if (!userManager.isValidEmails(email).valid)       return void apiRequest.sendError('Invalid email', 400);
    if (!userManager.isValidPassword(password).valid)  return void apiRequest.sendError('Invalid password', 400);
    /* Checking if the user already exists */
    if (await userManager.getUserByUsername(username) != null) return void apiRequest.sendError('User already exists', 409);
    if (await userManager.getUserByEmail(email) != null)       return void apiRequest.sendError('email already used', 409);
    /* checking if the avatar is valid to save */
    let avatarPath: string | null = null;
    let avatarID: string | null = null;
    let iconData: Buffer | null = null;
    if (avatar != null) {
        if (avatar.size > 1000000) return void apiRequest.sendError('Avatar size is too big', 400);
        if (!Image.isImageFile(avatar.content, ['jpeg', 'jpg', 'png'])) return void apiRequest.sendError('Invalid avatar format', 400);
        iconData = avatar.content;
    }
    /* Creating newUser object */
    const newUser: User.newUser = { type, username, email, password, };
    if (name != null)     newUser.name = name;
    if (bio != null)      newUser.bio = bio;
    if (phone != null)    newUser.phone = phone;
    if (address != null)  newUser.address = address;
    if (iconData != null) newUser.avatar = iconData;
    /* Creating the new user */
    const user = await userManager.createUser(newUser);
    if (typeof user === 'string') return void apiRequest.sendError(user, 400);

    apiRequest.authToken = apiRequest.generateSessionToken(user);
    apiRequest.send({
        user: user.publicData,
        session: apiRequest.generateSessionToken(user)
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
    const user = await userManager.getUserById(info.content.uuid);
    if (!user) return void apiRequest.sendError('User not found', 404);
    apiRequest.authToken = apiRequest.generateSessionToken(user);
    apiRequest.send({
        user: user.publicData,
        session: apiRequest.authToken
    });
}