var express = require('express')
var app = express()
const {dialog} = require('electron')
var bodyParser = require('body-parser')
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

app.use(bodyParser.json())
app.use(express.static(__dirname))

app.listen(8000, function () {
  console.log("Server is up");
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
