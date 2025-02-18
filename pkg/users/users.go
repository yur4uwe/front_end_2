package users

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
)

type User struct {
	Username string    `json:"username"`
	Score    int       `json:"score"`
	Time     time.Time `json:"time"`
}

func getUsers() ([]User, error) {
	file, err := os.ReadFile("../data/user_data.json")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return nil, err
	}

	var users []User
	err = json.Unmarshal(file, &users)
	if err != nil {
		fmt.Println("Error unmarshalling json:", err)
		return nil, err
	}

	return users, nil
}

func NewUser(username string) User {
	return User{
		Username: username,
		Score:    -1,
		Time:     time.Time{},
	}
}

func ModifyUser(user User, score int, time time.Time) User {
	user.Score = score
	user.Time = time
	return user
}

func SaveUser(user User) error {
	users, err := getUsers()
	if err != nil {
		fmt.Println("Error getting users:", err)
		return err
	}

	users = append(users, user)

	marshalled, err := json.Marshal(users)
	if err != nil {
		fmt.Println("Error marshalling users:", err)
		return err
	}

	err = os.WriteFile("../data/user_data.json", marshalled, 0644)
	if err != nil {
		fmt.Println("Error writing to file:", err)
		return err
	}

	return nil
}
