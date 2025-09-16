package main

import (
	"database/sql"
	"fmt"
	"testing"
)

type TestDatabaseInfo struct{
	Driver string
	File string
}

type TestAllUsersLookUp struct{
	ID int
	User_name string
	Password string
	Email string 
	Status string 

}


func TestgetDatabase() *TestDatabaseInfo{
	return  &TestDatabaseInfo{Driver: "sqlite3",File: "./appDB.db" }
}


func TestGetAllUsers(t *testing.T) {
	myDB := TestgetDatabase()
	usersList := []TestAllUsersLookUp{}
	

	dbConn , dbConErr := sql.Open(myDB.Driver, myDB.File)
	if dbConErr != nil{
		t.Log("failed to open DB")
		t.Log(dbConErr)
	}

	dbLookup, lookUpErr := dbConn.Query("SELECT * FROM Users")
	if lookUpErr != nil {
		t.Log(lookUpErr)
	}
	for dbLookup.Next(){
		var userLookUp TestAllUsersLookUp 
		scanErr := dbLookup.Scan(&userLookUp.ID,
								&userLookUp.User_name,
								&userLookUp.Password,
								&userLookUp.Email,
								&userLookUp.Status)
		if scanErr != nil {
			t.Log(scanErr)
		}
		
		usersList = append(usersList, userLookUp)

	}

	fmt.Println(usersList)



}
