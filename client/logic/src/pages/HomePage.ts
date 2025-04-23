import { Component, Element } from "../WebApp/WebApp.js";
import Language from "../helper/language.js";
import BasicCard from "../components/utilities/BasicCard.js";

export class HomePage extends Component<'div'> {
    protected component: Element<"div">;
    public constructor() { super();
        this.component = Element.new('div', null, { class: 'home-page' }).append(
            new BasicCard(
                Language.get('page.home.welcome-title'),
                Language.get('page.home.welcome-message'),
                '/client/assets/logo.svg'
            )
        );
    }
}