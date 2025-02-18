package test

import (
	"encoding/json"
	"fmt"
	"os"
)

type Question struct {
	Question string   `json:"question"`
	Options  []string `json:"options"`
	Answer   string   `json:"answer"`
}

type AnswerLessQuestion struct {
	Question string   `json:"question"`
	Options  []string `json:"options"`
}

// Function to convert Question to AnswerLessQuestion
func ToAnswerLessQuestion(q Question) AnswerLessQuestion {
	return AnswerLessQuestion{
		Question: q.Question,
		Options:  q.Options,
	}
}

func getTestData() ([]Question, error) {
	test_location := "../data/test.json"

	// Open the file
	file, err := os.ReadFile(test_location)
	if err != nil {
		fmt.Println("Error opening file")
		return nil, err
	}

	var questions []Question
	err = json.Unmarshal(file, &questions)
	if err != nil {
		fmt.Println("Error unmarshalling json")
		return nil, err
	}

	return questions, nil
}

func GetTestDataForUser() ([]AnswerLessQuestion, error) {
	test_data, err := getTestData()
	if err != nil {
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
