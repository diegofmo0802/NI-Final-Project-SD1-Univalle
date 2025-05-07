import RequestManager from "../managers/RequestManager/RequestManager.js";
import db from "./dbManager.js";
import { volunteerPostulations } from "./dbScheme.js";

export const postulationCollection = db.collection('volunteerPostulations');
export const requestCollection = db.collection('volunteerRequests');

export const requestManager = new RequestManager(postulationCollection, requestCollection);
export default requestManager;