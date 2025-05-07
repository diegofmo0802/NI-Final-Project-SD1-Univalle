import { Component, Element } from '../WebApp/WebApp.js';
import RequestList from '../components/utilities/RequestList.js';
import app from '../app.js';
import Api from '../api/Api.js';

export class RequestListPage extends Component<'div'> {
    protected component: Element<'div'>;
    public requestList: RequestList;
    public constructor(
        protected userID: string | null = null,
        protected page: number = 1,
        protected limit: number = 10)
    { super();
        this.requestList = new RequestList;
        this.component = Element.new('div', null, { class: 'requestList-page' }).append(this.requestList);
        this.requestList.on('select', async (user) => {
            app.router.setPage(`/app/request/${user._id}`);
        });
        this.requestList.on('end', async () => {
            await this.loadRequests();
        });
    }
    public get user(): string | null { return this.userID }
    public set user(userID: string | null) {
        this.userID = userID;
        this.page = 1;
    }
    public async loadRequests() {
        this.requestList.showLoading(true);
        try {
            const response = this.userID === null
                ? await Api.request.getAll(this.page, this.limit)
                : await Api.request.getAllByUserID(this.userID, this.page, this.limit);
            if (response.requests.length > 0) {
                console.log('[gallery]: adding requests from page:', this.page, 'limit:', this.limit);
                await this.requestList.addRequests(response.requests);
                this.page ++;
                if (response.requests.length < this.limit) {
                    this.requestList.showLoading(false);
                    this.requestList.showEndMessage();
                } else {
                    this.requestList.useOnceEndDispatcher();
                    this.requestList.showLoading(false);
                }
            } else {
                this.requestList.showEndMessage();
                this.requestList.showLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    }
}
export namespace RequestListPage {}
export default RequestListPage;