package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
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
	AuthKey string `json:"authToken"`
}

type NoUserTokenRes struct{
			Status string `json:"Status"`
			
}

type folderAddition struct {
	AuthKey string  `json:"AuthKey"`
	Type string 	`json:"Type"`
	Name string 	`json:"folderName"`
	Parent string 	`json:"Parent"`
	Owner string 
	Hash string
	Date string

}

type fileInfo struct{
	Key string `json:"key"`
	UniqueHash string `json:"file"` 
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

/////////////////////// User authentication via Token map pool in the server.go file

var AuthenticateUser = func( w http.ResponseWriter, r *http.Request ){

	if r.Method != http.MethodPost{
		http.Error(w, "inalid request type", 404)
	} 

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	var submitionKey AuthCheck

	err := decoder.Decode(&submitionKey)
	if err != nil {
		fmt.Println(err)
	}

	_, ok := AuthTokenPool[submitionKey.AuthKey]
	if ok{
		authRes := `{"authenticationResponse" : "ok"}`
		encode := json.NewEncoder(w)
		encode.Encode(authRes)
	} else {
		authRes := `{"authenticationResponse" : "false"}`
		encode := json.NewEncoder(w)
		encode.Encode(authRes)
	}

}
////////////////////////////////////////////////////////////////



//////////// Receive file from the user 

var fileReceipt = func (w http.ResponseWriter, r *http.Request){
	if r.Method != http.MethodPost {
		http.Error(w, "Bad request type", http.StatusMethodNotAllowed)
	}
	file , header, Error := r.FormFile("file")
	if Error != nil {
		http.Error(w, "Issue with form data", http.StatusMethodNotAllowed)
		fmt.Println(Error)
		log.Fatal(Error)
	}
	_ , ok := AuthTokenPool[r.FormValue("key")]
	if !ok {
		noUserTokenFound := NoUserTokenRes{Status: "false"}
		encoder := json.NewEncoder(w)
		encodeErr := encoder.Encode(noUserTokenFound)
		if encodeErr != nil {
			w.Write([]byte("{status : 'null'}"))
			return
		}
		return 
	}
	currentTime := time.Now()
	CurrentTimeToString := currentTime.String()
	
	currentUsername := string(AuthTokenPool[r.FormValue("key")].Username)

	stringToBytes := CurrentTimeToString + currentUsername + header.Filename

	UniqueHashBytes := []byte(stringToBytes) 
	UniqueHash256 := sha256.Sum256(UniqueHashBytes)
	uniqueHashString := hex.EncodeToString(UniqueHash256[:])


	newFile := fileEntry{Date: CurrentTimeToString,
						DisplayName : header.Filename,
						Hash: uniqueHashString,
						Parent: r.FormValue("parent"),
						fileSize: r.FormValue("size"),
						Owner: currentUsername}

	dbFileEntryError := AddNewFileToDB(newFile)
	
	if dbFileEntryError != nil {
		noUserTokenFound := NoUserTokenRes{Status: "false"}
		encoder := json.NewEncoder(w)
		encodeErr := encoder.Encode(noUserTokenFound)
		if encodeErr != nil {
			w.Write([]byte("{status : 'null'}"))
			return
		}
	}
	
	
	dst, _ := os.Create("downloads/" + uniqueHashString)
	
	defer file.Close()
	defer dst.Close()

	io.Copy(dst, file)

	currentFiles , _ := getFileAndFolders(r.FormValue("key"))
	encode_files := json.NewEncoder(w)

	encode_files.Encode(currentFiles)
	

}

////////////// get this user's file and folders for the first page load 

var getUsersFilesAndFolders = func (w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost{
		http.Error(w, "bad request type", http.StatusMethodNotAllowed)
		return
	}

	var getKey AuthCheck

	decode := json.NewDecoder(r.Body)
	decode.DisallowUnknownFields()
	decode.Decode(&getKey)

	currentFiles , cFilesError := getFileAndFolders(getKey.AuthKey)
	if cFilesError != nil{
		http.Error(w, "issue getting file from DB", http.StatusInternalServerError)
		return
	}
	encode := json.NewEncoder(w)
	encode.Encode(currentFiles)
}
////////////////////////////////////////////////////////////

////////////////////////////// Add fodler to DB 

var addFolderHttp = func (w http.ResponseWriter, r *http.Request){
	if r.Method != http.MethodPost{
		http.Error(w, "invalid request type", http.StatusMethodNotAllowed)
		return
	}
	
	var folderInfo folderAddition

	decodeKey := json.NewDecoder(r.Body)
	
	decodeKey.Decode(&folderInfo)

	authError := checkAuthToken(folderInfo.AuthKey)
	if authError != nil {
		http.Error(w, "invalid Auth Token", http.StatusUnauthorized)
		return 
	}
	folderInfo.Owner = AuthTokenPool[folderInfo.AuthKey].Username
	now := time.Now()
	nowString := now.String()

	hashForFolderStringFormat :=  nowString + folderInfo.Owner +  folderInfo.Name

	bytesForHash := []byte(hashForFolderStringFormat)
	byteHash := sha256.Sum256(bytesForHash)
	hashString := hex.EncodeToString(byteHash[:])

	folderInfo.Hash = hashString
	folderInfo.Date = nowString

	addFolderError := addFodlerToDB(folderInfo)
	
	if addFolderError != nil {
		http.Error(w, "issue adding folder to DB", http.StatusInternalServerError)
		return
	}

	newFileList, newFileListError := getFileAndFolders(folderInfo.AuthKey)
	if newFileListError != nil {
		fmt.Println(newFileListError)
		return
	}

	newFileListEncode := json.NewEncoder(w)
	newFileListEncode.Encode(newFileList)
	
		

}

///////////////////////////////////////// file download feature on client side

var fileTransferToClient = func (w http.ResponseWriter, r *http.Request)  {
	if r.Method != http.MethodPost {
		http.Error( w, "invalid request type" ,http.StatusMethodNotAllowed)
	}

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	var fileFromClient fileInfo
	decoder.Decode(&fileFromClient)
	
	authCheck := checkAuthToken(fileFromClient.Key)
	if authCheck != nil {
		http.Error(w, "invalid authkey", http.StatusUnauthorized)
		return
	}
	
	fmt.Println(fileFromClient.UniqueHash)
	
	filePath := `.\downloads\` + fileFromClient.UniqueHash 

	fmt.Println(filePath)

	file, fileOpenError := os.Open(filePath)	
	
	if fileOpenError != nil{
		fmt.Println("file not Found")
		http.Error(w, "file not found", http.StatusFailedDependency)
		return
	}
	
	defer file.Close()
	fmt.Println(file)

	getFileFromDB(fileFromClient.Key, fileFromClient.UniqueHash)


	// multiWriter := multipart.NewWriter(w)
	// w.Header().Set("Content-Type", multiWriter.FormDataContentType())
	
	// defer multiWriter.Close()



	

	// form, formError := multiWriter.CreateFormFile("file", file.Name())

	// if formError != nil {
	// 	fmt.Println("issue creating file field")
	// 	return
	// }

	// _, copyErr := io.Copy(form, file)
	// if copyErr != nil {
	// 	println("issue with io.copy file to form")
	// 	return
	// }

	
}