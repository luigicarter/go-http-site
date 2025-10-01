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



/////////////////////////// functions to create custom content jinejctions --- Files and Folders

///// returns html folder element 
function folderClassification(contentInfo){

    let folderElement = `
            <div class="card cardsLine text-dark bg-light mb-3" style="width: 14rem;">
            
           <div class="dropdown dropup">
            <button class="dots-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                </svg>
            </button>
            <ul class="dropdown-menu custom-dropdown-position">
                <li><a class="dropdown-item" href="#" onclick="download('${contentInfo.Hash}')">Download</a></li>
   
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="deleteItem('${contentInfo.Hash}')">Delete</a></li>
            </ul>
        </div>
            
            <div class="card-body" >
            <div class="iconPosition">

                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-folder" viewBox="0 0 16 16">
                    <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/>
                </svg>
            </div>
                <h5 class="card-title" data-id="${contentInfo.Hash}" onclick="itemClicked('${contentInfo.Hash}')">${contentInfo.Name}</h5>
            </div>
            </div>
            `
    return folderElement

}

////// returns file element 
function fileClassification(contentInfo){

    let fileElement = `
            <div class="card cardsLine text-dark bg-light mb-3" style="width: 14rem;">
            
           <div class="dropdown dropup">
            <button class="dots-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                </svg>
            </button>
            <ul class="dropdown-menu custom-dropdown-position">
                <li><a class="dropdown-item" href="#" onclick="downloadFile('${contentInfo.Hash}')">Download</a></li>
      
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="deleteItem('${contentInfo.Hash}')">Delete</a></li>
            </ul>
        </div>
            
            <div class="card-body" >
            <div class="iconPosition">

                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                     <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z"/>
                </svg>
            </div>
                <h5 class="card-title" data-id="${contentInfo.Hash}" onclick="itemClicked('${contentInfo.Hash}')">${contentInfo.Name}</h5>
            </div>
            </div>
            `
    return fileElement

}



//////////////////////////////

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
            if (items[i].Type == "File"){
                let element = fileClassification(items[i])
                contentList.innerHTML += element
            } else if (items[i].Type == "Folder"){
                let element = folderClassification(items[i])
                contentList.innerHTML += element
            }
            
        }

        return 
    } else if ( position != "root") {
        for (i in items){
            if (items[i].Parent == position){
                if (items[i].Type == "File"){
                let element = fileClassification(items[i])
                contentList.innerHTML += element
            } else if (items[i].Type == "Folder"){
                let element = folderClassification(items[i])
                contentList.innerHTML += element
            }
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
    if (currentContentMap[info].Type == "Folder"){
        positionHistory.push(currentContentMap[info].Name)
        setNewPosition(positionHistory[positionHistory.length - 1])
        PostAllFiles(currentContentMap)
        
    }    
}


async function downloadFile(Hash){

    try {
        let fileDownloadRequest = await  fetch("/fileRequest", {
            headers : {"Content-Type" : "application/json" },
            method : "POST",
            body : JSON.stringify({ key : localStorage.getItem("authToken"),
                                    file : Hash}) 
    
        })
    
        if (!fileDownloadRequest.ok){
            throw new Error("unable to download file")
        }
        
        const response = await fileDownloadRequest.formData()
    
        const file = response.get("file")

        console.log(file);

        const url = URL.createObjectURL(file)
        const downloadButton = document.createElement("a")
        downloadButton.href = url
        downloadButton.download = file.name || file.name || "download"
        document.body.appendChild(downloadButton)
        downloadButton.style.display = "None"
        downloadButton.click()

        document.body.removeChild(downloadButton)

        URL.revokeObjectURL(url)
        

    }catch(err){
        console.log(err);
        
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




