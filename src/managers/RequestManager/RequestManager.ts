import { randomUUID } from "crypto";

import { volunteerPostulations, volunteerRequests } from "../../config/dbScheme.js";
import { CollectionSession, Schema } from "../../DBManager/Manager.js";
import Request from "./Request.js";
import Postulation from "./Postulation.js";

export class RequestManager {
    public constructor(
        public readonly collPostulation: CollectionSession<{
            volunteerPostulations: typeof volunteerPostulations;
            volunteerRequests: typeof volunteerRequests;
            [Key: string]: Schema<any>
        }, 'volunteerPostulations'>,
        public readonly collRequest: CollectionSession<{
            volunteerRequests: typeof volunteerRequests;
            volunteerPostulations: typeof volunteerPostulations;
            [Key: string]: Schema<any>
        }, 'volunteerRequests'>,
    ) {}
    public async getRequest(id: string): Promise<Request | null> {
        return this.collRequest.operation(async (db, collection) => {
            const result = await collection.aggregate<Request.data & { postulations?: Postulation.data[] }>([
                { $match: { _id: id } },
                { $lookup: {
                    from: 'volunteerPostulations',
                    localField: '_id',
                    foreignField: 'requestID',
                    as: 'postulations'
                } },
                { $unwind: '$postulations' },
            ]);
            const request = result[0] ?? null;
            if (!request) return null;
            const postulations = request.postulations?.map((postulation) => new Postulation(this, postulation)) ?? [];
            return new Request(this, request, postulations);
        });
    }
    public async getRequests(page: number, limit: number, foundation?: string): Promise<Request[]> {
        const skip = (page - 1) * limit;
        return this.collRequest.operation(async (db, collection) => {
            const result = await collection.aggregate<Request.data & { postulations?: Postulation.data[] }>([
                { $match: foundation ? { 'userID': foundation } : {} },
                { $skip: skip },
                { $limit: limit },
                { $sort: { createdAt: -1 } },
                { $lookup: {
                    from: 'volunteerPostulations',
                    localField: '_id',
                    foreignField: 'requestID',
                    as: 'postulations'
                } },
                { $unwind: '$postulations' },
            ]);
            return result.map((document) => new Request(this, document, document.postulations?.map((postulation) => new Postulation(this, postulation)) ?? []));
        });
    }
    public getPostulation(id: string): Promise<Postulation | null> {
        return this.collPostulation.operation(async (db, collection) => {
            const result = await collection.findOne({ _id: id });
            return result ? new Postulation(this, result) : null;
        });
    }
    public getPostulations(page: number, limit: number, user?: string): Promise<Postulation[]> {
        const skip = (page - 1) * limit;
        return this.collPostulation.operation(async (db, collection) => {
            const result = await collection.aggregate<Postulation.data>([
                { $match: user ? { 'userID': user } : {} },
                { $skip: skip },
                { $limit: limit },
                { $sort: { createdAt: -1 } },
            ]);
            return result.map((document) => new Postulation(this, document));
        });
    }
    public getRequestPostulations(page: number, limit: number, request: string): Promise<Postulation[]> {
        const skip = (page - 1) * limit;
        return this.collPostulation.operation(async (db, collection) => {
            const result = await collection.aggregate<Postulation.data>([
                { $match: { 'requestID': request } },
                { $skip: skip },
                { $limit: limit },
                { $sort: { createdAt: -1 } },
            ]);
            return result.map((document) => new Postulation(this, document));
        });
    }
        
    public async createRequest(data: Omit<Request.data, '_id'>): Promise<Request> {
        return this.collRequest.transaction(async (db, collection) => {
            const insert = await collection.insertOne({
                ...data,
                _id: randomUUID(),
                createdAt: Date.now()
            });
            const result = await this.getRequest(insert.insertedId);
            if (!result) throw new Error('Request not found');
            return result;
        });
    }

}

export namespace RequestManager {}
export default RequestManager;