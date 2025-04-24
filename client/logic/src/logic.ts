import app, { loading, session } from './app.js';
import { components, schema } from './config.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import Api from './api/Api.js';
import UserListPage from './pages/UserListPage.js';
import Auth from './helper/Auth.js';
import App from 'WebApp/WebApp.js';

///@ts-ignore
window.api = Api;

const response = await Api.auth.check();
if (response.success) session.loadSession(response.result.user);
session.on('login', () => app.router.setPage('/app/login'));
session.on('register', () => app.router.setPage('/app/register'));
session.on('option', async (option) => {
    switch(option) {
        case 'logout': {
            const response = await Api.auth.logout();
            if (!response.success) return void alert('fail to log-out');
            session.close();
            app.router.setPage('/app/login'); break;
        }
    }
});

app.renderRoot(...schema);

app.addRender('/app/', () => {
    components.content.clean();
    components.content.append(new HomePage());
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

app.addRender('/app/users', async () => {
    components.content.clean();
    if (!await Auth.checkAuth()) return void app.router.setPage('/app/login');
    const userListPage = new UserListPage();
    userListPage.loadUsers();
    components.content.append(userListPage);
    loading.finish();
});

components.menu.on('home', () => app.router.setPage('/app'));
components.menu.on('users', () => app.router.setPage('/app/users'));

app.init();