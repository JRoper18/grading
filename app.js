var express = require('express')
var app = express()


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'))

app.post("/", function(){
  console.log("GOT ONE");
})

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})
