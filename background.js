var textArray=[];
var receivePDAFromPageArray=[];
var result=[];
var currentTabIndex=0;
var countryurl="http://google.com/search?q=";

var beforeNewSearch=[2000,3000];
var before10keywords=[5000,6000];
var beforescriping=[2000,4000];

function setTimerAndUrl(values){
  if(!isNullorEmpty(values["country-search-url"]))
     countryurl=values["country-search-url"];
  else countryurl="http://google.com/search?q=";

  if(!isNullorEmpty(values["before start new search"]))
  {
    beforeNewSearch=values["before start new search"];
  }
  else{ beforeNewSearch = [2000,3000]; }

  if(!isNullorEmpty(values["between 10 keywords"]))
  {
    before10keywords=values["between 10 keywords"] ;
  }
  else{ before10keywords= [5000,6000]; }

  if(!isNullorEmpty(values["before scraping the result"]))
  {
    beforescriping=values["before scraping the result"];
  }
  else{ beforescriping= [2000,4000]; }

  console.log(values);
  
}
function isNullorEmpty(ovalue){
  if(ovalue!=null && ovalue!= undefined &&ovalue.toString()!="")
    return false;
  return true;
}
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  console.log(request.type);
  if(request.type=="start"){
    console.log("start");
    receivePDAFromPageArray=[];
    text=request.text;
    
    setTimerAndUrl(request.timer);

    textArray=text.split('\n');
    textArray=textArray.map(x=>x.replace("\r",''));
    console.log(textArray);
    await createTabs();
  }
  if(request.type=="receiveDAFromPage"){
    if(request.query==null || request.query == undefined || request.query=="")
      return;
    console.log(receivePDAFromPageArray);
    console.log(textArray);
    var index=0;
    for(var i=0;i<textArray.length;i++){
      if(textArray[i] == request.query){
        index = i;
      }
    }
    var wait=false;
    if(receivePDAFromPageArray.length<textArray.length)
    {
      receivePDAFromPageArray.push(request.data);
      sendResponse({wait: currentTabIndex%10==9 ,url: countryurl+textArray[index+1]});
    }else{
      
    }
    console.log(receivePDAFromPageArray);
  }

  if(request.type=="timer"){
      sendResponse({beforeNewSearch,before10keywords,beforescriping});
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
async function createTabs(){
  await sleep(beforeNewSearch);

  currentTabIndex=0;
  // for(var i=0;i<textArray.length;i++){
  //   console.log(i);
    chrome.tabs.create({
      url: countryurl+textArray[0]
    });
  //   await sleep(10000);
  // }
  chrome.storage.sync.set({ status:true });
}

