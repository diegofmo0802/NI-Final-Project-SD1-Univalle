import { Component, Element } from "../../WebApp/WebApp.js";
import Language from "../../language.js";
import TextInput from "../basic.components/TextInput.js";
import Button from "../basic.components/Button.js";
import Loading from "../basic.components/Loading.js";

export class RegisterPage extends Component<'div', RegisterPage.eventMap> {
    protected component: Element<"div">;
    protected username: TextInput;
    protected email: TextInput;
    protected password: TextInput;
    protected confirmation: TextInput;
    protected error: Element<'p'>;
    protected loadingComponent: Loading;
    protected form: Element<'div'>;
    public constructor() { super();
        const submit = new Button(Language.get('page.register.submit-button'));
        this.loadingComponent = new Loading('/client/assets/logo.svg');
        this.component = Element.new('div', null, { class: 'login-page' });
        this.username = new TextInput({
            placeholder: Language.get('page.register.username-label'),
        });
        this.email = new TextInput({
            placeholder: Language.get('page.register.email-label'),
            type: 'email'
        });
        this.password = new TextInput({
            placeholder: Language.get('page.register.password-label'),
            type: 'password',
        });
        this.confirmation = new TextInput({
            placeholder: Language.get('page.register.confirm-password-label'),
            type: 'password',
        });
        this.error = Element.new('p', null, { class: 'form-error' });
        this.form = Element.structure({
            type: 'div', attribs: { class: 'form login-form' }, childs: [
                { type: 'h2', text: Language.get('page.register.title') },
                { type: 'div', attribs: { class: 'form-fields' }, childs: [
                    this.username, this.email, this.password, this.confirmation
                ] }, this.error, submit
            ]
        });
        this.component.append(this.form);
        submit.on('click', () => {
            const password = this.password.getText();
            const confirmation = this.confirmation.getText();
            if (password !== confirmation) return void this.showError(Language.get("page.register.error.password-no-match"));
            this.dispatch('submit', this.username.getText(), this.email.getText(), this.password.getText());
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
}
export namespace RegisterPage {
    type submitEvent = (username: string, email: string, password: string) => void;
    export type eventMap = {
        submit: submitEvent;
    }
}
export default RegisterPage;