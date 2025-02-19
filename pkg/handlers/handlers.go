package handlers

import (
	"fmt"
	"fr_lab_2/pkg/users"
	"net/http"
	"strings"
)

func Home(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "../static/index.html")
}

func Serve(w http.ResponseWriter, r *http.Request) {
	file_to_serve := strings.Split(r.URL.Path, "/")[2]
	extention := strings.Split(file_to_serve, ".")[1]

	switch extention {
	case "css":
		w.Header().Set("Content-Type", "text/css")
	case "js":
		w.Header().Set("Content-Type", "application/javascript")
	case "html":
		w.Header().Set("Content-Type", "text/html")
	}

	http.ServeFile(w, r, "../static/"+file_to_serve)
}

func NotFound(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/404", http.StatusNotFound)
}

func Login(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Login reached")

	if r.Method != "POST" {
		fmt.Println("Method not allowed")
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(jsonMessageProducer("error", "Method not allowed"))
		return
	}

	username := r.FormValue("username")

	if username == "" {
		fmt.Println("Username not provided")
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonMessageProducer("error", "Username not provided"))
		return
	}

	new_user := users.NewUser(username)
	fmt.Println("New user created:", new_user)

	err := users.SaveUser(new_user)
	if err != nil {
		fmt.Println("Error saving user:", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonMessageProducer("error", "Error saving user"))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonMessageProducer("success", "Welcome "+username))
}
