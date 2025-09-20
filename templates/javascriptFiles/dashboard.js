const fileClick = document.getElementById("addFileClick")



async function getFile(){
    try{
        const myKEy = localStorage.getItem("authToken")
        const [fileHandle] = await window.showOpenFilePicker({multiple: false});
        const file = await fileHandle.getFile();

        const formData = new FormData();
        formData.append('file', file);
        formData.append("key", myKEy)

        console.log(file);
        

        let uploadRequest = await fetch('/upload', {
          method: 'POST', 
          body: formData
        });



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