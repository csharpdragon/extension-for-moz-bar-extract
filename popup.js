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
var timeText="{}";
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


$("#customtimeFile").on("change",async function(event) {
  var fileName = $(this).val().split("\\").pop();
  if(fileName.includes(".txt") || fileName.includes(".js") || fileName.includes(".json")){
    readTimeFile(event.target.files[0]);
    $(this).siblings("#customtimeFilelabel").addClass("selected").html(fileName);
  }else{
    $(this).siblings("#customtimeFilelabel").addClass("selected").html("not txt file");
  }
});


$("#start").on('click',function(){
  if(!$("#start").hasClass("disabled")){
    new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set({ status:false });
        chrome.runtime.sendMessage({type: "start",text:allText, timer: JSON.parse(timeText)}, (response) => {
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

function readTimeFile(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    timeText=result;
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
});