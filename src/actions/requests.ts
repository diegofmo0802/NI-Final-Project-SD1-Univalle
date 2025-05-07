import requestManager from "../config/requestManager.js";
import userManager from "../config/userManager.js";
import ApiRequest from "../helper/ApiRequest.js";

export async function getRequest(apiRequest: ApiRequest): Promise<void> {
    const uuid = apiRequest.ruleParams.uuid ?? apiRequest.searchParams.uuid;
    if (!uuid) return void apiRequest.sendError('no uuid provided', 400);
    const request = await requestManager.getRequest(uuid);
    if (!request) return void apiRequest.sendError('request not found', 404);
    apiRequest.send(request);
}
export async function getRequests(apiRequest: ApiRequest): Promise<void> {
    const pageParam = apiRequest.ruleParams.page ?? apiRequest.searchParams.page ?? '1';
    const limitPAram = apiRequest.ruleParams.limit ?? apiRequest.searchParams.limit ?? '20';
    const page = parseInt(pageParam);
    const limit = parseInt(limitPAram);
    if (isNaN(page) || isNaN(limit)) return void apiRequest.sendError('invalid page or limit', 400);
    const requests = await requestManager.getRequests(page, limit);
    apiRequest.send({
        page, limit, count: requests.length,
        requests: requests.map((request) => request.data)
    });
}

export async function getUserPostulations(apiRequest: ApiRequest): Promise<void> {
    const uuid = apiRequest.ruleParams.uuid ?? apiRequest.searchParams.uuid;
    if (!uuid) return void apiRequest.sendError('no uuid provided', 400);
    const pageParam = apiRequest.ruleParams.page ?? apiRequest.searchParams.page ?? '1';
    const limitPAram = apiRequest.ruleParams.limit ?? apiRequest.searchParams.limit ?? '20';
    const page = parseInt(pageParam);
    const limit = parseInt(limitPAram);
    if (isNaN(page) || isNaN(limit)) return void apiRequest.sendError('invalid page or limit', 400);
    const postulations = await requestManager.getPostulations(page, limit, uuid);
    apiRequest.send({
        page, limit, count: postulations.length,
        postulations: postulations.map((postulation) => postulation.data)
    });
}
export async function getUserRequests(apiRequest: ApiRequest): Promise<void> {
    const uuid = apiRequest.ruleParams.uuid ?? apiRequest.searchParams.uuid;
    if (!uuid) return void apiRequest.sendError('no uuid provided', 400);
    const pageParam = apiRequest.ruleParams.page ?? apiRequest.searchParams.page ?? '1';
    const limitPAram = apiRequest.ruleParams.limit ?? apiRequest.searchParams.limit ?? '20';
    const page = parseInt(pageParam);
    const limit = parseInt(limitPAram);
    if (isNaN(page) || isNaN(limit)) return void apiRequest.sendError('invalid page or limit', 400);
    const requests = await requestManager.getRequests(page, limit, uuid);
    apiRequest.send({
        page, limit, count: requests.length,
        requests: requests.map((request) => request.data)
    });
}
export async function getRequestPostulations(apiRequest: ApiRequest): Promise<void> {
    const requestID = apiRequest.ruleParams.requestID ?? apiRequest.searchParams.requestID;
    if (!requestID) return void apiRequest.sendError('no uuid provided', 400);
    const pageParam = apiRequest.ruleParams.page ?? apiRequest.searchParams.page ?? '1';
    const limitPAram = apiRequest.ruleParams.limit ?? apiRequest.searchParams.limit ?? '20';
    const page = parseInt(pageParam);
    const limit = parseInt(limitPAram);
    if (isNaN(page) || isNaN(limit)) return void apiRequest.sendError('invalid page or limit', 400);
    const postulations = await requestManager.getRequestPostulations(page, limit, requestID);
    apiRequest.send({
        page, limit, count: postulations.length,
        postulations: postulations.map((postulation) => postulation.data)
    });
}

export async function createRequest(apiRequest: ApiRequest): Promise<void> {
    const session = apiRequest.session;
    if (session == null || session.valid == false) return apiRequest.unAuthorized();
    const loggedUser = await userManager.getUserById(session.content.uuid);
    if (loggedUser == null) return apiRequest.unAuthorized();

    const { uuid } = apiRequest.ruleParams;
    if (uuid == null) return void apiRequest.sendError('missing arguments', 400);
    if (!loggedUser.permissions.admin && loggedUser._id != uuid) return apiRequest.unAuthorized();

    const body = await apiRequest.post;
    if (body.mimeType !== 'multipart/form-data') return void apiRequest.sendError('no body provided', 400);


    const { tittle, description, count } = body.content
    if (!tittle || tittle.length < 3) return void apiRequest.sendError('invalid tittle', 400);
    if (!description || description.length < 3) return void apiRequest.sendError('invalid description', 400);
    if (!count) return void apiRequest.sendError('invalid count', 400);
    const countNumber = parseInt(count);
    if (isNaN(countNumber) || countNumber < 1) return void apiRequest.sendError('invalid count', 400);

    const request = await requestManager.createRequest({
        title: tittle,
        description: description,
        userID: uuid,
        endDate: Date.now() + 604800000, // 1 week
        startDate: Date.now(),
        status: 'pending',
        volunteerCount: 10,
        createdAt: Date.now()
    });
    apiRequest.send(request);
}
