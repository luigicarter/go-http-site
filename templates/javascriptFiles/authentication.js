const usernameLabel = document.getElementById("userName")
 

async function checkIfLoggedIn(){
    try {
        localAuthToken = localStorage.getItem("authToken")
        console.log(localAuthToken);
        
        

        checker = await fetch("/authcheck", {
            method : "POST",
            headers : {"Content-type" : "appliaction/json"},
            body : JSON.stringify({
                authToken : localAuthToken
            })
        })

        response = await checker

        checkerData = await response.json()
        checkerData = JSON.parse(checkerData)

        console.log(checkerData);
        
        if (checkerData.authenticationResponse == "false"){
            console.log("No Auth Token ");
            
            window.location.href = "/"  
        } 

    }catch (err){
        console.log(err);
        window.location.href = "/"
        
    }
}

checkIfLoggedIn()