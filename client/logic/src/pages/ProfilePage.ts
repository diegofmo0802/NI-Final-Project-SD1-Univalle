import { Component, Element } from '../WebApp/WebApp.js';
import Profile from '../components/utilities/Profile.js';
import Api from '../api/Api.js';
import { session } from '../app.js';

export class ProfilePage extends Component<'div'> {
    protected component: Element<'div'>;
    protected profile: Profile | undefined;
    public constructor() { super();
        this.component = Element.new('div', null, { class: 'profile-page' });
    }
    public async load(uuid: string) {
        const user = await Api.user.get(uuid);
        this.profile = new Profile(user, this.isOwner(user));
        this.profile.on('edit', (values) => {
            console.log('[edit]: edited values:', values)
        });
        this.component.clean();
        this.component.append(this.profile);
    }
    protected isOwner(user: Api.user.visible): boolean {
        const loggedUser = session.user;
        if (!loggedUser) return false;
        if (loggedUser._id === user._id) return true;
        if (loggedUser.permissions.admin) return true;
        return false;
    }
}
export namespace ProfilePage {}
export default ProfilePage;