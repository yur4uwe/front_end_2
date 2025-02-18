package handlers

import (
	"encoding/json"
	"fmt"
	"fr_lab_2/pkg/test"
	"fr_lab_2/pkg/users"
	"net/http"
	"strings"
	"time"
)

func jsonMessageProducer(message_type string, message string) []byte {
	return []byte(fmt.Sprintf(`{"%s": "%s"}`, message_type, message))
}

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

func Test(w http.ResponseWriter, r *http.Request) {
	questions, err := test.GetTestDataForUser()
	if err != nil {
		fmt.Println("Error getting test data:", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonMessageProducer("error", "Error getting test data"))
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(questions)
}

func SubmitTest(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(jsonMessageProducer("error", "Method not allowed"))
		return
	}

	username := r.FormValue("username")
	score := r.FormValue("score")
	fmt.Println("Score:", score)
	score = strings.Replace(score, "[", "", -1)
	score_slice := strings.Split(score, ",")

	time, err := time.Parse(time.RFC3339, r.FormValue("time"))
	if err != nil {
		fmt.Println("Error parsing time:", err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonMessageProducer("error", "Impossible to parse time"))
		return
	}

	if username == "" || strings.Contains(score, "null") || time.IsZero() {
		fmt.Println("Missing fields")
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonMessageProducer("error", "Missing fields"))
		return
	}

	score_int, err := test.CheckScore(score_slice)
	if err != nil {
		fmt.Println("Error checking score:", err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(jsonMessageProducer("error", "Invalid score"))
		return
	}

	user := users.User{
		Username: username,
		Score:    score_int,
		Time:     time,
	}

	err = users.SaveUser(user)
	if err != nil {
		fmt.Println("Error saving user:", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonMessageProducer("error", "Error saving user"))
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"success": "Test submitted", "score": fmt.Sprintf("%d", score_int)})
}
