import app, { session } from './app.js';
import { components, schema } from './config.js';
import { HomePage } from './components/pages/HomePage.js';
import LoginPage from './components/pages/LoginPage.js';
import RegisterPage from './components/pages/RegisterPage.js';
import Api from './api/Api.js';

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
    form.on('submit', async (username, password) => {
        form.loading(true);
        form.showError();
        const response = await Api.auth.login(username, password);
        if (!response.success) form.showError(response.reason);
        else {
            session.loadSession(response.result.user);
            app.router.setPage('/app');
        }
        form.loading(false);
    });
    components.content.append(form);
});

app.addRender('/app/register', () => {
    components.content.clean();
    const form = new RegisterPage();
    form.on('submit', async (data) => {
        form.loading(true);
        form.showError();
        const response = await Api.auth.register(data);
        if (!response.success) form.showError(response.reason);
        else {
            session.loadSession(response.result.user);
            app.router.setPage('/app');
        }
        form.loading(false);
    });
    components.content.append(form);
});

components.menu.on('home', () => app.router.setPage('/app'));

app.init();