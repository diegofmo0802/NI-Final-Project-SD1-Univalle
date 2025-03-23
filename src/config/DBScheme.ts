import { Schema } from "../DBManager/Manager.js";

export const user = new Schema({
    _id: { type: 'string', required: true, unique: true, minLength: 36, maxLength: 36 },
    profile: { type: 'object', required: true, schema: {
        firstName: { type: 'string', minLength: 2, maxLength: 20 },
        lastName: { type: 'string', minLength: 2, maxLength: 20 },
        username: { type: 'string', required: true, unique: true, minLength: 3, maxLength: 20 },
        email: { type: 'string', required: true, unique: true, minLength: 6, maxLength: 100 }
    } },
    auth: { type: 'object', required: true, schema: {
        verified: { type: 'boolean', required: true, default: false },
        passwordHash: { type: 'string', required: true, minLength: 256, maxLength: 256, },
        passwordSalt: { type: 'string', required: true, minLength: 32, maxLength: 32, }
    } }
});