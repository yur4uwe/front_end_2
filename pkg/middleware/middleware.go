package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"
)

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		fmt.Printf("Started %s %s\n", r.Method, r.URL.Path)

		next.ServeHTTP(w, r)

		fmt.Printf("Completed %s in %v\n", r.URL.Path, time.Since(start))
	})
}

func ContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Setting content type")
		var file_ext string = ""
		if strings.Contains(r.URL.Path, "static") {
			file_ext = strings.Split(r.URL.Path, ".")[1]

		}

		fmt.Printf("Calculated extension {%v}\n", file_ext)

		switch file_ext {
		case "css":
			w.Header().Set("Content-Type", "text/css")
		case "js":
			w.Header().Set("Content-Type", "application/javascript")
		case "html":
			w.Header().Set("Content-Type", "text/html")
		}

		fmt.Println("Content type set:", w.Header().Get("Content-Type"))

		next.ServeHTTP(w, r)
	})
}
