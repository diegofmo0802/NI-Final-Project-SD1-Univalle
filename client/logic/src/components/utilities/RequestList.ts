import Language from '../../helper/language.js';
import Api from '../../api/Api.js';
import { Element, Component, Utilities } from '../../WebApp/WebApp.js';
import Loading from '../basic.components/Loading.js';

export class RequestList extends Component<'div', RequestList.EventMap> {
    protected component: Element<'div'>;
    protected RequestList: Element<'div'>;
    protected loading: Loading;
    protected endMessage: Element<'div'>;
    protected userElements: Element<'div'>[] = [];
    protected requests: Api.request.data[] = [];
    public constructor(requests: Api.request.data[] = []) { super()
        this.loading = new Loading('/client/src/logo.png');
        this.endMessage =  Element.structure({type: 'div', attribs: { class: 'request endMessage' }, childs: [
            { type: 'p', text: Language.get('request-list.end'), attribs: { class: 'endMessage-text' } }
        ] });
        this.RequestList = Element.new('div').setAttribute('class', 'requests');
        this.component = Element.new('div').setAttribute('class', 'requestList');
        this.component.append(this.RequestList);//@ts-ignore
    }
    public useOnceEndDispatcher = Utilities.debounce((): void => {
        if (this.userElements.length === 0) return;
        const finalPostElement = this.userElements[this.userElements.length - 1];
        const endHandler = () => {
            this.dispatch('end');
        };
        finalPostElement.observer.offOnce('visible', endHandler);
        finalPostElement.observer.once('visible', endHandler);
    }, 1000);
    public async addRequests(requests: Api.request.data[], checkToContinue: boolean = false): Promise<void> {
        this.requests.push(...requests);
        const childs = requests.map(this.newRequest.bind(this));
        this.userElements.push(...childs);
        if (!checkToContinue) {
            this.RequestList.append(...childs); return;
        } 
        await Promise.all(childs.map((child) => {
            return new Promise<void>((resolve) => {
                child.observer.on('add', () => resolve());
                this.RequestList.append(child);
            });
        }));
    }
    protected newRequest(request: Api.request.data): Element<'div'> {
        let element = Element.structure({type: 'div', attribs: { class: 'request' }, childs: [
            { type: 'div', attribs: { class: 'info', }, childs: [
                { type: 'h2', attribs: { class: 'title' },  text: `${request.title }` },
                { type: 'p', attribs: {class: 'description' }, text: `${request.description}` },
                { type: 'p', attribs: {class: 'count' }, text: `${Language.get('request-list.label.count')}: ${request.volunteerCount}` }
            ]}
        ] });
        element.on('click', () => {
            if (element === this.endMessage) return;
            this.dispatch('select', request);
        });
        return element;
    }
    /**
     * Show or hide the end message.
     * @param show If true, the end message will be shown.
     */
    public showEndMessage(show: boolean = true): void {
        if (show) this.endMessage.appendTo(this.RequestList);
        else this.endMessage.remove();
    }
    /**
     * Show or hide the loading message.
     * @param show If true, the loading message will be shown.
     */
    public showLoading(show: boolean = true): void {
        if (!show) return this.loading.finish();
        this.loading.spawn(this.RequestList)
    }
    /**
     * Clean the component.
     */
    public clean(): void { this.RequestList.clean(); }
}

export namespace RequestList {
    export type EventMap = {
        select: (request: Api.request.data) => void;
        end: () => void;
    }
}
export default RequestList;