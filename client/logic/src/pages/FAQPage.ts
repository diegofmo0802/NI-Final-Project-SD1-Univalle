import app from "../app.js";
import Api from "../api/Api.js";
import UserList from "../components/utilities/UserList.js";
import { Element, Component } from "../WebApp/WebApp.js";

class FAQPage extends Component<'div'> {
    protected component: Element<'div'>;
    protected devTitle: Element<'h2'>;
    protected faqTitle: Element<'h2'>;
    protected list: Element<'ol'>;
    protected members: UserList;
    
    public constructor() { super();
        this.component = Element.new('div', null, { class: 'faq-page' });
        this.members = new UserList();
        this.devTitle = Element.new('h2', 'Developers');
        this.faqTitle = Element.new('h2', 'FAQ');
        this.list = Element.new('ol');

        const faqs = [
            'Why was the page created? A\\: It was for academic purposes to develop a volunteering app.',
            'How do I apply to be a volunteer in one of the posts? A\\: Create an account and fill in the necessary information (it’s in beta and only requires a username and password).',
            'How can I create a post? A\\: Once the account is created, go to the profile section and click. After clicking, select the "new post" option. Then you will be redirected to a section where you must fill out 3 fields: the first for the title, the second for the description, and the third for the number of volunteers allowed.'
        ];

        faqs.forEach(text => {
            const li = Element.new('li').text(text);
            this.list.append(li);
        });

        this.component.append(this.devTitle, this.members, this.faqTitle, this.list);
        this.members.on('select', (user) => {
            app.router.setPage(`/app/user/${user._id}`);
        });
    }
    public async loadMembers(...uuid: string[]) {
        const members = await Promise.all(uuid.map((uuid) => Api.user.get(uuid)));
        this.members.addUsers(members);
    }
}

export default FAQPage;