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
                    border-radius: 5px;
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
            </style>
            <div id="links-container"></div>
            <div id="next-prev-container">
                <button id="prevButton">Prev</button>
                <button id="nextButton">Next</button>
            </div>
            <slot></slot> <!-- Define a slot for children -->
        `;

        this.activeButton = 0;
        this.questionAmount = this.getAttribute("questions");

        for (let i = 0; i < this.getAttribute("questions"); i++) {
            const questionButton = document.createElement("button");
            questionButton.id = `btn-${i}`;
            questionButton.addEventListener("click", () => {
                this.shadowRoot.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
                questionButton.classList.add("active");
                this.dispatchEvent(new CustomEvent("questionSelected", {
                    detail: { index: i, move: 0 },
                    bubbles: true,
                    composed: true
                }));
            });
            questionButton.textContent = `${i + 1}`;
            this.shadowRoot.appendChild(questionButton);
        }

        this.shadowRoot.getElementById("prevButton").addEventListener("click", () => {
            if (this.activeButton < 0) {
                this.activeButton = this.questionAmount - 1;
            } else if (this.activeButton >= this.questionAmount) {
                this.activeButton = 0;
            }

            this.shadowRoot.querySelectorAll("button").forEach((button) => {
                const btn_id = button.id.split("-")[1];
                if (btn_id == this.activeButton) {
                    button.classList.add("active");
                } else {
                    button.classList.remove("active");
                }
            });

            this.dispatchEvent(new CustomEvent("questionSelected", {
                detail: { index: -1, move: -1 },
                bubbles: true,
                composed: true
            }));
        });

        this.shadowRoot.getElementById("nextButton").addEventListener("click", () => {
            this.classList.add("active");
            this.dispatchEvent(new CustomEvent("questionSelected", {
                detail: { index: -1, move: 1 },
                bubbles: true,
                composed: true
            }));
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'questions') {
            this.question = newValue;
        }
    }
}

customElements.define("question-list", QuestionList);