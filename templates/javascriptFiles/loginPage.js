

const button = document.getElementById("loginButton")
const username = document.getElementById("username")
const password = document.getElementById("password")
const loginError = document.getElementById("loginError")

// text value from login screen 



async function login(){
    loginError.style.display = "None"
    let usernameInfo = username.value
    let passwordInfo = password.value

    
    
    
    if (usernameInfo == "" || passwordInfo == "" ){
            alert("Username or Password is missing")
            return        
    }

    let request = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify( {
            username : usernameInfo,
            password: passwordInfo

        })
    })
    let response = await request
    response = await response.json()
    if (response.status == "failed"){

        loginError.style.display = "flex"
        return

    } else if (response.status == "ok"){
        
    }
    localStorage.setItem("authToken", response.userToken)
    
}


button.addEventListener("click", ()=>{
    login()
    
})