import WebApp from './WebApp/WebApp.js';
import { components, schema } from './config.js';

import { HomePage } from './components/pages/home.js';

const app = WebApp.getInstance('#main');
app.renderRoot(...schema);


app.addRender('/app/', () => {
    components.content.append(new HomePage());
});

components.menu.on('home', () => app.router.setPage('/app'));

app.init();