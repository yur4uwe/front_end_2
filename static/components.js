/**
 * @typedef {{question: string, svg: string, options: Array<string>}} Questions
 */

function navigateTo(path) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("popstate"));
}

class Home extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                h1 {
                    color: var(--main-text-color);
                }
            </style>
            <h1>Home Page</h1>
            <button id="loginButton">Login</button>
            <slot></slot> <!-- Define a slot for children -->
        `;

        this.shadowRoot.getElementById("loginButton").addEventListener("click", () => {
            this.navigateTo('/login');
        });
    }

    navigateTo(path) {
        window.history.pushState({}, "", path);
        window.dispatchEvent(new Event("popstate"));
    }
}

class Question extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    width: calc(100% - 40px);
                    padding: 10px;
                    background-color: var(--main-bg-color);
                    border-radius: 5px;
                    margin: 10px;
                }
                #options {
                    width: 100%;
                    display: flex;
                    align-items: start;
                    flex-direction: column;
                }
                h1 {
                    color: var(--main-text-color);
                }
            </style>
            <slot></slot> <!-- Define a slot for children -->
        `;
    }
}

customElements.define("question-element", Question);
customElements.define("home-element", Home);
