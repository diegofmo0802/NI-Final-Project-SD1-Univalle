import Avatar from '../helper/Avatar.js';
import ApiRequest from '../helper/ApiRequest.js';

export async function getAvatar(apiRequest: ApiRequest) {
    const { uuid, avatarID } = apiRequest.ruleParams;
    if (uuid == null || avatarID == null) return apiRequest.sendError('missing arguments', 400);
    const path = Avatar.getPath(uuid, avatarID);
    const avatar = await Avatar.get(uuid, avatarID);
    if (avatar == null) return apiRequest.sendError('avatar not found', 404);
    return apiRequest.sendCustom(avatar);
}