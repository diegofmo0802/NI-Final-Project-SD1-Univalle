import Api from "./Api.js";
import User from "./User.js";

export class Request {
    public static BASE_URL = '/api/request';
    public static async get(id: string): Promise<Request.data> {
        const response = await fetch(`${this.BASE_URL}/${id}`, { method: 'GET' });
        const data = await response.json();
        if (response.ok) {
            if (data.success) return data.result;
            else throw new Error(data.reason);
        } else throw new Error(data.reason);
    }
    public static async getAll(page: number, limit: number = 10): Promise<{
        page: number; limit: number; count: number;
        requests: Request.data[]
    }> {
        const response = await fetch(`${this.BASE_URL}/?page=${page}&limit=${limit}`, { method: 'GET' });
        const data = await response.json();
        if (response.ok) {
            if (data.success) return data.result;
            else throw new Error(data.reason);
        } else throw new Error(data.reason);
    }
    public static async getAllByUserID(userID: string, page: number, limit: number = 10): Promise<{
        page: number; limit: number; count: number;
        requests: Request.data[]
    }> {
        const response = await fetch(`${User.BASE_URL}/${userID}/request/?page=${page}&limit=${limit}`, { method: 'GET' });
        const data = await response.json();
        if (response.ok) {
            if (data.success) return data.result;
            else throw new Error(data.reason);
        } else throw new Error(data.reason);
    }
    public static async create(id: string, values: Partial<Request.createRequest>): Promise<Api.Response<Request.data>> {
        const body = new FormData();
        for (const [key, value] of Object.entries(values)) {
            if (value !== undefined) body.append(key, value.toString());
            console.log(key, value);
        }
        const response = await fetch(`${User.BASE_URL}/${id}/request`, { method: 'POST', body  });
        return await response.json();
    }
}
export namespace Request {
    export interface data {
        _id: string;
        title: string;
        description: string;
        userID: string;
        endDate: number;
        startDate: number;
        status: string;
        volunteerCount: number;
        createdAt: number;
    }
    export interface createRequest {
        title: string;
        description: string;
        count: number;
        endDate?: number;
        startDate?: number;
    };
}
export default Request;