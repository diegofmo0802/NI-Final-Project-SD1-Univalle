import app, { loading, session } from './app.js';
import { components, schema } from './config.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import Api from './api/Api.js';
import UserListPage from './pages/UserListPage.js';
import Auth from './helper/Auth.js';
import ProfilePage from './pages/ProfilePage.js';
import RequestListPage from './pages/RequestListPage.js';
import NewRequestPage from './pages/NewRequestPage.js';
import FAQPage from './pages/FAQPage.js';

///@ts-ignore
window.api = Api;

const response = await Api.auth.check();
if (response.success) session.loadSession(response.result.user);
session.on('login', () => app.router.setPage('/app/login'));
session.on('register', () => app.router.setPage('/app/register'));
session.on('option', async (option) => {
    switch(option) {
        case 'profile': {
            if (session.user) app.router.setPage(`/app/user/${session.user._id}`);
            else app.router.setPage('/app/login'); break;
        }
        case 'newPost': {
            app.router.setPage('/app/new-requests'); break;
        }
        case 'logout': {
            const response = await Api.auth.logout();
            if (!response.success) return void alert('fail to log-out');
            session.close();
            app.router.setPage('/app/login'); break;
        }
    }
});

app.renderRoot(...schema);

app.addRender('/', () => {
    components.content.clean();
    components.content.append(new HomePage());
});
app.addRender('/app/', () => {
    components.content.clean();
    components.content.append(new HomePage());
});
app.addRender('/app/about', () => {
    components.content.clean();
    const faqPage = new FAQPage();
    faqPage.loadMembers(
        '3f432f27-2a49-4447-b9a3-51a93f76dd66',
        '740dd446-9d0e-4472-abd6-cc0c6b0fdb27',
        '902acb41-e9bf-4ea6-b21b-99cbfc3532fd',
        '8f0e6dd6-4711-4ef9-b57f-d15ddcf9ec49'
    );
    components.content.append(faqPage);
});

app.addRender('/app/login', () => {
    components.content.clean();
    const form = new LoginPage();
    form.on('submit', async (username, password) => form.submit(username, password));
    components.content.append(form);
});

app.addRender('/app/register', () => {
    components.content.clean();
    const form = new RegisterPage();
    form.on('submit', async (data) => form.submit(data));
    components.content.append(form);
});

app.addRender('/app/user', async () => {
    components.content.clean();
    if (!await Auth.checkAuth()) return void app.router.setPage('/app/login');
    const userListPage = new UserListPage();
    userListPage.loadUsers();
    components.content.append(userListPage);
});

app.addRender('/app/user/$uuid', async ({ uuid }) => {
    components.content.clean();
    if (!uuid) return void app.router.setPage('/app/user');
    // if (!await Auth.checkAuth()) return void app.router.setPage('/app/login');
    const profile = new ProfilePage();
    await profile.load(uuid);
    components.content.append(profile);
});

app.addRender('/app/new-requests', async () => {
    components.content.clean();
    if (!await Auth.checkAuth() || !session.user) return void app.router.setPage('/app/login');
    const newRequestPage = new NewRequestPage(session.user._id);
    newRequestPage.on('submit', newRequestPage.submit.bind(newRequestPage));
    components.content.append(newRequestPage);
});

app.addRender('/app/requests', async () => {
    components.content.clean();
    const requestListPage = new RequestListPage();
    requestListPage.loadRequests();
    components.content.append(requestListPage);
});

components.menu.on('home', () => app.router.setPage('/app'));
components.menu.on('about', () => app.router.setPage('/app/about'));
components.menu.on('users', () => app.router.setPage('/app/user'));
components.menu.on('requests', () => app.router.setPage('/app/requests'));

app.init();