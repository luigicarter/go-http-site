/////// element that's used 
const fileClick = document.getElementById("addFileClick")


const contentList = document.getElementById("contentList")
const overlay = document.getElementById("myOverlay")
const addFolderOVerlay = document.getElementById("addFolderClick")
const cancelFolderCreation = document.getElementById("cancelFolderCreation")
const folderName = document.getElementById("fodlerName")

const addFolderButton = document.getElementById("createFolder")


let contentMap = {}

addFolderOVerlay.addEventListener("click", ()=>{
    overlay.style.display = "flex"
})

cancelFolderCreation.addEventListener("click", ()=>{
    overlay.style.display = "None"
})

const currentPosition = ()=>{
            let parent = localStorage.getItem("postion")

            if (parent == null){
                console.log("root");
                
                return "root"
            } else {
                console.log(parent);
                
                return parent
            }
            
}





function postFiles(items){
    contentList.innerHTML = ""
    for (i in items){
        let contentCardFormat = `
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

     contentList.innerHTML += contentCardFormat

    }
    

}

function itemClicked(info){
    console.log(info);
    
}





async function getFilesOnLoad(){
    const myKEy = localStorage.getItem("authToken")
    let files = await fetch("/getFiles", {
        method : "POST" ,
        headers : {"Content-Type": "applacation/json"},
        body : JSON.stringify({authToken : myKEy})
        
    })
    
    let response = await files.json()
    contentMap = response
    
    return response
}


(async()=>{
    let k = await getFilesOnLoad()
    postFiles(k)
})()


async function getFile(){
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
        contentMap = response
        
        postFiles(response)
        
        
        
        
    }catch(err){
        console.log(err); 
        alert("Error uploading file. Please try again later")
        return      
    }
}



fileClick.addEventListener("click", ()=>{
    getFile()
    
    
})






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
    
    postFiles(response)
    overlay.style.display = "None"
    
    
}



addFolderButton.addEventListener("click", ()=>{
    addFolder()
})



