import { Element, Component, Utilities } from "../../WebApp/WebApp.js";
import LiveImageInput from "../basic.components/LiveImageInput.js";
import TextInput from "../basic.components/TextInput.js";
import Button from "../basic.components/Button.js";
import Language from "../../helper/language.js";
import Api from "../../api/Api.js";

export class EditProfile extends Component<'div', EditProfile.eventMap> {
    protected component: Element<"div">;
    protected user: Api.user.visible;
    protected avatar: LiveImageInput;
    protected name: TextInput;
    protected biography: TextInput;
    protected username: TextInput;
    protected role: Element<"span">;;
    protected options: Element<"div">;
    public constructor(user: Api.user.visible) { super();
        this.user = user;
        this.component = Element.new('div').setAttribute('class', 'profile edit-profile');
        this.avatar = new LiveImageInput({ class: 'profile-avatar'});
        this.name = new TextInput({ class: 'profile-name', placeholder: Language.get('label.input.name') });
        this.biography = new TextInput({ type: 'textarea', class: 'profile-biography', placeholder: Language.get('label.input.biography') });
        this.username = new TextInput({ class: 'profile-username', placeholder: Language.get('label.input.username') });
        this.role = Element.new('span').setAttribute('class', 'profile-role');
        this.options = Element.new('div').setAttribute('class', 'profile-options');
        const save = new Button(Language.get('label.button.save'), { class: 'save-button' });
        const cancel = new Button(Language.get('label.button.cancel'), { class: 'cancel-button' });
        this.options.append(save, cancel);
        this.component.append(this.avatar, this.name, this.biography, this.username, this.role, this.options);
        save.on('click', () => this.dispatch('save', this.getValues()));
        cancel.on('click', () => this.dispatch('cancel'));
        this.loadInfo(user);
    }
    public loadInfo(user: Api.user.visible) {
        this.avatar.src = user.profile.avatar;
        this.name.value = user.profile.name ?? '';
        this.biography.value = user.profile.bio ?? '';
        this.username.value = user.profile.username ?? '';
        this.role.text(`${Language.get('profile.role-label')} ${user.profile.type ?? 'none'}`);
    }
    protected getValues() {
        const values: EditProfile.Values = {};
        if (this.avatar.getFile()) values.avatar = this.avatar.getFile();
        if (this.name.value !== this.user.profile.name) values.name = this.name.value;
        if (this.biography.value !== this.user.profile.bio) values.biography = this.biography.value;
        if (this.username.value !== this.user.profile.username) values.username = this.username.value;
        return values;
    }
}

export namespace EditProfile {
    export interface Values {
        avatar?: File;
        name?: string;
        biography?: string;
        username?: string;
    }
    export type SaveListener = (values: Values) => void;
    export type CancelListener = () => void;
    export type eventMap = {
        'save': SaveListener;
        'cancel': CancelListener;
    };
}

export default EditProfile;