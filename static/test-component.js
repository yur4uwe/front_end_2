/**
 * @param {string[]} options - Options for the question
 * @returns {string} HTML string of the options
 */
function parseQuestionOptions(options, selectedValue) {
    return options.map((option, index) => `<div><input type="radio" name="option" value="${index}" ${selectedValue === index ? "checked" : ""}>${option}</div>`).join("");
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
                #options {
                    width: 100%;
                    display: flex;
                    align-items: start;
                    flex-direction: column;
                }
            </style>
            <h1>Test Page</h1>
            <question-list questions="${test.length}">
                <div id="testContainer">
                    <slot></slot> <!-- Define a slot for children -->
                </div>  
            </question-list>
        `;

        this.currentIndex = 0;
        const question = test[this.currentIndex];
        this.renderQuestion(this.currentIndex, question, test.length);

        // Listen for the custom event to change the question
        this.shadowRoot.querySelector("question-list").addEventListener("questionSelected", (event) => {
            this.currentIndex = event.detail.index;

            this.changeQuestion(this.currentIndex);
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

        const answers = JSON.parse(localStorage.getItem("answers")) || Array(questionLength).fill(null);

        questionElement.innerHTML = `<div id="question">${question.question}</div>
            ${question.svg}
            <div id="options">${parseQuestionOptions(question.options, answers[index] - 1)}</div>`;

        testContainer.appendChild(questionElement);

        // Add event listener to save selected value to localStorage
        this.shadowRoot.querySelectorAll('input[name="option"]').forEach((input) => {
            input.addEventListener('change', (event) => {
                const selectedValue = event.target.value;
                const answers = JSON.parse(localStorage.getItem("answers")) || Array(questionLength).fill(null);
                answers[index] = parseInt(selectedValue) + 1; // Save the answer for the current question
                localStorage.setItem("answers", JSON.stringify(answers));
            });
        });
    }
}

customElements.define("test-element", Test);