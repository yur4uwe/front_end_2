document.addEventListener("DOMContentLoaded", () => {
    function handlePathSegment() {
        const path = window.location.pathname;
        const main = document.getElementById("main");
        main.innerHTML = ""; // Clear existing content

        if (path === "/login") {
            const loginElement = document.createElement("login-element");
            loginElement.setAttribute("redirect-url", "/login");
            main.appendChild(loginElement);
        } else if (path === "/test") {
            const testElement = document.createElement("test-element");
            main.appendChild(testElement);
        } else {
            const homeElement = document.createElement("home-element");
            main.appendChild(homeElement);
        }
    }

    window.addEventListener("popstate", handlePathSegment);

    // Call the function on initial load
    handlePathSegment();
});


