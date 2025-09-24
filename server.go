package main

import (
	"fmt"
	"net/http"
	"sync"

	_ "github.com/mattn/go-sqlite3"
)

type authPoolElement struct{
	Username string
	Email string
}


var AuthTokenPool = make(map[string]authPoolElement)


var httpServerPRocess sync.WaitGroup
var HttpServerKillSwitch chan int
var killDecision = &HttpServerKillSwitch

func runHttpServer(kill *chan int) {
	/// login screen request
	http.HandleFunc("/", LoginPage)
	http.HandleFunc("/loginPage.js", loginPageJS)
	http.HandleFunc("/login.css", LoginCss)
	
	////// Login Auth
	http.HandleFunc("/login", LoginHandler)
	//////////////////

	///////////authentication function
	http.HandleFunc("/authentication.js", authenticationJSFile)
	////////////////////////

	//// User Dashbaord
	////////// Auth Checker
	http.HandleFunc("/authcheck", AuthenticateUser)

	//////////////// User dashboard page static files 
	http.HandleFunc("/dashboard", UserDashBoardHtml)
	http.HandleFunc("/dashboard.css", UserDashBoardCSS)
	http.HandleFunc("/dashboard.js", UserDashBoardJS)
	///////////////////

	//////////////// file upload 
	http.HandleFunc("/upload", fileReceipt)
	/////////////


	///////////// give users the file and folders list 
	http.HandleFunc("/getFiles", getUsersFilesAndFolders)
	////////////////

	////// add a folder 
	http.HandleFunc("/addFolder", addFolderHttp)
	////////

	println("Server is listening on 127.0.0.1:8080")
	defer httpServerPRocess.Done()

	go http.ListenAndServe("127.0.0.1:8080", nil)
	var inf int
	for inf < 5 {
		_, ok := <-(*kill)

		if ok {
			return
		} else {
			continue

		}
	}

}

func killServer(killBut *chan int) {

	for {
		var cmdDecision string
		fmt.Println("Y to close server and N to leave ")
		_, err := fmt.Scanln(&cmdDecision)
		if err != nil {
			fmt.Println(err)
		}

		if cmdDecision == "Y" {
			(*killBut) <- 1
			println("Killing the server")
			return
		} else {
			fmt.Println(cmdDecision)
			continue
		}
	}
}

func main() {
	AuthTokenPool["e1239eb8ff1bb1c4fc3d6d3e76210dafda1610b834a212fb782edb5a13952f10"] = authPoolElement{Username: "tekimali", Email: "a.hersi95@gmail.com"}
	*killDecision = make(chan int)
	httpServerPRocess.Add(1)

	go runHttpServer(killDecision)
	go killServer(killDecision)

	httpServerPRocess.Wait()

}
