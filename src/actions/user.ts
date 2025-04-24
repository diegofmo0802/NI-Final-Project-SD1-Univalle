import Avatar from '../helper/Avatar.js';
import ApiRequest from '../helper/ApiRequest.js';
import userManager from '../config/userManager.js';

export async function getAvatar(apiRequest: ApiRequest) {
    const { uuid, avatarID } = apiRequest.ruleParams;
    if (uuid == null || avatarID == null) return apiRequest.sendError('missing arguments', 400);
    const path = Avatar.getPath(uuid, avatarID);
    const avatar = await Avatar.get(uuid, avatarID);
    if (avatar == null) return apiRequest.sendError('avatar not found', 404);
    return apiRequest.sendCustom(avatar);
}

export async function getUser(apiRequest: ApiRequest) {
    const { uuid } = apiRequest.ruleParams;
    if (uuid == null) return apiRequest.sendError('missing arguments', 400);
    const user = await userManager.getUserById(uuid);
    if (user == null) return apiRequest.sendError('user not found', 404);
    return apiRequest.send(user.publicData);
}


export async function getUsers(apiRequest: ApiRequest) {
    const pageParam = apiRequest.ruleParams.Page ?? apiRequest.searchParams.get('page');
    const limitParam = apiRequest.searchParams.get('limit');
    if (!pageParam) return apiRequest.sendError('no page provided');
    if (!limitParam) return apiRequest.sendError('no limit provided');
    const page = parseInt(pageParam);
    const limit = parseInt(limitParam);
    if (isNaN(page) || isNaN(limit)) return apiRequest.sendError('invalid page or limit');
    if (page < 1) return apiRequest.sendError('page must be greater than 0');
    if (limit < 1) return apiRequest.sendError('limit must be greater than 0');
    const result = await userManager.getUsers(page, limit);
    const users = result.map(user => user.publicData);
    apiRequest.send({ page, limit, count: users.length, users });
}