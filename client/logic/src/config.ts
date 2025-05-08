import Language from "./helper/language.js";
import { Element } from "./WebApp/WebApp.js";
import { Menu } from "./components/Menu.js";
import { session } from "./app.js";
import Logo from "./components/basic.components/Logo.js";
//@ts-ignore
window.l = Language

// App language configuration

await Language.load('en');

// App schema configuration
const menu = new Menu(session, new Logo('DS1 Final', '/client/assets/logo.svg'));

menu.addButton('home', Language.get('menu.button.home'));
menu.addButton('about', Language.get('menu.button.about'));
menu.addButton('users', Language.get('menu.button.users'));
menu.addButton('requests', Language.get('menu.button.requests'));

const content = Element.new('div', null, { id: 'content' });

export const components = { menu, content };
export const schema = [menu, content];