package handlers

import "fmt"

func jsonMessageProducer(message_type string, message string) []byte {
	return []byte(fmt.Sprintf(`{"%s": "%s"}`, message_type, message))
}
