// chortle.js
// a quest for chortle

// ADDME: common verbs
var dictionary = {
  "yes": "UH",
  "no": "DT",

  "i": "PRP",
  "you": "PRP",
  "he": "PRP",
  "she": "PRP",
  "it": "PRP",
  "we": "PRP",
  "they": "PRP",
  "me": "PRP",
  "him": "PRP",
  "her": "PRP",
  "us": "PRP",
  "them": "PRP",
  "my": "PRP",
  "your": "PRP",
 
 "because": "IN",
  
  "eat": "VBP",
  "eats": "VBZ",
  "is": "VBZ",

  "salt": "NN",
}

var learned = {}
var userResponses = new Array();

function init() {
  var commands = new Array();
  commands.push("PRP VBP|VBZ NN|UNKNOWN ... i eat cake");
  for (i = 0; i < commands.length; i++) {
    document.getElementById('command-list').innerHTML +=
      "<li>" + commands[i] + "</li>";
  }
  
  // first bot question
  var question = "hello, what is your name?";
  output(question);
  logger(question);
}

function ask(question) {
  output(question);
  return question;
}

function botResponseLogic(input) {
  var botResponse = "";
  // check POS pattern input
  
  /*
      my  name        is  al
      PRP NN|UNKNOWN  VBZ NN|UNKNOWN
  */
  
  // TODO: find a way to use regexps to check inside pattern for matches (and, perhaps, crunch found pattern matches together)
  
  if (input == "PRP,NN" || input == "PRP,UNKNOWN") {
    console.log("checking noun phrase");
    
  }
  
  // ADDME: relative reg exp (capture these patterns within extra (unnecessary for now) words
  if (input == "PRP,VBP,NN" || input == "PRP,VBZ,NN" || input == "PRP,VBP,UNKNOWN" || input == "PRP,VBZ,UNKNOWN") {
    // PRP,VBP,NN (i eat salt)
    // PRP,VBZ,NN (he eats salt)
    if (userResponses[userResponses.length-1][0].split("/")[1] == "i") {
      botResponse += "you";
    } else {
      // ADDME: who are we talking about?
      botResponse += userResponses[userResponses.length-1][0].split("/")[1];
    }
    botResponse += " " + userResponses[userResponses.length-1][1].split("/")[1] + " " + userResponses[userResponses.length-1][2].split("/")[1] + "?";
  } else if (input == "UH" || input == "IN") {
    // UH (yes)
    // IN (because)
    botResponse += "I see... ";
    if (userResponses[userResponses.length-2][0].split("/")[1] != "yes") {
      if (userResponses[userResponses.length-2][2])
        botResponse += "do you like " + userResponses[userResponses.length-2][2].split("/")[1] + "?"; 
    }
  } else {
    botResponse += "oh, why?";
  }

  return botResponse;
}

function getPOS(key) {
  var result = "";
  if (dictionary[key])
    result = dictionary[key];
  else
    result = "UNKNOWN";
  return result;
}

function logger(output) {
  document.getElementById("log").innerHTML +=
    "> " + output + "<br>";
}

function output(output) {
  document.getElementById("output").value = output;
}

function parse(phrase) {
  var result = new Array();
  var preUserResponsePush = new Array();
  items = tokenize(phrase);

  for (i = 0; i < items.length; i++) {
    console.log(getPOS(items[i]));
    result.push(getPOS(items[i]));
    preUserResponsePush.push(getPOS(items[i]) + "/" + items[i]);
  }

  // add to user phrase stack
  userResponses.push(preUserResponsePush);
  console.log(userResponses);

  return result.join(","); 
}

function tokenize(input) {
  input = input.replace(/([\.?\/])/g, " $1");
  input = input.toLowerCase();
  var items = input.split(" ");
  console.log("tokens: " + items);
  return items;
}

function main() {
  input = document.getElementById("input").value;
  result = parse(input);

  console.log("result");
  console.log(result);

  console.log(userResponses);
  console.log(userResponses[0][0].split("/")[1]);

  // bot response logic
  var botResponse = botResponseLogic(result);
  output(botResponse);

  // add to running log
  
  logger(input);
  logger(botResponse);
  
  document.getElementById("input").value = "";    // clear input textbox
  console.log(learned);   // display what we've learned
}
