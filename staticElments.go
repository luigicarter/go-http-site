package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

////////////////\\\\///////////// LOGIN PAGE endpoints

var LoginPage = func(w http.ResponseWriter, r *http.Request) {
		homePage, htmlErr := os.Open("./templates/htmlFiles/login.html")
			if htmlErr != nil {
				fmt.Println(htmlErr)
			}
			defer homePage.Close()

		w.Header().Set("Content-Type", "text/html")
		_, err := io.Copy(w, homePage)
			if err != nil {
				log.Fatal(err)
			}
}

var loginPageJS = func(w http.ResponseWriter, r *http.Request) {
		script, jslErr := os.Open("./templates/javascriptFiles/loginPage.js")
			if jslErr != nil {
				fmt.Println(jslErr)
			}
			defer script.Close()

		w.Header().Set("Content-Type", "application/javascript")
		_, err := io.Copy(w, script)
			if err != nil {
				log.Fatal(err)
			}
}

var LoginCss = func(w http.ResponseWriter, r *http.Request)  {

	css, cssErr := os.Open("./templates/cssFiles/login.css")
	if cssErr != nil {
		fmt.Println(cssErr)
	} 
	defer css.Close()

	w.Header().Set("Content-Type", "text/css")

	_, err := io.Copy(w, css)
	if err != nil {

		println(err)
	}
}

////////////////////////////////////////////////////////////////////////////////////



//////////////////\\\\\// DASHBOARD ENDPOINJTS 


var UserDashBoardHtml = func (w http.ResponseWriter, r *http.Request){
	page , pageErr := os.Open("./templates/htmlFiles/userHomePage.html")
	if pageErr != nil {
		fmt.Println("unable to open user dashbaord html files")
		fmt.Println(pageErr)
	}
	defer page.Close()

	_, writingErr := io.Copy(w, page)
	if writingErr != nil {
		fmt.Println(writingErr)
	}

}

var UserDashBoardCSS = func (w http.ResponseWriter, r *http.Request){

	css, cssErr := os.Open("./templates/cssFiles/dashboard.css")

	w.Header().Set("Content-Type", "text/css")

	if cssErr != nil {
		fmt.Println(cssErr)
	}

	defer css.Close()
	_, err := io.Copy(w, css)

	if err != nil {
		fmt.Println(cssErr)
	}
}

var UserDashBoardJS = func (w http.ResponseWriter, r *http.Request){

	js, jsErr := os.Open("./templates/javascriptFiles/dashboard.js")

	w.Header().Set("Content-Type", "application/javascript")

	if jsErr != nil {
		fmt.Println(js)
	}

	defer js.Close()
	_, err := io.Copy(w, js)

	if err != nil {
		fmt.Println(err)
	}
}

////////////////////////////////////////////////////////////////////////////////////



