const fileClick = document.getElementById("addFileClick")





async function getFile(){
    let fileHandle
    try{
        const [fileHandle] = await window.showOpenFilePicker({multiple: false});
        const file = await fileHandle.getFile();

        const formData = new FormData();
        formData.append('file', file); // ✅ This works

        let uploadRequest = await fetch('/upload', {
          method: 'POST', 
          body: formData
        });


    }catch(err){
        console.log(err); 
        alert("Erro uploading file. Please try again later")
        return      
    }
    
}



fileClick.addEventListener("click", ()=>{
    console.log("clicks");
    getFile()
    
    
})