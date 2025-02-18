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
        `;
    }
}

customElements.define("question-element", Question);

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

            <form action="/login" method="POST" onsubmit="this.getRootNode().host.submitFormData(event)">
                <input type="text" name="username" placeholder="Username" required />
                <input type="submit" value="Login" />
            </form>
        `;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'redirect-url') {
            this.redirectUrl = newValue;
        }
    }

    async submitFormData(event) {
        event.preventDefault();
        console.log("Form data submitted");

        try {
            const formData = new FormData(event.target);
            const response = await fetch(event.target.action, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            console.log(data);

            if (this.redirectUrl) {
                window.location.href = this.redirectUrl;
            }
        } catch (error) {
            console.error(error);
        }
    }
}

customElements.define("login-element", Login);

document.addEventListener("DOMContentLoaded", () => {
    function handlePathSegment() {
        const path = window.location.pathname;
        if (path === "/login") {
            // Code to dynamically change the page to the login page
            document.body.innerHTML = "<h1>Login Page</h1>";
        } else if (path === "/register") {
            // Code to dynamically change the page to the register page
            document.body.innerHTML = "<h1>Register Page</h1>";
        } else {
            // Code for other paths
            document.body.innerHTML = "<h1>Home Page</h1>";
        }
    }

    window.addEventListener("popstate", handlePathSegment);

    // Call the function on initial load
    handlePathSegment();
});

var token = "";

function navigateTo(path) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("popstate"));
}

async function submitFormData(event) {
    console.log("Form data submitted");
    event.preventDefault();

    try {
        const formData = new FormData(event.target);
        const response = await fetch(event.target.action, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}