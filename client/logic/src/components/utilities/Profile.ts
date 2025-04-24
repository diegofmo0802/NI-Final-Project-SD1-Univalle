import { Element, Events, Component } from "../../WebApp/WebApp.js";
import Share from "./Share.js";
import Button from "../basic.components/Button.js";
import Language from "../../helper/language.js";
import Api from "../../api/Api.js";
import EditProfile from "./EditProfile.js";

class Profile extends Component<'div', Profile.eventMap> {
    protected component: Element<"div">;
    protected _user: Api.user.visible;
    protected _owner: boolean;
    protected avatar: Element<"img">;
    protected name: Element<"h1">;
    protected biography: Element<"p">;
    protected username: Element<"span">;
    protected role: Element<"span">;
    protected options: Element<"div">;
    public constructor(user: Api.user.visible, owner: boolean = false) { super();
        this._user = user;
        this._owner = owner;
        this.component = Element.new('div').setAttribute('class', 'profile');
        this.avatar = Element.new('img').setAttribute('class', 'profile-avatar');
        this.name = Element.new('h1').setAttribute('class', 'profile-name');
        this.biography = Element.new('p').setAttribute('class', 'profile-biography');
        this.username = Element.new('span').setAttribute('class', 'profile-username');
        this.role = Element.new('span').setAttribute('class', 'profile-role');
        this.options = Element.new('div').setAttribute('class', 'profile-options');
        this.component.append(this.avatar, this.name, this.biography, this.username, this.role, this.options);

        this.component.observer.on('add', () => this.refreshEllipsis());
        this.loadInfo(); this.loadOptions();
    }
    public get user(): Api.user.visible { return this._user; }
    public set user(user: Api.user.visible) {
        if (this._user === user) return;
        this._user = user;
        this.loadInfo();
    }
    public get owner(): boolean { return this._owner; }
    public set owner(owner: boolean) {
        if (this._owner === owner) return;
        this._owner = owner;
        this.loadOptions();
    }
    protected loadInfo(user: Api.user.visible = this._user) {
        this.avatar.setAttribute('src', user.profile.avatar ?? '/client/assets/logo.svg');
        this.name.text(user.profile.name ?? user.profile.username);
        this.biography.text(user.profile.bio ?? '');
        this.username.text(`${Language.get('profile.username-label')} ${user.profile.username ?? 'user'}`);
        this.role.text(`${Language.get('profile.role-label')} ${user.profile.type ?? 'none'}`);
        this.refreshEllipsis();
    }
    protected loadOptions() {
        this.options.clean();
        const share = new Button(Language.get('label.button.share-profile'), { class: 'share-button' });
        const edit = new Button(Language.get('label.button.edit-profile'));
        share.on('click', () => this.share());
        edit.on('click', () => this.edit());
        this.options.append(share);
        if (this._owner) this.options.append(edit);
    }
    public share() {
        if (!this._user) return;
        const url = `https://mysaml.com/app/user/${this._user._id}`;
        const share = new Share(url);
        share.show();
        this.component.append(share);
    }
    protected edit() {
        if (!this._user) return;
        const editProfile = new EditProfile(this._user);
        editProfile.on('save', (values) => this.dispatch('edit', values));
        editProfile.on('cancel', () => {
            editProfile.getComponent().replaceWith(this.component);
        });
        this.component.replaceWith(editProfile.getComponent());
    }
    protected checkOverflow(element: Element<any>) {
        return (
            element.scrollHeight > element.clientHeight
            || element.scrollWidth > element.clientWidth
        );
    }
    protected refreshEllipsis() {
        if (this.checkOverflow(this.biography)) this.component.setAttribute('bio-ellipsis', 'true');
        else this.component.removeAttribute('bio-ellipsis');
    }
}
export namespace Profile {
    export type Options = 'config';
    export type OptionEventListener = (option: Options, user: Api.user.visible) => void;
    export type eventMap = {
        'edit': EditProfile.SaveListener;
        'option': OptionEventListener;
    };
}

export default Profile;