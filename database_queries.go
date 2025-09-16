package main

import (
	"database/sql"
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

