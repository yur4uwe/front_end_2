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
	score = strings.Replace(score, "]", "", -1)
	score = strings.Replace(score, "\"", "", -1)
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

	user, err := users.GetUser(username)
	if err != nil {
		fmt.Println("Error getting user:", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonMessageProducer("error", "Error getting user"))
		return
	}

	user, err = users.AddTestResult(user.Username, users.TestResult{Score: score_int, Time: time})
	if err != nil {
		fmt.Println("Error adding test result:", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonMessageProducer("error", "Error adding test result"))
		return
	}

	err = users.SaveUser(user)
	if err != nil {
		fmt.Println("Error saving user:", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(jsonMessageProducer("error", "Error saving user"))
		return
	}

	response := map[string]string{"success": "Test submitted", "scores": ""}

	for i, test := range user.Tests {
		if i == 0 {
			response["scores"] = fmt.Sprintf("{\"score\":%d, \"time\":\"%s\"}", test.Score, test.Time)
		} else {
			response["scores"] = fmt.Sprintf("%s, {\"score\":%d, \"time\":\"%s\"}", response["scores"], test.Score, test.Time)
		}
	}

	response["scores"] = fmt.Sprintf("[%s]", response["scores"])

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
