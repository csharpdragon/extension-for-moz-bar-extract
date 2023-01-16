var array=[];
setTimeout(()=>{
   
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
                  chrome.runtime.sendMessage({type: "receiveDAFromPage",data:array}, (response) => {
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
},5000);
/*
var paidforRead = false;

 
if(window.location.href.includes("https://extensionpay.onrender.com/readapprove.html")){
    var paidforRead = true;
    chrome.storage.sync.set({ paidforRead });
}
document.onvisibilitychange = async function() { 
    await visibilitychaged();
};

async function visibilitychaged(){
    const item = await chrome.storage.sync.get(['paidforRead']);
    paidforRead = item.paidforRead;
    let countword=countWords(document.body.innerText.replace(/(<([^>]+)>)/gi, ""));
    chrome.storage.sync.set({ countword });
}
(async function(){
    startTextSelectDetector();
    visibilitychaged();
}).call(this);
function startTextSelectDetector() {
    enableSelectionEndEvent(); //set mouse drag text selection event
    document.addEventListener(
        "selectionEnd",
        async function(event) {
        if (
            document.visibilityState === "visible"
        ) {
            selectedText = event.selectedText;
            if(selectedText!="" && paidforRead)
            {
                new Promise((resolve, reject) => {
                    try {
                      chrome.runtime.sendMessage({bodytext: selectedText}, (response) => {
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
        },
        false
    );
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
function filterWord(word) {
    if (!word) {
        return "";
    }
    word = word.replace(/\s+/g, " "); //replace whitespace as single space
    word = word.trim(); // remove whitespaces from begin and end of word
    if (
        word.length > 1000 || //filter out text that has over 1000length
        isUrl(word) || //if it is url
        !/[^\s\d»«…~`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/g.test(
        word
        )
    ) {
        // filter one that only include num,space and special char(include currency sign) as combination
        word = "";
    }
    return word;
}


/////////selection part
let lastSelectedText = '';
function enableSelectionEndEvent() {
    // Listen selection change every 700 ms. It covers keyboard selection and selection from menu (select all option)
    document.addEventListener("selectionchange", debounce(event => {
        triggerSelectionEnd();
    }, 700), false);

    // Trigger on mouse up immediately. Helps reduce 700 ms delay during mouse selection.
    document.addEventListener("mouseup", function(event) {
        triggerSelectionEnd();
    }, false);
}

function getSelectionText() {
    let text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function triggerSelectionEnd() {
    let event = document.createEvent("HTMLEvents");
    event.initEvent("selectionEnd", true, true);
    event.eventName = "selectionEnd";
    event.selectedText = getSelectionText();
    // don't fire event twice
    if (event.selectedText === lastSelectedText) {
        return;
    }
    lastSelectedText = event.selectedText;
    document.dispatchEvent(event);
}

// Returns a function, that, as long as it continues to be invoked, will not be triggered.
// The function will be called after it stops being called for N milliseconds.
function debounce(callback, interval = 300) {
    let debounceTimeoutId;

    return function(...args) {
        clearTimeout(debounceTimeoutId);
        debounceTimeoutId = setTimeout(() => callback.apply(this, args), interval);
    };
}



////word
function countWords(request) {
    var words = request.split(/\s+/);
    return words.length;
  }*/