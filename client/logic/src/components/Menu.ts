import { Component, Element } from "../WebApp/WebApp.js";
import Button from "./basic.components/Button.js";
import Logo from "./basic.components/Logo.js";
import Session from "./Session.js";

export class Menu extends Component<'nav'> {
    protected component: Element<"nav">;
    protected buttons: Button[] = [];
    protected options: Element<'div'>;
    public constructor(
        public readonly session: Session,
        public readonly logo: Logo
    ) { super();
        const sessionContainer = Element.new('div', null, { id: 'session' });
        this.options = Element.new('div', null, { id: 'menu-options' });
        this.component = Element.new('nav', null, { id: 'menu' });

        sessionContainer.append(session);
        this.component.append(this.logo, this.options, sessionContainer);
    }
    public addButton(eventName: string, text: string): Button {
        const button = new Button(text);
        button.on('click', () => this.dispatch(eventName));
        this.buttons.push(button);
        this.options.append(button);
        return button;
    }
    public clean(): void {
        this.buttons = [];
        this.options.clean();
    }
}