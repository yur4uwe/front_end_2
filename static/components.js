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
                h1 {
                    color: var(--main-text-color);
                }
            </style>
            <slot></slot> <!-- Define a slot for children -->
        `;
    }
}

/**
 * @param {string[]} options - Options for the question
 * @returns {string} HTML string of the options
 */
function parseQuestionOptions(options) {
    return options.map((option, index) => `<input type="radio" name="option" value="${index}">${option}<br>`).join("");
}

class Test extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        /**
         * @type {Array<Questions>} - Get the test data from local storage
         */
        const test = JSON.parse(localStorage.getItem("testData"));
        console.log(test);

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }
                h1 {
                    color: var(--main-text-color);
                }
            </style>
            <h1>Test Page</h1>
            <question-list questions="${test.length}"></question-list>
            <div id="testContainer"></div>
            <slot></slot> <!-- Define a slot for children -->
        `;

        this.currentIndex = 0;
        const question = test[this.currentIndex];
        this.renderQuestion(this.currentIndex, question, test.length);

        // Listen for the custom event to change the question
        this.shadowRoot.querySelector("question-list").addEventListener("questionSelected", (event) => {
            const index = event.detail.index;
            const move = event.detail.move;

            if (index !== -1) {
                this.changeQuestion(index);
            }

            if (move !== 0) {
                this.changeQuestion(this.currentIndex + move);
            }
        });
    }

    /**
     * @param {number} index 
     */
    changeQuestion(index) {
        const test = JSON.parse(localStorage.getItem("testData"));

        if (index < 0) {
            index = test.length - 1;
        } else if (index >= test.length) {
            index = 0;
        }

        const question = test[index];
        this.currentIndex = index;
        this.renderQuestion(index, question, test.length);
    }

    /**
     * @param {number} index 
     * @param {Questions} question 
     * @param {number} questionLength
     */
    renderQuestion(index, question, questionLength) {
        const testContainer = this.shadowRoot.getElementById("testContainer");
        testContainer.innerHTML = "";

        const questionElement = document.createElement("question-element");

        questionElement.innerHTML = `<div id="question">${question.question}</div>
            ${question.svg}
            <div id="options">${parseQuestionOptions(question.options)}</div>`;

        testContainer.appendChild(questionElement);

        // Add event listener to save selected value to localStorage
        this.shadowRoot.querySelectorAll('input[name="option"]').forEach((input) => {
            input.addEventListener('change', (event) => {
                const selectedValue = event.target.value;
                const answers = JSON.parse(localStorage.getItem("answers")) || Array(questionLength).fill(null);
                answers[index] = selectedValue; // Save the answer for the current question
                localStorage.setItem("answers", JSON.stringify(answers));
            });
        });
    }
}

customElements.define("question-element", Question);
customElements.define("home-element", Home);
customElements.define("test-element", Test);