import Manager from "../DBManager/Manager.js";
import * as Schemas from "./dbScheme.js";

const {
    DB_HOST = 'localhost',
    DB_PORT = '27017',
    DB_USER = 'root',
    DB_PASS = 'root',
    DB_NAME = 'ds1-fp'
} = process.env;

export const client = new Manager({
    host: DB_HOST, port: parseInt(DB_PORT), 
    username: DB_USER, password: DB_PASS
});

export const db = client.dbSession(DB_NAME, Schemas);

await db.operation(async (db) => {
    await db.init(); return true;
});

export default db;
