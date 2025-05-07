import { Utilities } from "saml.servercore";
import { volunteerRequests as request } from "../../config/dbScheme.js";
import RequestManager from "./RequestManager.js";
import Postulation from "./Postulation.js";
import { randomUUID } from "crypto";

export class Request implements Request.data {
    public readonly _id: string;
    private readonly requestManager: RequestManager;
    private _userID!: string;
    private _title!: string;
    private _description!: string;
    private _volunteerCount!: number;
    private _status!: string;
    private _startDate!: number;
    private _endDate!: number;
    private _createdAt!: number;
    private toUpdate: Partial<Request.data> = {};
    private currentData: Request.data;
    public readonly postulations: Postulation[] = [];
    public constructor(requestManager: RequestManager, data: Request.data, postulations?: Postulation[]) {
        this.requestManager = requestManager;
        this._id = data._id;
        this.currentData = data;
        this.setData(data);
    }
    private setData(data: Request.data): void {
        this._userID = data.userID;
        this._title = data.title;
        this._description = data.description;
        this._volunteerCount = data.volunteerCount;
        this._status = data.status;
        this._startDate = data.startDate;
        this._endDate = data.endDate;
        this._createdAt = data.createdAt;
    }
    public get userID(): string { return this.userID; }
    public get title(): string { return this._title; }
    public get description(): string { return this._description; }
    public get volunteerCount(): number { return this._volunteerCount; }
    public get status(): string { return this._status; }
    public get startDate(): number { return this._startDate; }
    public get endDate(): number { return this._endDate; }
    public get createdAt(): number { return this._createdAt; }
    public set userID(value: string) {
        if (this._userID === value) return;
        if (this.toUpdate.userID === value) return;
        this.toUpdate.userID = value;
        this._userID = value;
    }
    public set title(value: string) {
        if (this._title === value) return;
        if (this.toUpdate.title === value) return;
        this.toUpdate.title = value;
        this._title = value;
    }
    public set description(value: string) {
        if (this._description === value) return;
        if (this.toUpdate.description === value) return;
        this.toUpdate.description = value;
        this._description = value;
    }
    public set volunteerCount(value: number) {
        if (this._volunteerCount === value) return;
        if (this.toUpdate.volunteerCount === value) return;
        this.toUpdate.volunteerCount = value;
        this._volunteerCount = value;
    }
    public set status(value: string) {
        if (this._status === value) return;
        if (this.toUpdate.status === value) return;
        this.toUpdate.status = value;
        this._status = value;
    }
    public set startDate(value: number) {
        if (this._startDate === value) return;
        if (this.toUpdate.startDate === value) return;
        this.toUpdate.startDate = value;
        this._startDate = value;
    }
    public set endDate(value: number) {
        if (this._endDate === value) return;
        if (this.toUpdate.endDate === value) return;
        this.toUpdate.endDate = value;
        this._endDate = value;
    }
    public set createdAt(value: number) {
        if (this._createdAt === value) return;
        if (this.toUpdate.createdAt === value) return;
        this.toUpdate.createdAt = value;
        this._createdAt = value;
    }
    public addPostulation(postulation: Omit<Postulation.data, '_id'>): void {
        this.requestManager.collPostulation.transaction(async (db, collection) => {
            const insert = await collection.insertOne({
                ...postulation,
                _id: randomUUID(),
                createdAt: Date.now()
            });
            const result = await this.requestManager.getPostulation(insert.insertedId);
            if (!result) throw new Error('Postulation not found');
            this.postulations.push(result);
        });
    }
    /**
     * Check if there are any changes to the database.
     * @returns true if there are changes, false otherwise.
     */
    public needUpdate(): boolean { return Object.keys(this.toUpdate).length > 0; }
    /**
     * Cancel changes to the database.
     */
    public cancelChanges(): void {
        this.toUpdate = {};
        this.setData(this.currentData);
    }
    /**
     * Save changes to the database.
     * @throws Error if user not found or failed to update.
     */
    public async saveChanges(): Promise<this> {
        if (!this.needUpdate()) return this;
        return await this.requestManager.collRequest.transaction(async (db, collection) => {
            const toUpdate = Utilities.flattenObject(this.toUpdate);
            const update = await collection.updateOne({ _id: this._id }, { $set: toUpdate });
            const newData = await collection.findOne({ _id: update.upsertedId ?? this._id });
            if (!newData) throw new Error('User not found');
            this.currentData = newData;
            this.setData(newData);
            return this;
        });
    }
}
export namespace Request {

    export type publicData = Omit<data, 'auth'>;
    export type data = typeof request.infer;
}
export default Request;