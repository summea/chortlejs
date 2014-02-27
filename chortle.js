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
  "like": "VBP",

  "salt": "NN",
}

var questions = [
  "what is your name?",
  "what is your favorite food?",
]

var askedQuestions = Array();

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
  var question = "hello, " + questions[0];
  output(question);
  askedQuestions.push(questions[0]);
  logger(question);
  console.log(askedQuestions);
}

function ask(question) {
  output(question);
  askedQuestions.push(question);
  return question;
}

function botResponseLogic(input) {
  var botResponse = "";
  // check POS pattern input
  
  /*
      my  name        is  al
      PRP NN|UNKNOWN  VBZ NN|UNKNOWN
  */
  
  if (input.match(/PRP(.*)VBZ/i)) {
    // PRP(.*)VBZ (ex: my ** ** is **)
    var generatedKeyList = Array();
    var generatedValueList = Array();
    var pastVerb = false;
    
    // divide up how we learn this data (key:value)
    for (var i = 0; i < userResponses[userResponses.length-1].length; i++) {
      if (pastVerb) {
        // if after verb (goes into value)
        generatedValueList.push(userResponses[userResponses.length-1][i].split("/")[1]);
      } else {
        // if before or equal to verb (goes into key)
        generatedKeyList.push(userResponses[userResponses.length-1][i].split("/")[1]);
      }

      if (userResponses[userResponses.length-1][i].split("/")[0].match(/VBZ/i)) {
        pastVerb = true;
      }
    }
    console.log("generated key/value lists joined individually");
    console.log(generatedKeyList.join(" "));
    console.log(generatedValueList.join(" "));

    var item = new Object();
    //item[generatedKeyList.join(" ")] = userResponses[userResponses.length-1][userResponses[userResponses.length-1].length-1].split("/")[1];
    item[generatedKeyList.join(" ")] = generatedValueList.join(" ");
    learn(item);

  } else if (input.match(/NN|UNKNOWN/i)) {
    // one word answer ... add question data to learned information
    var generatedValueList = Array();
    
    // collect values for learned data
    for (var i = 0; i < userResponses[userResponses.length-1].length; i++) {
      generatedValueList.push(userResponses[userResponses.length-1][i].split("/")[1]);
    }

    var item = new Object();
    item[askedQuestions[askedQuestions.length-1]] = generatedValueList.join(" ");
    learn(item);
  }
 
  if (input.match(/PRP,VBP,NN|PRP,VBZ,NN|PRP,VBP,UNKNOWN|PRP,VBZ,UNKNOWN/i)) {
    // PRP,VBP,NN (ex: i eat salt)
    // PRP,VBZ,NN (ex: he eats salt)
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
    // FIXME: ask question behaviors
    //botResponse += "oh, why?";
    botResponse += questions[1];
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

function learn(info) {
  for (var item in info) {
    learned[item] = info[item];
  }
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
  console.log(askedQuestions);
  
  document.getElementById("input").value = "";    // clear input textbox
  console.log("learned:");
  console.log(learned);   // display what we've learned
}
