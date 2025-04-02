import app from './app.js';
import { components, schema } from './config.js';
import { HomePage } from './components/pages/home.js';

app.renderRoot(...schema);

app.addRender('/app/', () => {
    components.content.append(new HomePage());
});

components.menu.on('home', () => app.router.setPage('/app'));

app.init();