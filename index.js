var fs = require('fs');

//Regex will take to long to parse larger files so we need to break the file down into parts based
//based on formatting

function loadDataFromFile(file, callback){
  return fs.readFile(file, 'utf8', callback);
}

function test(err, data){
  console.log(data);
}
//function 