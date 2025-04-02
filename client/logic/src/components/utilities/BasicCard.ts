import { Component, Element } from "../../WebApp/WebApp.js";

export class BasicCard extends Component<'div'> {
    protected component: Element<"div">;
    constructor(title?: string, message?: string, image?: string) { super();
        this.component = Element.structure({ type: 'div', attribs: { class: 'basic-card' }, childs: [
            { type: 'div', attribs: { class: 'card-content' }, childs: [
                { type: 'h1', text: title || '', attribs: { class: 'card-tittle' } },
                { type: 'p', text: message || '', attribs: { class: 'card-message' } },
            ] },
            { type: 'img', attribs: { class: 'card-image', src: image || '' } }
        ] });
    }
}
export default BasicCard;