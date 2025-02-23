document.addEventListener("DOMContentLoaded", () => {
    function handlePathSegment() {
        const path = window.location.pathname;
        const main = document.getElementById("main");
        main.innerHTML = ""; // Clear existing content

        if (path === "/login") {
            localStorage.clear();
            localStorage.removeItem("answers");
            const loginElement = document.createElement("login-component");
            loginElement.setAttribute("redirect-url", "/login");
            main.appendChild(loginElement);
        } else if (path === "/test") {
            const testElement = document.createElement("test-element");
            main.appendChild(testElement);
        } else if (path === "/results") {
            const resultsElement = document.createElement("results-element");
            main.appendChild(resultsElement);
        } else {
            const homeElement = document.createElement("home-element");
            main.appendChild(homeElement);
        }
    }

    window.addEventListener("popstate", handlePathSegment);

    // Call the function on initial load
    handlePathSegment();
});


