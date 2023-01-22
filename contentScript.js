var array=[];
var beforeNewSearch =[];
var before10keywords = [];
var beforescriping = [];
const QueryString = window.location.search; 
const urlParams = new URLSearchParams(QueryString); 

async function getTimeData(){
    await (new Promise((resolve, reject) => {
        try {
          chrome.runtime.sendMessage({type: "timer"}, async (response) => {
            beforeNewSearch = response.beforeNewSearch;
            before10keywords = response.before10keywords;
            beforescriping = response.beforescriping;
            console.log(beforeNewSearch);
            console.log(before10keywords);
            console.log(beforescriping);
            resolve(response);
          });
        } catch (e) {
          if (e.message == "Extension context invalidated.") {
            console.log();
          } else {
            console.log(e);
          }
        }
      }));
}
getTimeData();
window.addEventListener("load",async function() {
    if(urlParams.has('q')){
        // loaded
        await sleep(beforescriping);
        var chaptcha = document.getElementById('rc-anchor-alert');
        if(chaptcha!=null)
            return;
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
            if((iframes.length>0)){
                console.log(array);
                new Promise((resolve, reject) => {
                    try {
                      chrome.runtime.sendMessage({type: "receiveDAFromPage",data:array,query: urlParams.get('q')}, async (response) => {
                        await sleep(beforeNewSearch);
                        if(response.wait){
                            await sleep(before10keywords);
                        }
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
    }
}, false); 

function sleep(ms) {
    var nrandom= Math.floor(ms[0]+Math.random()*(ms[1]-ms[0]));
    return new Promise(resolve => setTimeout(resolve, nrandom));
}
