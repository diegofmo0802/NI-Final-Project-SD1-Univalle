import { Component, Element } from "../WebApp/WebApp.js";
import Language from "../helper/language.js";
import TextInput from "../components/basic.components/TextInput.js";
import Button from "../components/basic.components/Button.js";
import Loading from "../components/basic.components/Loading.js";
import Api from "../api/Api.js";
import app, { session } from "../app.js";

export class LoginPage extends Component<'div', LoginPage.eventMap> {
    protected component: Element<"div">;
    protected username: TextInput;
    protected password: TextInput;
    protected error: Element<'p'>;
    protected loadingComponent: Loading;
    protected form: Element<'div'>;
    public constructor() { super();
        const submit = new Button(Language.get('page.login.submit-button'));
        this.loadingComponent = new Loading('/client/assets/logo.svg');
        this.component = Element.new('div', null, { class: 'form-page login-page' });
        this.username = new TextInput({
            placeholder: Language.get('page.login.username-label'),
        });
        this.password = new TextInput({
            placeholder: Language.get('page.login.password-label'),
            type: 'password',
        });
        this.error = Element.new('p', null, { class: 'form-error' });
        this.form = Element.structure({
            type: 'div', attribs: { class: 'form login-form' }, childs: [
                { type: 'h2', text: Language.get('page.login.title') },
                { type: 'div', attribs: { class: 'form-fields' }, childs: [
                    this.username, this.password,
                ] }, this.error, submit
            ]
        });
        this.component.append(this.form);
        submit.on('click', () => {
            this.dispatch('submit', this.username.getText(), this.password.getText());            
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
    public async submit(username: string, password: string) {
        this.loading(true);
        this.showError();
        const response = await Api.auth.login(username, password);
        if (!response.success) this.showError(response.reason);
        else {
            session.loadSession(response.result.user);
            app.router.setPage('/app');
        }
        this.loading(false);
    }
}
export namespace LoginPage {
    export type submitEvent = (username: string, password: string) => void;
    export type eventMap = {
        submit: submitEvent
    }
}
export default LoginPage