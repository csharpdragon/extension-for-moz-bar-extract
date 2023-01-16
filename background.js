var textArray=[];
var receivePDAFromPageArray=[];
var result=[];
var currentTabIndex=0;
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  console.log(request.type);
  if(request.type=="start"){
    console.log("start");
    receivePDAFromPageArray=[];
    text=request.text;
    textArray=text.split('\n');
    textArray=textArray.map(x=>x.replace("\r",''));
    console.log(textArray);
    await createTabs();
  }
  if(request.type=="receiveDAFromPage"){
    if(receivePDAFromPageArray.length<textArray.length)
    {
      receivePDAFromPageArray.push(request.data);
      currentTabIndex++;
      sendResponse({wait: currentTabIndex%10==9 ,url: 'http://google.com/search?q='+textArray[currentTabIndex]});
    }else{
      
    }
    console.log(receivePDAFromPageArray);
  }

  if(request.type=="download"){
    console.log(receivePDAFromPageArray);
    result=[];
    result.push(["keyword","DA","Reuslt DA","PA","Average PA"]);
    console.log(receivePDAFromPageArray);
    for(var i=0;i<receivePDAFromPageArray.length;i++){
      var narray=[];
      narray.push(textArray[i]);
      narray.push((receivePDAFromPageArray[i].map(x=>x[1])).toString());
      narray.push(getDifficulty(receivePDAFromPageArray[i]));
      narray.push((receivePDAFromPageArray[i].map(x=>x[0])).toString());
      var aPA =0;
      for(var j=0;j<receivePDAFromPageArray[i].length;j++){
        aPA+=Number(receivePDAFromPageArray[i][j][0]);
      }
      aPA=aPA*1.0/receivePDAFromPageArray.length;
      narray.push(aPA);
      result.push(narray);
    }
    sendResponse(result);
  }
  return true;
});
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getDifficulty(values) {
  var below30 = 0;
  var below15 = 0;
  for (var i = 0; i < values.length; i++) {
    if (Number(values[i][1]) <= 15) {
      below15++;
    }
    else if (Number(values[i][1]) <= 30) {
      below30++;
    }
  }
  if (below15 >= 2 ) {
    return 'very easy';
  }
  else if (below30 >= 3) {
    return 'easy';
  }
  else if (below30 == 2) {
    return 'medium';
  }
  else {
    return 'difficult';
  }
}
function createTabs(){
  currentTabIndex=0;
  // for(var i=0;i<textArray.length;i++){
  //   console.log(i);
    chrome.tabs.create({
      url: 'http://google.com/search?q='+textArray[0]
    });
  //   await sleep(10000);
  // }
  chrome.storage.sync.set({ status:true });
}

// function readfile(){
  
// }
/*
let paidforRead = false;
chrome.runtime.onInstalled.addListener(async (_reason) => {
  chrome.storage.sync.set({ paidforRead });
  const item = await chrome.storage.sync.get(['paidforRead']);
  if(item.paidforRead != true){
    chrome.storage.sync.set({ paidforRead });
    chrome.tabs.create({
      url: 'https://extensionpay.onrender.com/readindex.html'
    });
  }else{
    chrome.tabs.create({
      url: 'https://extensionpay.onrender.com/readapprove.html'
    });
  }
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request.bodytext);
  if(request.bodytext!=null && request.bodytext!=undefined){
    console.log(request.bodytext);
    chrome.tts.stop();
    chrome.tts.speak(request.bodytext);
  }
  return true;
})*/
