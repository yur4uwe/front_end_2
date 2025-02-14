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