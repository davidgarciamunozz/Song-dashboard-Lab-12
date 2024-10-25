import './screens/dashboard';
import { addObserver } from './store/store';
import { appState } from './store/store';

class AppContainer extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);
    }

    connectedCallback () {
        // console.log(appState);
        this.render();
    }

    async render (){
        if (this.shadowRoot) {
            // Limpia el contenido antes de renderizar
            this.shadowRoot.innerHTML = '';

                const dashboard = this.ownerDocument.createElement('app-dashboard');
                this.shadowRoot.appendChild(dashboard);

    
    }
}
}

customElements.define('app-container', AppContainer);