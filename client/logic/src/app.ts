import Language from "./helper/language.js";
import Loading from "./components/basic.components/Loading.js";
import App, { Element } from "./WebApp/WebApp.js";
import Session from "./components/Session.js";
import Logo from "./components/basic.components/Logo.js";
import Menu from "./components/Menu.js";
// App language configuration
await Language.load('en');

export const app = App.getInstance('#main');
export const loading = new Loading('/client/assets/logo.svg');
export const session = new Session();
export const menu = new Menu(session, new Logo('DS1 Final', '/client/assets/logo.svg'));
export const content = Element.new('div', null, { id: 'content' });
export const schema = [menu, session];
export const components = { menu, session, content };

menu.addButton('home', Language.get('menu.button.home'));
menu.addButton('about', Language.get('menu.button.about'));
menu.addButton('users', Language.get('menu.button.users'));
menu.addButton('requests', Language.get('menu.button.requests'));

export default app;