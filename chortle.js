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

var botLearnedPatterns = Array();

// question: expected pattern response from user
var questions = [
  {"question": "what is your _name_?", "expected": "UNKNOWN,UNKNOWN|UNKNOWN"},
  {"question": "what is your _favorite food_?", "expected": "UNKNOWN,UNKNOWN|UNKNOWN"},
]

var askedQuestions = Array();

var learned = {}
var userResponses = new Array();

function init() {
  var commands = new Array();
  // commands.push("PRP VBP|VBZ NN|UNKNOWN ... i eat cake");
  for (i = 0; i < commands.length; i++) {
    document.getElementById('command-list').innerHTML +=
      "<li>" + commands[i] + "</li>";
  }
  
  // first bot question
  var question = "hello, " + questions[0]["question"];
  ask(question);
  logger(question.replace(/_/g, ""));
  console.log(askedQuestions);
}

function ask(question) {
  output(question.replace(/_/g, ""));
  askedQuestions.push(question);
  return question;
}

function botResponseLogic(input) {
  var botResponse = "";
  // check POS pattern input
  
  console.log(input);
  console.log(questions[1]["expected"]);

  // make sure there is input (no whitespace)
  if (userResponses[userResponses.length-1][0].split("/")[1].replace(/\s/g, "").length > 0) {

    // my  name        is  al
    // PRP NN|UNKNOWN  VBZ NN|UNKNOWN
    
    if (input.match(/PRP(.*)VBZ/i)) {
      // PRP(.*)VBZ (ex: my ** ** is **)
      var generatedKeyList = Array();
      var generatedValueList = Array();
      var generatedValuePatternList = Array();
      var pastVerb = false;
      
      // divide up how we learn this data (key:value)
      for (var i = 0; i < userResponses[userResponses.length-1].length; i++) {
        if (pastVerb) {
          // if after verb (goes into value)
          generatedValueList.push(userResponses[userResponses.length-1][i].split("/")[1]);
          generatedValuePatternList.push(userResponses[userResponses.length-1][i].split("/")[0]);
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
      console.log(generatedValuePatternList.join(","));

      var valueMatchedPattern = generatedValuePatternList.join(",");
      if (questions[1]["expected"].match(valueMatchedPattern) && valueMatchedPattern.replace(/\s/g, "").length > 0) {
        console.log("response as expected...");
        var item = new Object();
        item[generatedKeyList.join(" ")] = generatedValueList.join(" ");
        learn(item);
      } else {
        console.log("unexpected response!");
        botResponse += "what do you mean? ";
        // TODO: repeat question
        // TODO: know what question number we are on...
      }

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
      // FIXME: add question askBehaviors
      //botResponse += "oh, why?";
      botResponse += questions[1]["question"];
      if (askedQuestions[questions[1]["question"]]) {
        // go on to another behavior
        
      }
    }
  } else {
    botResponse += "no answer, eh...?";
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

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function main() {
  input = document.getElementById("input").value;
  result = parse(input);

  console.log("result");
  console.log(result);

  console.log(userResponses);
  console.log(userResponses[0][0].split("/")[1]);

  // teacher time
  var botResponse = "";
  botResponse = botLearnedPatterns[randomIntFromInterval(0,botLearnedPatterns.length)];
  if (!botResponse) botResponse = input;
  
  /*
  // bot response logic
  var botResponse = botResponseLogic(result);
  output(botResponse.replace(/_/g, ""));
  */
  
  // add to running log
  logger(input);
  logger(botResponse);
  //logger(botResponse.replace(/_/g, ""));
  console.log(askedQuestions);
  
  document.getElementById("input").value = "";    // clear input textbox
  console.log("learned:");
  console.log(learned);   // display what we've learned
  
  console.log("learned responses:");
  console.log(botLearnedPatterns);
}
