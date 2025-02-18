package handlers

import (
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
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("{Method not allowed}"))
		return
	}

	r.ParseForm()
	username := r.FormValue("username")

	if username == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("{Username not provided}"))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{Welcome " + username + "}"))
}
