var express = require('express')
var app = express()
const {dialog} = require('electron')
var bodyParser = require('body-parser')
var fs = require('fs'); // Load the File System
var officegen = require('officegen');
var mammoth = require('mammoth');
var cheerio = require('cheerio');

app.use(bodyParser.json())
app.use(express.static(__dirname))

app.listen(8000, function () {
  console.log("Server is up");
})
app.post("/export-word", function(req, res){
  var docx = officegen ( 'docx' );
  //Do later
})
app.post("/import-word", function(req, res){
  
})
app.post("/save", function(req, res){
  // You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
  dialog.showSaveDialog(function (fileName) {
         if (fileName === undefined){
              console.log("You didn't save the file");
              return;
         }
         // fileName is a string that contains the path and filename created in the save file dialog.
         fs.writeFile(fileName + ".transcript", JSON.stringify(req.body), function (err) {
             if(err){
                 console.log("An error ocurred creating the file "+ err.message)
             }
             console.log("The file has been succesfully saved");
         });
  });
})
function wordToJSON(){
  mammoth.convertToHtml({path: "./original.docx"})
    .then(function(result){
        var html = result.value; // The generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion
        const $ = cheerio.load(html);
        const fTable = $("table").first();
        fTable.attr("id", "gradeTable")
        let rowNum = 0;
        let json = [];
        $("#gradeTable tr").each(function() {
          rowNum++;
          if(rowNum > 2){ //Skip the first two, they're headers
            let columnCount = 0;
            let currentData = {};
            let $row = $(this);
            $row.children().each(function() {
              columnCount++;
              let cellData = $(this).html();
              if(columnCount == 2){
                const name = $(this).find('p').html();
                currentData["course name"] = name;
                if(name.toLowerCase().includes("honors")){
                  currentData["extra"] = 0.5;
                }
                else if(name.toLowerCase().includes("ap ")){
                  currentData["extra"] = 1;
                }

              }
              else if(columnCount == 3){ //Units earned
                currentData["units earned"] = parseFloat($(this).find('p').html());
              }
              if(columnCount > 3){
                if($(this).children().length > 0 ) { //Look for text in one of the grade boxes.
                  currentData["grade"] = columnCount - 2;
                }
              }
            });
            json.push(currentData);
          }
        });
        console.log(json);
    })
    .done();
}
