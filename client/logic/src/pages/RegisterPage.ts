import { Component, Element } from "../WebApp/WebApp.js";
import Language from "../helper/language.js";
import TextInput from "../components/basic.components/TextInput.js";
import Button from "../components/basic.components/Button.js";
import Loading from "../components/basic.components/Loading.js";
import LiveImageInput from "../components/basic.components/LiveImageInput.js";
import Api from "../api/Api.js";
import app, { session } from "../app.js";

export class RegisterPage extends Component<'div', RegisterPage.eventMap> {
    protected component: Element<"div">;
    protected avatar: LiveImageInput;
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
        this.component = Element.new('div', null, { class: 'form-page register-page' });
        this.avatar = new LiveImageInput({
            accept: ['jpeg', 'jpg', 'png'],
            src: '/client/assets/logo.svg',
            class: 'avatar-chooser'
        });
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
                    this.avatar, this.username, this.email, this.password, this.confirmation
                ] }, this.error, submit
            ]
        });
        this.component.append(this.form);
        submit.on('click', () => {
            const password = this.password.getText();
            const confirmation = this.confirmation.getText();
            if (password !== confirmation) return void this.showError(Language.get("page.register.error.password-no-match"));
            this.dispatch('submit', {
                type: 'volunteer',
                avatar: this.avatar.getFile(),
                username: this.username.getText(),
                email: this.email.getText(),
                password: this.password.getText()
            });
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
    public async submit(data: Api.auth.newUser) {
        this.loading(true);
        this.showError();
        const response = await Api.auth.register(data);
        if (!response.success) this.showError(response.reason);
        else {
            session.loadSession(response.result.user);
            app.router.setPage('/app');
        }
        this.loading(false);
    }
}
export namespace RegisterPage {
    type submitEvent = (data: Api.auth.newUser) => void;
    export type eventMap = {
        submit: submitEvent;
    }
}
export default RegisterPage;