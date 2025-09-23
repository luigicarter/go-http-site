package main

import (
	"database/sql"
	"errors"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

type databaseInfo struct{
	Driver string
	File string
}

type UserLookUp struct{
	ID int
	User_name string
	Password string
	Email string 
	Status string 

}

type fileEntry struct {
	Date string
	DisplayName string
	Hash string
	Parent string
	fileSize string
	Owner string
}

type ContentElement struct{
	Name string
	Hash string
	Parent string
	Type string
}


func getDatabase() *databaseInfo{
	return  &databaseInfo{Driver: "sqlite3",File: "./appDB.db" }
}


func GetAllUsers() []UserLookUp {
	myDB := getDatabase()
	usersList := []UserLookUp{}
	
	dbConn , dbConErr := sql.Open(myDB.Driver, myDB.File)
	if dbConErr != nil{
		fmt.Println("failed to open DB")
		fmt.Println(dbConErr)
	}
	defer dbConn.Close()

	dbLookup, lookUpErr := dbConn.Query("SELECT * FROM Users")
	if lookUpErr != nil {
		fmt.Println(lookUpErr)
	}

	defer dbLookup.Close()
	for dbLookup.Next(){
		var userLookUp UserLookUp 
		scanErr := dbLookup.Scan(&userLookUp.ID,
								&userLookUp.User_name,
								&userLookUp.Password,
								&userLookUp.Email,
								&userLookUp.Status)
		if scanErr != nil {
			fmt.Println(scanErr)
		}
		
		usersList = append(usersList, userLookUp)
	}

	return  usersList
}


func GetAUser(username string, password string) UserLookUp{

	myDB := getDatabase()

	dbConn , dbConnErr := sql.Open(myDB.Driver, myDB.File)
	if dbConnErr != nil{
		fmt.Println(dbConnErr)
	}
	defer dbConn.Close()

	myQuery, Qerr := dbConn.Query(`SELECT *
	                           FROM Users Where user_name = ? AND password = ?` , username, password)
	if Qerr != nil {
		fmt.Println(Qerr)
	}
	defer myQuery.Close()

	var selectUser UserLookUp
	for myQuery.Next(){
		scanErr := myQuery.Scan(&selectUser.ID,
					&selectUser.User_name,
				&selectUser.Password,
			&selectUser.Email,
		&selectUser.Status)
		if scanErr != nil {
			fmt.Println(scanErr)
		}
		
	}

	return  selectUser	
	
}

/////////////// Enter new file into DB 

func AddNewFileToDB(myFile fileEntry) error{
	myDb := getDatabase()
	dbConn, dbErr := sql.Open(myDb.Driver, myDb.File)

	if dbErr != nil {	
		dbErrR := errors.New("connection loss")
		return dbErrR
	}

	defer dbConn.Close()
	execution, exError := dbConn.Prepare(`INSERT INTO FileDB ( 
											Date ,
											DisplayName,  
											UniqueHash, 
											Parent, 
											fileSize,
											Owner,
											Type) 
											Values (? , ?, ?, ?, ?, ?, ?);`)
	if exError != nil {
		fmt.Println(exError)
		fmt.Println("DB excution PREPARE error")
		prepareError := errors.New("issue preparing add file command in db")
		return prepareError
	}

	_ , finalEXError := execution.Exec( myFile.Date,
								myFile.DisplayName, 
							myFile.Hash,
						myFile.Parent,
					myFile.fileSize,
				myFile.Owner,
			"File")

	defer execution.Close()

	if finalEXError != nil {
		finalEXErrorMsg := errors.New("issue adding new file to database")
		return finalEXErrorMsg	
	}
	return nil
}

///////////////////////////////////////////////////////////////////

/////////////////////// get all the users file/folders 


func getFileAndFolders(key string) (map[string]ContentElement, error){
	emptyMap := make(map[string]ContentElement)
	contentMap := make(map[string]ContentElement)

	_ , ok := AuthTokenPool[key]
	if !ok {
		checkError := errors.New("auth token is not in pool")
	
		return  emptyMap, checkError
	}
	
	user := AuthTokenPool[key].Username
	



	dbInfo := getDatabase()

	cDB, openDbError := sql.Open(dbInfo.Driver, dbInfo.File)

	if openDbError != nil {
		return  emptyMap , openDbError
	}
	dbQuery := `SELECT DisplayName, UniqueHash, Parent , Type FROM FileDB WHERE Owner = '?'`

	cQuery , queryError := cDB.Query(dbQuery, user)

	if queryError != nil {
		return emptyMap, queryError 
	}

	defer cQuery.Close()


	for cQuery.Next() {

		var fileElement ContentElement
		cQueryScanError := cQuery.Scan(&fileElement.Name, 
										&fileElement.Hash,
										&fileElement.Parent,
										&fileElement.Type)
		if cQueryScanError != nil {
			fmt.Println("issue mappign values to content element date type ")
		}
		contentMap[fileElement.Hash] = fileElement

	}

	return contentMap , nil 
}