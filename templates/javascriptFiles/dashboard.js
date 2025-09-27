/////// element that's used 
const fileClick = document.getElementById("addFileClick")


const contentList = document.getElementById("contentList")
const overlay = document.getElementById("myOverlay")
const addFolderOVerlay = document.getElementById("addFolderClick")
const cancelFolderCreation = document.getElementById("cancelFolderCreation")
const folderName = document.getElementById("fodlerName")

const addFolderButton = document.getElementById("createFolder")

const navButton = document.getElementById("navDiv")


const currentPosition = ()=>{
    let parent = localStorage.getItem("position")
    if (parent == null){
        return "root"
    } else {
        return parent
    }
}


let currentContentMap = {}
let positionHistory = [currentPosition()]


function setNewPosition(newPosition){
    localStorage.setItem("position", newPosition)
}


function backButtonFunction(){
    positionHistory.pop()     
    setNewPosition(positionHistory[positionHistory.length -1]) 
    PostAllFiles(currentContentMap)
}

function PostAllFiles(items){
    navigationButtons()
    contentList.innerHTML = ""
    let fileCount = 0
    position = currentPosition()

    for (i in items ){
        if (items[i].Parent == position){
            fileCount++
        }
        
    }if (fileCount < 1){
     contentList.innerHTML += `<h1> No Files To Show</h1>`
    } else if (position == "root"){
        for (i in items){
            let dataElement = `
            <div class="card cardsLine text-dark bg-light mb-3" style="width: 14rem;">
            
            <div class="dots">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
            </svg>
            </div>
            
            <div class="card-body" >
            
            <div class="iconPosition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-file-earmark-fill" viewBox="0 0 16 16">
            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z"/>
            </svg>
            </div>
            <h5 class="card-title" onclick="itemClicked('${items[i].Hash}')">${items[i].Name}</h5>
            </div>
            </div>
            `
            
            contentList.innerHTML += dataElement
            
        }

        return 
    } else if ( position != "root") {
        for (i in items){
            if (items[i].Parent == position){

                 let dataElement = `
            <div class="card cardsLine text-dark bg-light mb-3" style="width: 14rem;">
            
            <div class="dots">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
            </svg>
            </div>
            
            <div class="card-body" >
            
            <div class="iconPosition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-file-earmark-fill" viewBox="0 0 16 16">
            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z"/>
            </svg>
            </div>
            <h5 class="card-title" onclick="itemClicked('${items[i].Hash}')">${items[i].Name}</h5>
            </div>
            </div>
            `
            
            contentList.innerHTML += dataElement
            fileCount++ 
                
            }
        }

        return


    }
    
    
}




async function getFilesOnLoad(){
    const myKEy = localStorage.getItem("authToken")
    let files = await fetch("/getFiles", {
        method : "POST" ,
        headers : {"Content-Type": "applacation/json"},
        body : JSON.stringify({authToken : myKEy})
        
    })
    
    let response = await files.json()
    currentContentMap = response
    
    return response
}




async function uploadFile(){
    try{
        
        const myKEy = localStorage.getItem("authToken")
        
        const [fileHandle] = await window.showOpenFilePicker({multiple: false});
        const file = await fileHandle.getFile();
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append("key", myKEy)
        formData.append("size", `${file.size}` )
        formData.append("parent", currentPosition())
        console.log(file.size);
        
        let uploadRequest = await fetch('/upload', {
            method: 'POST', 
            body: formData
        });
        
        let response = await uploadRequest.json()
        currentContentMap = response
        
        PostAllFiles(response)

    }catch(err){
        console.log(err); 
        alert("Error uploading file. Please try again later")
        return      
    }
}



async function addFolder(){
    const myKEy = localStorage.getItem("authToken")
    let folderAddCall = await fetch("/addFolder", {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({
            
            AuthKey : myKEy,
            Type : "Folder",
            folderName : folderName.value,
            Parent : currentPosition()
            
        })
    }) 
    
    let response = await folderAddCall.json()
    
    PostAllFiles(response)
    overlay.style.display = "None"
    
    
}



function navigationButtons(){
    navButton.innerHTML = ""
    backButton  = `<button id="backButton" onclick="backButtonFunction()" type="button" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-return-left" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"></path>
                    </svg>
              </button>`
    if (currentPosition() != "root"){
        navButton.innerHTML += backButton
    }

}


function itemClicked(info){
    console.log(positionHistory[positionHistory.length - 1])
     console.log(positionHistory)
    if (currentContentMap[info].Type == "Folder"){
        positionHistory.push(currentContentMap[info].Name)
        setNewPosition(positionHistory[positionHistory.length - 1])
        PostAllFiles(currentContentMap)
        // navigationButtons()

        
    } else if (currentContentMap[info].Type == "File"){
        // console.log("This is a File");
    }
    
}



(async()=>{
    let k = await getFilesOnLoad()
    PostAllFiles(k)
    navigationButtons()
})()

addFolderButton.addEventListener("click", ()=>{
    addFolder()
})

addFolderOVerlay.addEventListener("click", ()=>{
    overlay.style.display = "flex"
})

cancelFolderCreation.addEventListener("click", ()=>{
    overlay.style.display = "None"
})



fileClick.addEventListener("click", ()=>{
    uploadFile()

})




