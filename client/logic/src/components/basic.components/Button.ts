import { Component, Element } from "../../WebApp/WebApp.js";

export class Button extends Component<'button', Button.eventMap> {
    protected component: Element<"button">;
    protected text: Element<'span'>;
    protected image: Element<'img'>;
    public constructor(text: string, image?: string) { super();
        this.component = Element.new('button', null, { class: 'Button' });
        this.text = Element.new('span', text, { class: 'Button-text' });
        this.image = Element.new('img', null, { class: 'Button-image', src: image || '' });
        this.component.append(this.text);
        
        this.setImage(image);

        this.component.on('click', () => this.dispatch('click'));
        this.component.on('mouseover', () => this.dispatch('hover'));
    }
    public setText(text: string): void {
        this.text.text(text);
    }
    public setImage(image?: string): void {
        this.image.setAttribute('src', image || '');
        if (image) this.image.appendTo(this.component);
        else this.image.remove();
    }
}
export namespace Button {
    export type eventMap = {
        click: () => void
        hover: () => void
    }
}
export default Button;