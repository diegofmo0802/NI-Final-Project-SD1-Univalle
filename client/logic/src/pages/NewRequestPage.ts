import { Component, Element } from "../WebApp/WebApp.js";
import Language from "../helper/language.js";
import TextInput from "../components/basic.components/TextInput.js";
import Button from "../components/basic.components/Button.js";
import Loading from "../components/basic.components/Loading.js";
import Api from "../api/Api.js";
import app, { session } from "../app.js";

export class NewRequestPage extends Component<'div', NewRequestPage.eventMap> {
    protected component: Element<"div">;
    protected title: TextInput;
    protected description: TextInput;
    protected count: TextInput;
    protected error: Element<'p'>;
    protected loadingComponent: Loading;
    protected form: Element<'div'>;
    public constructor(
        protected userID: string,
    ) { super();
        const submit = new Button(Language.get('page.login.submit-button'));
        this.loadingComponent = new Loading('/client/assets/logo.svg');
        this.component = Element.new('div', null, { class: 'form-page login-page' });
        this.title = new TextInput({
            placeholder: Language.get('page.new-request.title-label'),
        });
        this.description = new TextInput({
            placeholder: Language.get('page.new-request.description-label'),
            type: 'textarea'
        });
        this.count = new TextInput({
            placeholder: Language.get('page.new-request.count-label'),
        });
        this.error = Element.new('p', null, { class: 'form-error' });
        this.form = Element.structure({
            type: 'div', attribs: { class: 'form login-form' }, childs: [
                { type: 'h2', text: Language.get('page.new-request.title') },
                { type: 'div', attribs: { class: 'form-fields' }, childs: [
                    this.title, this.description, this.count
                ] }, this.error, submit
            ]
        });
        this.component.append(this.form);
        submit.on('click', () => {
            const count = parseInt(this.count.value);
            if (isNaN(count)) return this.showError(Language.get('page.new-request.count-error'));
            this.dispatch('submit', this.title.value, this.description.value, count);            
        });
    }
    public showError(message?: string) {
        if (message) this.error.text(message);
        else this.error.text('');
    }
    public loading(loading: boolean) {
        if (loading) this.loadingComponent.spawn(this.form);
        else this.loadingComponent.finish();
    }
    public async submit(title: string, description: string, count: number) {
        this.loading(true);
        this.showError();
        const response = await Api.request.create(this.userID, {
            title, description, count
        });
        if (!response.success) this.showError(response.reason);
        app.router.setPage('/app/user/' + this.userID);
        this.loading(false);
    }
}
export namespace NewRequestPage {
    export type submitEvent = (title: string, description: string, count: number) => void;
    export type eventMap = {
        submit: submitEvent
    }
}
export default NewRequestPage