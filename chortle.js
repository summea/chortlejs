// chortle.js
// a quest for chortle

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
  "because": "IN",
  "eat": "VBP",
  "eats": "VBZ",
  "salt": "NN",
}

var learned = {}
var userResponses = new Array();

function init() {
  var commands = new Array();
  commands.push("x is y");
  commands.push("what is x?");
  commands.push("is x y?");
  commands.push("x is y and z");
  for (i = 0; i < commands.length; i++) {
    document.getElementById('command-list').innerHTML +=
      "<li>" + commands[i] + "</li>";
  }
}

function ask(question) {
  output(question);
  return question;
}

function botResponseLogic(input) {
  var botResponse = "";
  // check POS pattern input

  // PRP,VBP,NN (i eat salt)
  // PRP,VBZ,NN (he eats salt)
  if (input == "PRP,VBP,NN" || input == "PRP,VBZ,NN" || input == "PRP,VBP,UNKNOWN") {
    if (userResponses[userResponses.length-1][0].split("/")[1] == "i") {
      botResponse += "you";
    } else {
      botResponse += userResponses[userResponses.length-1][0].split("/")[1];
    }
    botResponse += " " + userResponses[userResponses.length-1][1].split("/")[1] + " " + userResponses[userResponses.length-1][2].split("/")[1] + "?";

  // UH (yes)
  // IN (because)
  } else if (input == "UH" || input == "IN") {
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
  var items = input.split(" ");
  console.log("tokens: " + items);
  return items;
}

function main() {
  input = document.getElementById("input").value;
  result = parse(input);
  //output(result);

  console.log("result");
  console.log(result);

  console.log(userResponses);
  console.log(userResponses[0][0].split("/")[1]);

  // bot response logic
  output(botResponseLogic(result));

  // add to running log
  document.getElementById("log").innerHTML +=
    "> " + input + " -- " + result + "<br>";
  document.getElementById("input").value = "";    // clear input textbox
  console.log(learned);   // display what we've learned
}
