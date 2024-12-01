function hashfile() {
  readbinaryfile(fileselector.files[0])
    .then(function(result) {
      result = new Uint8Array(result);
      return window.crypto.subtle.digest('SHA-256', result);
    }).then(function(result) {
      result = new Uint8Array(result);
      var resulthex = Uint8ArrayToHexString(result);
      divresult.innerText = 'result: ' + resulthex;
    });
}

function readbinaryfile(file) {
  return new Promise((resolve, reject) => {
    var fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result)
    };
    fr.readAsArrayBuffer(file);
  });
}

function Uint8ArrayToHexString(ui8array) {
  var hexstring = '',
    h;
  for (var i = 0; i < ui8array.length; i++) {
    h = ui8array[i].toString(16);
    if (h.length == 1) {
      h = '0' + h;
    }
    hexstring += h;
  }
  var p = Math.pow(2, Math.ceil(Math.log2(hexstring.length)));
  hexstring = hexstring.padStart(p, '0');
  return hexstring;
}
