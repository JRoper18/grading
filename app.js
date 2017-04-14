var express = require('express')
var app = express()
const {dialog} = require('electron')
var bodyParser = require('body-parser')
var async = require ( 'async' );
var path = require('path');
var fs = require('fs'); // Load the File System
var officegen = require('officegen');
var mammoth = require('mammoth');
var cheerio = require('cheerio');
var cheerioAdv = require('cheerio-advanced-selectors')

cheerio = cheerioAdv.wrap(cheerio);

app.use(bodyParser.json())
app.use(express.static(__dirname))

/*
app.listen(8000, function () {
  console.log("Server is up");
})
app.post("/export-word", function(req, res){
  var docx = officegen ( 'docx' );
  //Do later
})
app.post("/import-word", function(req, res){
  dialog.showOpenDialog(function(fileName){
    if (fileName === undefined){
         console.log("You didn't save the file");
         return;
    }
    // fileName is a string that contains the path and filename created in the open file dialog.
    wordToJSON(fileName[0]).then(function(jsonDoc){
      res.send(jsonDoc);
    });
  });
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
function wordToJSON(inputPath){
  return new Promise(function(resolve, reject){
    let json = [];
    mammoth.convertToHtml({path: inputPath})
      .then(function(result){
          var html = result.value; // The generated HTML
          var messages = result.messages; // Any messages, such as warnings during conversion
          const $ = cheerio.load(html);
          const fTable = $("table").first();
          fTable.attr("id", "gradeTable")
          let rowNum = 0;
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
                  else{
                    currentData["extra"] = 0;
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
          let count = 0;
          $("table").eq(1).children().each(function(){
              let currentData = {};
              if(count == 0){
                //SKIP
              }
              else{
                let $row = $(this);
                currentData["extra"] = 0;
                currentData["units earned"] = parseFloat($row.children().eq(1).find('p').html());
                currentData["course name"] = (count == 1) ? $row.children().eq(0).find('h6').html() : $row.children().eq(0).find('strong').html()
                let letterGrade = $row.children().eq(2).find('p').html();
                let numberGrade; 
                switch(letterGrade){
                  case "A":
                    numberGrade = 4;
                    break;
                  case "B":
                    numberGrade = 3;
                    break;
                  case "C":
                    numberGrade = 2;
                    break;
                  case "D":
                    numberGrade = 1;
                    break;
                }
                currentData["grade"] = numberGrade;
                if(currentData["course name"] == null){
                  currentData["course name"] = "Course Name";
                }
                json.push(currentData);   
              }  
              count++;                   
          });
      })
      .done(function(){
        resolve(json);
      });
    });
}
*/

var studentData = {
  "name": "Jack Roper",
  "gradDate": "2018",
  "dob": "09/18/01",
  "id": "178225",
  "gpa": 4.0
}
function generateWordDoc(){
  var docx = officegen ( {
    type: 'docx',
    orientation: 'portrait'
  } );  
  var pObj = docx.createP({
    align: 'center'
  });
  pObj.addImage(path.resolve(__dirname, 'images/svvsd.png' ), {cx: 200, cy: 100} );
  var pObj = docx.createP({
    align: 'center'
  });
  pObj.addText('UNIVERSAL HIGH SCHOOL PROGRAM', {font_face: 'Times New Roman', bold: true, font_size: 14});
  var pObj = docx.createP({
    align: 'center'
  });
  pObj.addText('Official Transcript, Part I', {font_face: 'Times New Roman', bold: true, font_size: 14, underline: true});
  var pObj = docx.createP({
  });
  pObj.addText('Student Name: ' + studentData.name + " Graduation Date: " + studentData.gradDate, {bold: true, font_face: 'Times New Roman', font_size: 12});
  pObj.addLineBreak();
  pObj.addText('DOB: ' + studentData.dob + " Student ID: " + studentData.id,  {bold: true, font_face: 'Times New Roman', font_size: 12});
  pObj.addLineBreak();
  pObj.addText('Signature of Registar:_______________ *GPA Equivalency:' + studentData.gpa,  {bold: true, font_face: 'Times New Roman', font_size: 12});
  var pObj = docx.createP({
  });
  pObj.addText('The following Learning Units are acquired through both traditional coursework and nontraditional learning experiences.  Level of proficiency is based on final products, performances or assessments.', {font_face: 'Times New Roman', font_size: 10})
  var pObj = docx.createP({
  });
  pObj.addText('*Universal HS students do not earn a traditional GPA, nor are they ranked in comparison to other students.  An Equivalency GPA is calculated based on levels of proficiency for Learning Units, combined with courses grades in elective areas (Parts A and D).  See Program Profile for further information.', {bold: true, font_face: 'Times New Roman', font_size: 9})







  var out = fs.createWriteStream ( './out.docx' );

  out.on ( 'error', function ( err ) {
    console.log ( err );
  });

  async.parallel ([
    function ( done ) {
      out.on ( 'close', function () {
        console.log ( 'Finish to create a DOCX file.' );
        done ( null );
      });
      docx.generate ( out );
    }

  ], function ( err ) {
    if ( err ) {
      console.log ( 'error: ' + err );
    } // Endif.
  });

}

generateWordDoc();


