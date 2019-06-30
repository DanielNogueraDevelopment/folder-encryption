var {ipcRenderer} = require("electron");
const { clipboard } = require('electron')
function makeran(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   clipboard.writeText(result)
   return result;
}
//ipcRenderer.send("encryptfile", tosend);
var folder;
$(document).ready(function(){
  $(".encrypt").click(function(){
    ipcRenderer.send("encryptfile", {"f":folder,"key":$("#key").val()});
  })

  $(".decrypt").click(function(){
    tosend={
      "f":folder,
      "key": $("#key").val()
    }
    ipcRenderer.send("decryptfile", tosend)
  });

$("#random").click(function(){
  $("#key").val(makeran(200));
})
$("#host").click(function(){
  ipcRenderer.send("host", {"f":folder,"key":$("#key").val()})
  $("#host").html("Hosting...")
})
  $("#visit").click(function(){
    window.open(`http://localhost:3000/${$("#file").val()}/${$("#keyvisit").val()}`,'File Viewer','nodeIntegration=no')
  })
});

document.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e)
    folder=e.dataTransfer.files[0].path;
    return false;
});

document.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
});
