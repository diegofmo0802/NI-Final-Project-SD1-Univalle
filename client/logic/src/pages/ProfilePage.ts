import { Component, Element } from '../WebApp/WebApp.js';
import Profile from '../components/utilities/Profile.js';
import Api from '../api/Api.js';
import app, { session } from '../app.js';
import RequestListPage from './RequestListPage.js';
import Auth from '../helper/Auth.js';

export class ProfilePage extends Component<'div'> {
    protected component: Element<'div'>;
    protected profile: Profile | undefined;
    protected requestList: RequestListPage;
    public constructor() { super();
        this.component = Element.new('div', null, { class: 'profile-page' });
        this.requestList = new RequestListPage();
    }
    public async load(uuid: string): Promise<Profile> {
        const user = await Api.user.get(uuid);
        this.profile = new Profile(user, this.isOwner(user));
        this.requestList.user = user._id;
        this.requestList.loadRequests();
        this.profile.on('edit', async (values, editComponent) => {
            console.log(values);
            try {
                if (!await Auth.checkAuth()) return void app.router.setPage('/app/login');
                const user = await Api.user.edit(uuid, {
                    username: values.username,
                    name: values.name,
                    bio: values.biography,
                    avatar: values.avatar,
                    // email: values.email || undefined,
                    // phone: values.phone || undefined,
                    // address: values.address || undefined,
                });
                if (session.user?._id === user._id) session.loadSession(user);
                if (this.profile) {
                    this.profile.user = user;
                    editComponent.getComponent().replaceWith(this.profile);
                }
            } catch (error) {
                editComponent.error = error as string;
            }
        });
        this.component.clean();
        this.component.append(this.profile, this.requestList);
        return this.profile;
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