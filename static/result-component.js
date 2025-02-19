/**
 * @typedef {TestResult[]} Results
 * @typedef {Object} TestResult
 * @property {number} score - The score of the test
 * @property {string} time - The time of the test
 */

class ResultDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const styles = `<style>
            :host {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: start;
                background-color: #f0f0f0;
                padding: 10px;
                width: 100%;
                max-width: 300px;
            }
            * {
                margin: 5px;
            }
        </style>`;
        this.shadowRoot.innerHTML = `${styles}<h3 id="atempt"></h3><h3 id="time"></h3><h2 id="score"></h2>`;
    }

    set atempt(value) {
        this.shadowRoot.getElementById('atempt').textContent = `Atempt: ${value}`;
    }

    set score(value) {
        this.shadowRoot.getElementById('score').textContent = `Score: ${value}`;
    }

    set time(value) {
        const date = new Date(value).getTime();
        const now = Date.now();
        const diff = now - date;

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        let elapsedTime = '';
        if (days > 0) elapsedTime += `${days}d `;
        if (hours > 0) elapsedTime += `${hours}h `;
        if (minutes > 0) elapsedTime += `${minutes}m `;
        elapsedTime += `${seconds}s ago`;

        this.shadowRoot.getElementById('time').textContent = `Time: ${elapsedTime}`;
    }
}

class Result extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const styles = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 10px;
                    width: calc(100% - 20px);
                    
                }
                div {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #f0f0f0;
                    padding: 10px;
                    width: calc(100% - 40px);
                    margin: 10px;
                }
                button {
                    font-size: 2em;
                }
            </style>
        `;
        this.shadowRoot.innerHTML = `${styles}<div>
            <h1>Result Page</h1>
            <button id="backButton">Home</button>
        </div>`;

        /**
         * @type {string} results
         */
        const results = localStorage.getItem("results");
        console.log(results);

        if (!results) {
            this.shadowRoot.appendChild(document.createTextNode("No results found"));
            return;
        }

        /**
         * @type {TestResult[]} resultsArray
         */
        const resultsArray = [];
        const ignoreChars = ["[", "]", ",", " "];

        for (let i = 0; i < results.length; i++) {
            if (ignoreChars.includes(results[i])) {
                continue
            }

            if (results[i] === "{") {
                let result = "";
                while (results[i] !== "}") {
                    result += results[i];
                    i++;
                }
                result += "}";
                resultsArray.push(JSON.parse(result));
            }
        }

        console.log(resultsArray);

        const sortedArray = JSON.parse(JSON.stringify(resultsArray));

        sortedArray.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        for (const result of sortedArray) {
            const resultDisplay = document.createElement("result-display");
            resultDisplay.score = result.score;
            resultDisplay.time = result.time;
            resultDisplay.atempt = resultsArray.findIndex((r) => r.time === result.time && r.score === result.score) + 1;
            this.shadowRoot.appendChild(resultDisplay);
        }

        this.shadowRoot.getElementById("backButton").addEventListener("click", () => {
            window.location.href = "/";
        });
    }
}

customElements.define("result-display", ResultDisplay);
customElements.define("results-element", Result);