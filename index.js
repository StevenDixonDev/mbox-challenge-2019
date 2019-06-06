var fs = require('fs');

//Regex will take to long to parse larger files so we need to break the file down into parts based
//based on formatting

function loadDataFromFile(file, callback){
  return fs.readFile(file, 'utf8', callback);
}

function test(err, data){
  //console.log(err)
  //console.log(data)
  let chunks = splitIntoChunks(data);
  //let editedChunks = chunks.map((item, index)=> console.log(item, `index:${index}`)); 
  //console.log(chunks.length)
  
}
//function

function splitIntoChunks(data){
  //split the data file into chunks based on the fact that all mbox messages start with a single line break followed by From
  let chunkArray = data.match(/From(.*\n+)*?-{2} (.*\n)+?\n/gm)
  console.log(chunkArray)
  //return data.split(/\n(?=From[^:])/gm);
}

function replaceTextInBody(textItem){
  return textItem.replace(/(?<=(From) (.*\n)+)\n(.*\n*)+(?=\n--)/gm, reverseBody)
}

function reverseBody(regexMatch){
  return regexMatch.split(/\n/gm).reverse().join('\r');
}

loadDataFromFile('./mbox.full', test);