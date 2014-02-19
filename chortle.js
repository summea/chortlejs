// Meaning
// a quest for chortle

var learned = {}

var dictionary = {
  "i": "PRP",
  "eat": "VBP",
  "salt": "NN"
}

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
  var result = "";
  items = tokenize(phrase);

  for (i = 0; i < items.length; i++) {
    console.log(getPOS(items[i]));
  }

  return result;
}

function tokenize(input) {
  input = input.replace(/([\.?])/g, " $1");
  var items = input.split(" ");
  console.log("tokens: " + items);
  return items;
}

function main() {
  input = document.getElementById("input").value;
  result = parse(input);
  output(result);
  // add to running log
  document.getElementById("log").innerHTML +=
    "> " + input + " -- " + result + "<br>";
  document.getElementById("input").value = "";    // clear input textbox
  console.log(learned);   // display what we've learned
}
