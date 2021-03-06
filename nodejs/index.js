const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
// const fs = require("fs");
const port = 3000;
const nthline = require('nthline');
const path = require('path')
const multer = require('multer');
const upload = multer();

const shajs = require('sha.js');

// app.set('view engine', 'pug');
// app.set('views', './views');
app.use(cors());
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//
app.use(upload.array()); 
app.use(express.static('public'));

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}
app.use(express.static(path.join(__dirname, "../Frontend")))

app.post("/nodejs/sha-256", (req,res) => {
    var request_json = req.body;
    var sum = parseInt(request_json["first_number"], 10) + parseInt(request_json["second_number"], 10);
    if (isNaN(sum)){
      return res.status(400).end("invalid inputs")
    }
    var my_hash = shajs('sha256').update(sum.toString()).digest('hex');
    res.json({
        result:my_hash
    });
    
});

app.get("", (req, res) => {
  res.sendFile(path.join(__dirname , "../Frontend/index.html"))
})

app.get("/nodejs/write", (req, res) => {
  var line_number = parseInt(req.query["linenumber"]);
  nthline(line_number, path.join(__dirname, "../h1.txt")).then((line) => {
    res.json({
      result:line
    })
  })
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)})