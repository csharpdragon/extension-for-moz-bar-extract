(async function(){
  const item = await chrome.storage.sync.get(['status']);
  console.log(item.status);
  if(!item.status){
    $("#download").addClass("disabled");
  }else{
    $("#download").removeClass("disabled");
  }
}).call(this);
var allText="";
$("#start").addClass("disabled");
$(".custom-file-input").on("change",async function(event) {
  var fileName = $(this).val().split("\\").pop();
  if(fileName.includes(".txt")){
  readFile(event.target.files[0]);
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    $("#start").removeClass("disabled");
  }else{
    $(this).siblings(".custom-file-label").addClass("selected").html("not txt file");
  }
});
$("#start").on('click',function(){
  if(!$("#start").hasClass("disabled")){
    new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set({ status:false });
        chrome.runtime.sendMessage({type: "start",text:allText}, (response) => {
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
});
function readFile(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    allText=result;
  });  
  reader.readAsText(file);
}
$("#download").on('click',function(){
  if(!$("#download").hasClass("disabled"))
    new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage({type: "download"}, (response) => {
          console.log(response);
          resolve(response);
          
          var workbook = XLSX.utils.book_new();
          worksheet = XLSX.utils.aoa_to_sheet(response);
          workbook.SheetNames.push("First");
          workbook.Sheets["First"] = worksheet;
          XLSX.writeFile(workbook, "result.xlsx");

        });
      } catch (e) {
        if (e.message == "Extension context invalidated.") {
          console.log();
        } else {
          console.log(e);
        }
    }
  })
  // var data = [
  //   ["Joa Doe", "joa@doe.com"],
  //   ["Job Doe", "job@doe.com"],
  //   ["Joe Doe", "joe@doe.com"],
  //   ["Jon Doe", "jon@doe.com"],
  //   ["Joy Doe", "joy@doe.com"]
  // ];
  // var workbook = XLSX.utils.book_new(),
  // worksheet = XLSX.utils.aoa_to_sheet(data);
  // workbook.SheetNames.push("First");
  // workbook.Sheets["First"] = worksheet;
  // XLSX.writeFile(workbook, "demo.xlsx");
});
// function readTextFile(filename) {
//   var rawFile = new XMLHttpRequest();
//   rawFile.open("GET", filename, true);
//   rawFile.onreadystatechange = function() {
//     if (rawFile.readyState === 4) {
//       var allText = rawFile.responseText;
//       console.log(allText);
//     }
//   }
//   rawFile.send();
// }
/*
var text="hello";
var activeTabId;

chrome.tabs.query( {
  active: true,
  lastFocusedWindow: true
  },
  async function(array_of_Tabs) {
    const item = await chrome.storage.sync.get(['paidforRead']);
    var tab = array_of_Tabs[0];


    if(item.paidforRead==true ){
      document.getElementById('whendisabled').style.display ='none';
      document.getElementById('whenenabled').style.display ='block';
      const itemForcount = await chrome.storage.sync.get(['countword']);
      document.getElementById('word-count').innerHTML = itemForcount.countword;
    }else{
      document.getElementById('whendisabled').style.display ='block';
      document.getElementById('whenenabled').style.display ='none';
      document.getElementById("paysupport").addEventListener('click',(event)=>{
        chrome.tabs.create({
          url: 'https://extensionpay.onrender.com/readindex.html'
        });
      }); 
    }
});*/