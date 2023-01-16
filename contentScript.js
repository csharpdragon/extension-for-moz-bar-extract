var array=[];
window.addEventListener("load",async function() {
    // loaded
    await sleep(3000);
    var iframes=document.getElementsByTagName("iframe");
        for(var i=1;i<iframes.length;i++){
            
                try{
                    if(iframes[i].parentElement.parentElement.parentElement.parentElement.parentElement.id == "search"){
                        var pa = iframes[i].contentWindow.document.getElementsByClassName("serp-item")[2].getElementsByClassName("stat")[0].getElementsByClassName("title")[0].innerText.replace("PA: ","");
                        var da = iframes[i].contentWindow.document.getElementsByClassName("serp-item")[2].getElementsByClassName("stat")[1].getElementsByClassName("title")[0].innerText.replace("DA: ","");
                        array.push([pa,da]);
                    }
                }catch(e){
                    console.log(e);
                }
            
        }
        if(array.length>0){
            console.log(array);
            new Promise((resolve, reject) => {
                try {
                  chrome.runtime.sendMessage({type: "receiveDAFromPage",data:array}, async (response) => {
                    await sleep(1000);
                    location.href=response.url;
                    resolve(response);
                  });
                } catch (e) {
                  if (e.message == "Extension context invalidated.") {
                    console.log();
                  } else {
                    console.log(e);
                  }
                }
              });
        }
}, false); 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
