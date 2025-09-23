

const fileClick = document.getElementById("addFileClick")
const buttonArea = document.getElementById("buttonArea")


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

        // let response = await uploadRequest.json()



    }catch(err){
        console.log(err); 
        alert("Error uploading file. Please try again later")
        return      
    }
}



fileClick.addEventListener("click", ()=>{
    console.log("clicks");
    getFile()
    
    
})

// for (i = 0 ; i < 1000; i++){

//     const currentButton = document.createElement("button")

//     currentButton.setAttribute("data-type", "file")
//     currentButton.setAttribute("data-hash", "dsf8sd7fsdf786")
//     currentButton.innerText = `Button ${i}`

//     buttonArea.appendChild(currentButton)

//     currentButton.addEventListener('click', ()=>{
//         console.log(`Button ${i}`);
        
//     })


// }
