import { Component, Element } from "../WebApp/WebApp.js";

export class Menu extends Component<'nav'> {
    protected component: Element<"nav">;
    public buttons: Element<"button">[] = [];
    public constructor() { super();
        this.component = Element.new('nav', null, { id: 'menu' });
    }
    public addButton(eventName: string, text: string): Element<'button'> {
        const button = Element.new('button', text);
        button.on('click', (event) => this.dispatch(eventName, event));
        this.buttons.push(button);
        this.component.append(button);
        return button;
    }
    public clean(): void {
        this.buttons = [];
        this.component.clean();
    }
}