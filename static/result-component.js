class Result extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `<h1>Result Page</h1>`;
    }
}

customElements.define("results-element", Result);