package test

import (
	"encoding/json"
	"fmt"
	"os"
)

type Question struct {
	Question string   `json:"question"`
	SVG      string   `json:"svg"`
	Options  []string `json:"options"`
	Answer   string   `json:"answer"`
}

type AnswerLessQuestion struct {
	Question string   `json:"question"`
	Options  []string `json:"options"`
	SVG      string   `json:"svg"`
}

// Function to convert Question to AnswerLessQuestion
func ToAnswerLessQuestion(q Question) AnswerLessQuestion {
	return AnswerLessQuestion{
		Question: q.Question,
		Options:  q.Options,
		SVG:      q.SVG,
	}
}

func getTestData() ([]Question, error) {
	test_location := "../data/test.json"

	// Open the file
	file, err := os.ReadFile(test_location)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return nil, err
	}

	var questions []Question
	err = json.Unmarshal(file, &questions)
	if err != nil {
		fmt.Println("Error unmarshalling json:", err)
		return nil, err
	}

	return questions, nil
}

func GetTestDataForUser() ([]AnswerLessQuestion, error) {
	test_data, err := getTestData()
	if err != nil {
		fmt.Println("Error getting test data:", err)
		return nil, err
	}

	var answerLessQuestions []AnswerLessQuestion
	for _, q := range test_data {
		answerLessQuestions = append(answerLessQuestions, ToAnswerLessQuestion(q))
	}

	return answerLessQuestions, nil
}

func GetTestDataForCheck() ([]Question, error) {
	return getTestData()
}

func CheckScore(answers []string) (int, error) {
	test_data, err := getTestData()
	if err != nil {
		fmt.Println("Error getting test data:", err)
		return 0, err
	}

	if len(answers) != len(test_data) {
		err := fmt.Errorf("invalid number of answers")
		fmt.Println("Error:", err)
		return 0, err
	}

	score := 0
	for i, q := range test_data {
		if q.Answer == answers[i] {
			score++
		}
	}

	return score, nil
}
