import { Utilities } from "saml.servercore";
import { volunteerPostulations as postulation } from "../../config/dbScheme.js";
import RequestManager from "./RequestManager.js";

export class Postulation implements Postulation.data {
    public readonly _id: string;
    private readonly requestManager: RequestManager;
    private _requestID!: string;
    private _userID!: string;
    private _createdAt!: number;
    private toUpdate: Partial<Postulation.data> = {};
    private currentData: Postulation.data;
    public constructor(requestManager: RequestManager, data: Postulation.data) {
        this.requestManager = requestManager;
        this._id = data._id;
        this.currentData = data;
        this.setData(data);
    }
    private setData(data: Postulation.data): void {
        this._requestID = data.requestID;
        this._userID = data.userID;
        this._createdAt = data.createdAt;
    }
    public get requestID(): string { return this._requestID; }
    public get userID(): string { return this._userID; }
    public get createdAt(): number { return this._createdAt; }
    public set requestID(value: string) {
        if (this._requestID === value) return;
        if (this.toUpdate.requestID === value) return;
        this._requestID = value;
        this.toUpdate.requestID = value;
    }
    public set userID(value: string) {
        if (this._userID === value) return;
        if (this.toUpdate.userID === value) return;
        this._userID = value;
        this.toUpdate.userID = value;
    }
    public set createdAt(value: number) {
        if (this._createdAt === value) return;
        if (this.toUpdate.createdAt === value) return;
        this._createdAt = value;
        this.toUpdate.createdAt = value;
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
        return await this.requestManager.collPostulation.transaction(async (db, collection) => {
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
export namespace Postulation {
    export type publicData = Omit<data, 'auth'>;
    export type data = typeof postulation.infer;
}
export default Postulation;