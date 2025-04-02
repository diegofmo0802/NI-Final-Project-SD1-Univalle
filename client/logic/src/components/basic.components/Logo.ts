import { Component, Element } from "../../WebApp/WebApp.js";

export class Logo extends Component<'button', Logo.eventMap> {
    protected component: Element<"button">;
    protected text: Element<'p'>;
    protected image: Element<'img'>;
    protected url: string | null;
    public constructor(text: string, image: string, url: string | null = null) { super();
        this.url = url;
        this.component = Element.new('button', null, { class: 'Logo' });
        this.image = Element.new('img', null, { class: 'Logo-image', src: image || '' });
        this.text = Element.new('p', text, { class: 'Logo-text' });
        this.component.append(this.image, this.text);

        this.component.on('click', () => this.dispatch('click', this.url));
        this.component.on('mouseover', () => this.dispatch('hover', this.url));
    }
    public setText(text: string): void {
        this.text.text(text);
    }
    public setUrl(url?: string): void {
        this.url = url || null;
    }
    public setImage(image: string): void {
        this.image.setAttribute('src', image);
    }
}
export namespace Logo {
    type callback = (url: string | null) => void
    export type eventMap = {
        click: callback;
        hover: callback;
    }
}
export default Logo;