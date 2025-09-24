package main

import "errors"

func checkAuthToken(key string) error {

	_, ok := AuthTokenPool[key]
	if !ok {
		authError := errors.New("no Auth Token")
		return authError
	}
	return nil 

}