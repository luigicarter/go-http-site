const fileClick = document.getElementById("addFileClick")



async function getFile(){
    let fileHandle
    try{
        
        [fileHandle] = await window.showOpenFilePicker({multiple : false});
    }catch(err){
        console.log(err); 
        return      
    }
    console.log(fileHandle);
    
}



fileClick.addEventListener("click", ()=>{
    console.log("clicks");
    getFile()
    
    
})