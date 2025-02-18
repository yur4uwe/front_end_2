async function submitFormData(event) {
    console.log("Form data submitted");
    event.preventDefault();

    try {
        const formData = new FormData(event.target);
        const response = await fetch(event.target.action, {
            method: event.target.method,
            body: formData,
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            console.log("Login successful, redirecting to test page: ",
                event.target.getRootNode().host.redirectUrl);
            navigateTo("/test");
        }
    } catch (error) {
        console.error(error);
    }
}


function navigateTo(path) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("popstate"));
}

class Question extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                h1 {
                    color: red;
                }
            </style>
            <h1>Hello World</h1>
            <slot></slot> <!-- Define a slot for children -->
        `;
    }
}

class Login extends HTMLElement {
    static get observedAttributes() {
        return ['redirect-url'];
    }

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
                    width: 100%;
                    padding: 10px;
                    background-color: lightgray;
                    border-radius: 5px;
                    margin: 10px;
                }

                input {
                    padding: 10px;
                    margin: 10px;
                }
                
                input[type="submit"] {
                    background-color: green;
                    color: white;
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
                }

                input[type="submit"]:hover {
                    background-color: darkgreen;
                }
            </style>
            <h1>Login Page</h1>

            <form id="loginForm" action="/login" method="POST">
                <input type="text" name="username" placeholder="Username" required />
                <input type="submit" value="Login" />
            </form>
            `;
        this.shadowRoot.getElementById("loginForm").addEventListener("submit", submitFormData);
    }

    /**
     * @param {string} name - Name of the attribute
     * @param {string} oldValue - Old value of the attribute
     * @param {string} newValue - New value of the attribute
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'redirect-url') {
            this.redirectUrl = newValue;
        }
    }
}

class QuestionList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                h1 {
                    color: blue;
                }
            </style>
            <h1>Question List</h1>
            <slot></slot> <!-- Define a slot for children -->
        `;
    }
}

class Home extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                h1 {
                    color: green;
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

customElements.define("question-element", Question);
customElements.define("login-element", Login);
customElements.define("question-list", QuestionList);
customElements.define("home-element", Home);