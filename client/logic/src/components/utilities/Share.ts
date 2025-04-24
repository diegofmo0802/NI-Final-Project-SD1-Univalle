import { Element, Events, Component } from "../../WebApp/WebApp.js";
import QRGenerator from "../basic.components/QRGenerator.js";
import { loading } from "../../app.js";

class Share extends Component<'div'> {
    protected component: Element<"div">;
    protected qr: QRGenerator;
    protected text: Element<"p">;
    public constructor(
        protected data: string
    ) { super();
        this.component = Element.new('div').setAttribute('class', 'share');
        this.qr = new QRGenerator({ class: 'qr-code' });
        this.text = Element.new('p').setAttribute('class', 'url-text');
        const close = Element.new('button').setAttribute('class', 'close');
        this.component.append(close, this.qr, this.text);
        close.on('click', () => this.component.remove());
    }
    public show(icon?: string) {
        loading.spawn(this.component);
        this.text.text(this.data);
        this.qr.generate(this.data, {
            correctionLevel: 'H',
            style: {
                size: 1280,
                icon: icon ?? '/client/assets/logo.svg',
                background: {
                    type: 'radial',
                    colors: ['#FFFFFF', '#FFB4DC'],
                    percentages: [75, 100],
                    cx: 50, cy: 50, r: 50
                },
                inactiveModule: {
                    type: 'radial',
                    colors: ['#FFFFFF', '#FFB4DC'],
                    percentages: [75, 100],
                    cx: 50, cy: 50, r: 50
                },
                moduleMargin: '10%',
                moduleRadius: '50%'
            }
        }).finally(() => loading.finish());
    }
}
export namespace Share {

}
export default Share;