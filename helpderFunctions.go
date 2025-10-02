package main

import (
	"errors"
	"os"
)

func checkAuthToken(key string) error {

	_, ok := AuthTokenPool[key]
	if !ok {
		authError := errors.New("no Auth Token")
		return authError
	}
	return nil 

}

func deleteFile(hash string) error {

	osError := os.Remove("./downloads/" + hash)
	if osError != nil {

		return errors.New("unable to delete file")
	}

	return nil 
}