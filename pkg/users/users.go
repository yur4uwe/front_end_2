package users

import (
	"encoding/json"
	"fmt"
	"os"
)

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
		Tests:    []TestResult{},
	}
}

func ModifyUser(user User, test_history []TestResult) User {
	user.Tests = test_history
	return user
}

func AddTestResult(username string, test TestResult) (User, error) {
	user, err := GetUser(username)
	if err != nil {
		fmt.Println("Error getting user:", err)
		return User{}, err
	}

	user.Tests = append(user.Tests, test)

	err = SaveUser(user)
	if err != nil {
		fmt.Println("Error saving user:", err)
		return User{}, err
	}

	return user, nil
}

func GetUser(username string) (User, error) {
	users, err := getUsers()
	if err != nil {
		fmt.Println("Error getting users:", err)
		return User{}, err
	}

	for _, user := range users {
		if user.Username == username {
			return user, nil
		}
	}

	return User{}, nil
}

func SaveUser(user User) error {
	users, err := getUsers()
	if err != nil {
		fmt.Println("Error getting users:", err)
		return err
	}

	user_exists := false
	for i, u := range users {
		if u.Username != user.Username {
			continue
		}

		tests := u.Tests
		if len(user.Tests) > len(u.Tests) {
			tests = user.Tests
		}

		users[i] = ModifyUser(u, tests)
		user_exists = true
		break
	}

	if !user_exists {
		users = append(users, user)
	}

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
