function navigateTo(path) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("popstate"));
}

/**
 * @typedef {{state: {message: string}, scores: {score: number, time: string}[]}} Response
 */

class QuestionList extends HTMLElement {
    static get observedAttributes() {
        return ['questions'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                button {
                    padding: 10px;
                    margin: 10px;
                    width: 50px;
                    height: 50px;
                    border-radius: 40%;
                    border: none;
                    background-color: var(--question-list-button-color);
                    text-align: center;
                }
                button:hover {
                    background-color: var(--question-list-button-hover-color);
                }
                .active {
                    background-color: var(--question-list-active-button-color);
                }
                #next-prev-container, #links-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                #endTestButton {
                    width: 100px;
                    border-radius: 5px;
                    background-color: var(--end-test);
                }
                    .active {
                        color: var(--question-list-active-button-color-text);
                    }
            </style>
            <div id="links-container"></div>
            <slot></slot> <!-- Define a slot for children -->
            <div id="next-prev-container">
                <button id="prevButton"><</button>
                <button id="endTestButton">end test</button>
                <button id="nextButton">></button>
            </div>
            
        `;

        this.activeButton = 0;
        this.questionAmount = this.getAttribute("questions");


        for (let i = 0; i < this.getAttribute("questions"); i++) {
            const questionButton = document.createElement("button");
            questionButton.id = `btn-${i}`;
            questionButton.addEventListener("click", () => {
                this.highlightButton(i);
                this.activeButton = i;
                this.dispatchEvent(new CustomEvent("questionSelected", {
                    detail: { index: i },
                    bubbles: true,
                    composed: true
                }));
            });
            questionButton.textContent = `${i + 1}`;
            this.shadowRoot.getElementById("links-container").appendChild(questionButton);
        }

        this.shadowRoot.getElementById("prevButton").addEventListener("click", () => {
            const new_index = this.moveActiveButton(-1);

            this.dispatchEvent(new CustomEvent("questionSelected", {
                detail: { index: new_index },
                bubbles: true,
                composed: true
            }));
        });

        this.shadowRoot.getElementById("nextButton").addEventListener("click", () => {
            const new_index = this.moveActiveButton(1);

            this.dispatchEvent(new CustomEvent("questionSelected", {
                detail: { index: new_index },
                bubbles: true,
                composed: true
            }));
        });

        this.shadowRoot.getElementById("endTestButton").addEventListener("click", async () => {
            const formData = new FormData();
            formData.append("username", localStorage.getItem("username"));
            formData.append("score", JSON.stringify(localStorage.getItem("answers")));
            formData.append("time", new Date().toISOString());

            /**
             * @type {Response} response
             */
            const response = await fetch("/submit-test", {
                method: "POST",
                body: formData
            }).then((res) => res.json());

            console.log(response);

            if (!response.success) {
                return;
            }

            localStorage.removeItem("answers");
            localStorage.setItem("results", response.scores);

            navigateTo("/results");
        });

        this.highlightButton(this.activeButton);
    }

    highlightButton(index) {
        this.shadowRoot.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
        this.shadowRoot.getElementById(`btn-${index}`).classList.add("active");
    }

    moveActiveButton(move) {
        this.activeButton += move;

        if (this.activeButton < 0) {
            this.activeButton = this.questionAmount - 1;
        } else if (this.activeButton >= this.questionAmount) {
            this.activeButton = 0;
        }

        this.highlightButton(this.activeButton);

        return this.activeButton;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'questions') {
            this.question = newValue;
        }
    }
}

customElements.define("question-list", QuestionList);