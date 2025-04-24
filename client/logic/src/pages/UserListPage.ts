import { Component, Element } from '../WebApp/WebApp.js';
import UserList from '../components/utilities/UserList.js';
import app from '../app.js';
import Api from '../api/Api.js';

export class UserListPage extends Component<'div'> {
    protected component: Element<'div'>;
    public userList: UserList;
    public constructor(
        protected page: number = 1,
        protected limit: number = 10)
    { super();
        this.userList = new UserList;
        this.component = Element.new('div', null, { class: 'userList-page' }).append(this.userList);
        this.userList.on('select', async (user) => {
            app.router.setPage(`/app/user/${user._id}`);
        });
        this.userList.on('end', async () => {
            await this.loadUsers();
        });
    }
    public async loadUsers() {
        this.userList.showLoading(true);
        try {
            const response = await Api.user.getAll(this.page, this.limit);
            if (response.users.length > 0) {
                console.log('[gallery]: adding users from page:', this.page, 'limit:', this.limit);
                await this.userList.addUsers(response.users);
                this.page ++;
                if (response.users.length < this.limit) {
                    this.userList.showLoading(false);
                    this.userList.showEndMessage();
                } else {
                    this.userList.useOnceEndDispatcher();
                    this.userList.showLoading(false);
                }
            } else {
                this.userList.showEndMessage();
                this.userList.showLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    }
}
export namespace UserListPage {}
export default UserListPage;