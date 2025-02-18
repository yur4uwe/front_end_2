package main

import (
	"fmt"
	"fr_lab_2/pkg/handlers"
	"fr_lab_2/pkg/middleware"
	"net/http"
)

func main() {
	http.HandleFunc("/static/", handlers.Serve)

	http.HandleFunc("/", handlers.Home)

	handler := middleware.ContentTypeMiddleware(
		middleware.LoggingMiddleware(http.DefaultServeMux),
	)

	fmt.Println("Server is listening at :8080")
	http.ListenAndServe(":8080", handler)
}
