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

        if (!response.ok) {
            return alert(data.message);
        }

        const testResponse = await fetch("/test");
        const testData = await testResponse.json();
        localStorage.setItem("testData", JSON.stringify(testData));
        localStorage.setItem("answers", JSON.stringify(Array(testData.length).fill(null)));
        localStorage.setItem("username", formData.get("username"));

        navigateTo("/test");
    } catch (error) {
        console.error(error);
    }
}

function navigateTo(path) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("popstate"));
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
                    background-color: var(--main-bg-color);
                    border-radius: 5px;
                    margin: 10px;
                }

                input {
                    padding: 10px;
                    margin: 10px;
                }
                
                input[type="submit"] {
                    background-color: var(--button-bg-color);
                    color: var(--button-text-color);
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
                }

                input[type="submit"]:hover {
                    background-color: var(--button-hover-bg-color);
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

customElements.define('login-component', Login);