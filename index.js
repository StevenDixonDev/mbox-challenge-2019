const fs = require('fs');

/*
  All Inbox, LLC - Summer Coding Challenge 2019
  Author - Steven Dixon
  Email - StevenDixon1128@gmail.com
  ---------------------------------------------
  This entry is my attemp at solving the issue outlined here (https://allinboxchallenge0619.splashthat.com)
  The entry point is located at the end of the file
*/

// Function to load data using fs using a file location
function loadDataFromFile(file) {
  return fs.readFile(file, 'utf8', asyncCallbackHandle);
}

// Function to save data to file using fs 
function saveDatatoFile(file, data) {
  return fs.writeFile(file, data, (err) => {
    if (err) throw 'There was an issue saving the file please, check that the file is not in use or specify another file.';
    console.log("Successfully Written Data to File.");
  });
}

// The callback we will use to parse and mutate our data
function processLoadedData(dataFromFile) {
  /*
   Use a function to split the loaded data into an array of chunks
   SplitIntoChunks accepts a string and returns an array of strings
   FormatChunks accepts an array of strings and returns a formatted array of strings
   Create a promise in the case that formatting takes a while due to large arrays
  */
  return new Promise((resolve) => {
    const formattedData = combineChunks(formatChunks(splitIntoChunks(dataFromFile)));
    // Check for issues while formatting data
    if (formattedData.length === 0 || !formattedData) {
      // Reject if any are found
      throw 'Issue with formatting data, please check that file is not empty or exists.';
    } else {
      // Resolve if no issues are found
      resolve(formattedData);
    }
  });
}

function splitIntoChunks(data) {
  /* 
  Split the data file into chunks based on the fact that all mbox 
  messages start with a single line break followed by 'From' per specification
  */
  let chunkArray = data.split(/\n(?=From[^:])/);
  // Return thes split data
  return chunkArray;
}

// Function use to initiate the formatting
function formatChunks(arrayOfChunks) {
  // Maps split array of chunks into replaceTextInBody to be formatted
  const formattedChunks = arrayOfChunks.map((item) => {
    return replaceTextInBody(item);
  });
  return formattedChunks;
}

// Function combines an array into a String
function combineChunks(arrayOfChunks) {
  return arrayOfChunks.join("");
}

function replaceTextInBody(textItem) {
  // Define regex to test for the closing --
  const closingReg = new RegExp(/-{2} [\r\n]/, 'g');
  // Create a variable to store the modified text
  let output = '';
  // Check to see if body includes -- at end of body
  if (closingReg.test(textItem)) {
    const bodyReg = new RegExp(/((?<=^[\r\n]{2,})[\s\S]*(?=^-- ))/, 'gm');
    // Call reverseEmailBody on matches to reverse the strings
    output = textItem.replace(bodyReg, reverseEmailBody);
  } else {
    const bodyReg = new RegExp(/((?<=^[\r\n]{2,})[\s\S]*)/, 'gm');
    // Call reverseEmailBody on matches to reverse the strings
    output = textItem.replace(bodyReg, reverseEmailBody);
  }
  return output;
}

// Function reverse lines text in the body
function reverseEmailBody(regexMatch) {
  return regexMatch.split(/\n/).reverse().join('\n');
}

// Use async function so that nothing is blocked during loading or formatting
async function asyncCallbackHandle(err, loadedData) {
  //  Handle error from loadDataFrom File
  if (err) throw 'There was an issue loading the specified file, please check the file exists and try again.'
  else {
    try{
      const output = await processLoadedData(loadedData);
      await saveDatatoFile('output.full', output);
      return true;
    }catch(err){
      console.log(err)
      return false;
    }
  }
}

// Entry point Starts when 
loadDataFromFile('./mbox.full');

module.exports = { loadDataFromFile }