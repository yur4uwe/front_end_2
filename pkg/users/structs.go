package users

import "time"

type TestResult struct {
	Score int       `json:"score"`
	Time  time.Time `json:"time"`
}

type User struct {
	Username string       `json:"username"`
	Tests    []TestResult `json:"tests"`
}
