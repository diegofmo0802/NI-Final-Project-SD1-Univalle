import Language from "./language.js";
import { Component, Element } from "./WebApp/WebApp.js";
import { Menu } from "./components/Menu.js";

// App language configuration

await Language.load('en');

// App schema configuration
const menu = new Menu();

menu.addButton('home', Language.get('menu.button.home'));
menu.addButton('about', Language.get('menu.button.about'));
menu.addButton('users', Language.get('menu.button.users'));

const content = Element.new('div', null, { id: 'content' });

export const components = { menu, content };
export const schema = [menu, content];