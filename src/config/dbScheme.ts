import { Schema } from '../DBManager/Manager.js';

export const user = new Schema({
    _id: { type: 'string', required: true, unique: true, minLength: 36, maxLength: 36 },
    profile: { type: 'object', required: true, schema: {
        type: { type: 'string', required: true, enum: ['volunteer', 'foundation'], default: 'volunteer' },
        username: { type: 'string', required: true, unique: true, minLength: 3, maxLength: 20 },
        name:     { type: 'string', nullable: true, default: null, minLength: 3, maxLength: 80 },
        bio:      { type: 'string', nullable: true, default: null, minLength: 10, maxLength: 500 },
        avatar:   { type: 'string', default: '/client/assets/logo.svg' },
        // email:    { type: 'string', required: true, unique: true, minLength: 6, maxLength: 100 },
        phone:    { type: 'string', nullable: true, default: null, minLength: 10, maxLength: 10 },
        address:  { type: 'string', nullable: true, default: null, minLength: 10, maxLength: 200 },
    } },
    email: { type: 'object', required: true, schema: {
        address: { type: 'string', required: true, unique: true, minLength: 6, maxLength: 100 },
        verified: { type: 'boolean', default: false },
        verifyToken: { type: 'string', nullable: true, default: null }
    } },
    auth: { type: 'object', required: true, schema: {
        verified: { type: 'boolean', required: true, default: false },
        verifyToken: { type: 'string', nullable: true },
        passwordHash: { type: 'string', required: true, minLength: 256, maxLength: 256 },
        passwordSalt: { type: 'string', required: true, minLength: 32, maxLength: 32 }
    } },
    config: { type: 'object', required: true, schema: {
        nameVisible: { type: 'boolean', required: true, default: true },
        emailVisible: { type: 'boolean', required: true, default: true },
        phoneVisible: { type: 'boolean', required: true, default: true },
        addressVisible: { type: 'boolean', required: true, default: true },
    } },
    permissions: { type: 'object', required: true, schema: {
        admin: { type: 'boolean', required: true, default: false },
        login: { type: 'boolean', required: true, default: true },
        volunteer: { type: 'boolean', required: true, default: false },
        foundation: { type: 'boolean', required: true, default: false }
    } }
});

export const volunteer = new Schema({
    _id: { type: 'string', required: true, unique: true, minLength: 36, maxLength: 36 },
    profile: { type: 'object', required: true, schema: {
        firstName: { type: 'string', required: true, minLength: 3, maxLength: 80 },
        lastName: { type: 'string', required: true, minLength: 3, maxLength: 80 },
        bio: { type: 'string', required: true, minLength: 10, maxLength: 500 },
        avatar: { type: 'string', nullable: true }
    } },
    contactInfo: { type: 'object', required: true, schema: {
        email: { type: 'string', required: true, unique: true, minLength: 6, maxLength: 100 },
        phone: { type: 'string', required: true, unique: true, minLength: 10, maxLength: 10 }
    } },
});

export const foundation = new Schema({
    _id: { type: 'string', required: true, unique: true, minLength: 36, maxLength: 36 },
    profile: { type: 'object', required: true, schema: {
        name: { type: 'string', required: true, minLength: 3, maxLength: 100 },
        description: { type: 'string', required: true, minLength: 10, maxLength: 500 },
        logo: { type: 'string', nullable: true }
    } },
    contactInfo: { type: 'object', required: true, schema: {
        address: { type: 'string', required: true, minLength: 10, maxLength: 200 },
        email: { type: 'string', required: true, unique: true, minLength: 6, maxLength: 100 },
        phone: { type: 'string', required: true, unique: true, minLength: 10, maxLength: 10 }
    } },
    status: { type: 'string', required: true, enum: ['active', 'inactive'], default: 'active' }
});

export const volunteerRequests = new Schema({
    _id: { type: 'string', required: true, unique: true, minLength: 36, maxLength: 36 },
    title: { type: 'string', required: true, minLength: 3, maxLength: 100 },
    description: { type: 'string', required: true, minLength: 10, maxLength: 1000 },
    volunteerCount: { type: 'number', required: true, min: 1 },
    status: { type: 'string', required: true, enum: ['open', 'closed', 'cancelled'], default: 'open' },
    startDate: { type: 'number', required: true },
    endDate: { type: 'number', required: true }
});

export const volunteerPostulations = new Schema({
    _id: { type: 'string', required: true, unique: true, minLength: 36, maxLength: 36 },
    requestID: { type: 'string', required: true, minLength: 36, maxLength: 36 },
    userID: { type: 'string', required: true, minLength: 36, maxLength: 36 },
    createdAt: { type: 'number' }
});