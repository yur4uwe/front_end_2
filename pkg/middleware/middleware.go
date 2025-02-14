package middleware

import (
	"fmt"
	"net/http"
	"time"
)

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		fmt.Printf("Started %s %s", r.Method, r.URL.Path)

		next.ServeHTTP(w, r)

		fmt.Printf("Completed %s in %v", r.URL.Path, time.Since(start))
	})
}
