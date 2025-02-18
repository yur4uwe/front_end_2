document.addEventListener("DOMContentLoaded", () => {
    function handlePathSegment() {
        const path = window.location.pathname;
        const main = document.getElementById("main");
        main.innerHTML = ""; // Clear existing content

        if (path === "/login") {
            const loginElement = document.createElement("login-element");
            loginElement.setAttribute("redirect-url", "/home");
            main.appendChild(loginElement);
        } else if (path === "/register") {
            const registerElement = document.createElement("register-element");
            main.appendChild(registerElement);
        } else if (path === "/questions") {
            const questionList = document.createElement("question-list");
            main.appendChild(questionList);
        } else {
            const homeElement = document.createElement("home-element");
            main.appendChild(homeElement);
        }
    }

    window.addEventListener("popstate", handlePathSegment);

    // Call the function on initial load
    handlePathSegment();
});


