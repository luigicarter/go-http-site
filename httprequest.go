package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
)

type LoginRes struct {
	Status    string `json:"status"`
	UserToken string `json:"userToken"`
	Username string `json:"Username"`
	Email string `json:"Email"`
	
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `Json:"password"`
}



type AuthCheck struct{
	AuthKey string
}

//////////////// LOGIN Authenticator 
var LoginHandler = func(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST request are allowed", 400)
		return
	}

	var loginData LoginRequest

	decoder := json.NewDecoder(r.Body)

	decoder.DisallowUnknownFields()

	err := decoder.Decode(&loginData)
	if err != nil {
		fmt.Println(err)
		fmt.Println("Issue decoding response ")
	}
	
	w.Header().Set("Content-Type", "application/json")
	
	loginUser := GetAUser(loginData.Username, loginData.Password)
	
	if loginUser.User_name == ""{
		resInfo := LoginRes{
		Username: "",
		Email: "",
		Status: "failed",
		UserToken:"" ,
		}

		fmt.Println("User was not found")
		encoder := json.NewEncoder(w)
		encodeErr := encoder.Encode(resInfo)

		if encodeErr != nil {
			fmt.Println("issue encoding JSON")
		}
		return 
		
	}

	privateKEy := loginUser.User_name + loginUser.Password

	authToken := []byte(privateKEy)
	authTokenHash := sha256.Sum256(authToken)

	authTokenHashString := hex.EncodeToString(authTokenHash[:])

	AuthTokenPool[authTokenHashString] = authPoolElement{Username: loginData.Username,
															 Email: loginUser.Email }
	

	resInfo := LoginRes{Username: loginUser.User_name,
		Email: loginUser.Email,
		Status: "ok",
		UserToken:authTokenHashString,}
		
		
		
	encoder := json.NewEncoder(w)
	encodeErr := encoder.Encode(resInfo)
	if encodeErr != nil {
		fmt.Println("issue encoding json for http response ")
		return
	}
	

}

////////////////////////////////////////////////////////////////



var AuthenticateUser = func( w http.ResponseWriter, r *http.Request ){

	if r.Method != http.MethodPost{
		http.Error(w, "inalid request type", 404)
	} 
	

}