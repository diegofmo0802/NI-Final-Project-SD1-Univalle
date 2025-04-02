import Loading from "./components/basic.components/Loading.js";
import App from "./WebApp/WebApp.js";
import Session from "./components/Session.js";

export const app = App.getInstance('#main');
export const loading = new Loading('/client/assets/logo.svg');
export const session = new Session();

export default app;