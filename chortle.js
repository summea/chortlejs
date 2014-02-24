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

function getPOS(key)
{
  var result = "";
  if (dictionary[key])
    result = dictionary[key];
  return result;
}

function output(output) {
  document.getElementById("output").value = output;
}

function parse(phrase) {
  var result = new Array();
  items = tokenize(phrase);

  for (i = 0; i < items.length; i++) {
    console.log(getPOS(items[i]));
    result.push(getPOS(items[i]));
  }

  return result.join(","); 
}

function tokenize(input) {
  input = input.replace(/([\.?])/g, " $1");
  var items = input.split(" ");
  // add to user phrase stack
  //userResponses[userResponses.length] = items;
  userResponses.push(items);
  console.log(userResponses);
  console.log("tokens: " + items);
  return items;
}

function main() {
  input = document.getElementById("input").value;
  result = parse(input);
  //output(result);

  var botResponse = "";
  // check POS pattern result
  if (result == "PRP,VBP,NN" || result == "PRP,VBZ,NN") {
    if (userResponses[userResponses.length-1][0] == "i") {
      botResponse += "you";
    } else {
      botResponse += userResponses[userResponses.length-1][0];
    }
    botResponse += " " + userResponses[userResponses.length-1][1] + " " + userResponses[userResponses.length-1][2] + "?";
  } else if (result == "UH") {
    botResponse += "I see";
    botResponse += " do you like " + userResponses[userResponses.length-2][2] + "?"; 
  }
  output(botResponse);

  // add to running log
  document.getElementById("log").innerHTML +=
    "> " + input + " -- " + result + "<br>";
  document.getElementById("input").value = "";    // clear input textbox
  console.log(learned);   // display what we've learned
}
