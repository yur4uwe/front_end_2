package main

import (
	"fmt"
	"fr_lab_2/pkg/handlers"
	"fr_lab_2/pkg/middleware"
	"net/http"
)

func main() {

	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", handlers.Home)

	handler := middleware.LoggingMiddleware(http.DefaultServeMux)

	fmt.Println("Server is listening at :8080")
	http.ListenAndServe(":8080", handler)
}
