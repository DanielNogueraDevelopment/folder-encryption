var electron = require("electron");
const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const { Menu } = require("electron");
const { MenuItem } = require("electron");
var win;
var express=require("express");
var serv = express();
var pass;
var place;
function createwindow(){
win = new BrowserWindow({
width:400,
height:500,
webPreferences: {
      nodeIntegration: true
    }
});
win.loadFile("index.html");
win.on("closed", function(){
win = null;

})
}
app.on("ready", createwindow);

var fs = require("fs");
var tar = require("tar");
var crypto = require("crypto");
function makeCipher(key) {
  var enc=crypto.createCipher('aes-256-ctr', key);
  return enc;
}
function makeDecipher(key) {
  var dec=crypto.createDecipher('aes-256-ctr', key);
return dec;
}
function encrypt(folder, k) {
  var encryptor= makeCipher(k);
    var tar_name = 'encrypted.tgz'; // the tar file name you want to give
    tar.c({
        'file': tar_name
    }, folder).then(function() {
      console.log("ok")
        var enc_writer = fs.createWriteStream(tar_name + '.enc');
        fs.createReadStream(tar_name).pipe(encryptor).pipe(enc_writer);
        try{
        fs.unlink(__dirname+ "/"+tar_name,function(){});
      }catch(e){console.log(e)}
      console.log("done")
    });
}
ipcMain.on("encryptfile", function(event,arg){
  console.log(arg);
  encrypt([arg.f], arg.key)
});
ipcMain.on("decryptfile", function(event, arg){
  console.log(arg)
  decrypt(arg.f, arg.key)
});
ipcMain.on("host", function(event, args){
  pass=args.key;
  place=args.f;
  serv.listen(3000);
})
function decrypt(filename,k) {
  var decryptor = makeDecipher(k);
  console.log(filename);
    var extractor = tar.x({
        trim: 0,
        strip: 3
          // the dir you want to extract to
    })
    fs.createReadStream(filename).pipe(decryptor).pipe(extractor);
}
serv.get("/:place/:key", function(req,res){
  if(req.params.key==pass){
    res.sendFile(place +"/" + req.params.place)
  }else{
    res.send("Your key did not match");
  }
})
