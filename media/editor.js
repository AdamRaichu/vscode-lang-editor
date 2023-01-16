//#region DEFINITIONS

const vscode = acquireVsCodeApi();
const editor = document.getElementById("editor");
const preview = document.getElementById("preview_inner");
const java = document.getElementById("java");
const bedrock = document.getElementById("bedrock");
const render = document.getElementById("render");
var formatters = {
  "§0": '<span class="s0">',
  "§1": '<span class="s1">',
  "§2": '<span class="s2">',
  "§3": '<span class="s3">',
  "§4": '<span class="s4">',
  "§5": '<span class="s5">',
  "§6": '<span class="s6">',
  "§7": '<span class="s7">',
  "§8": '<span class="s8">',
  "§9": '<span class="s9">',
  "§a": '<span class="sa">',
  "§b": '<span class="sb">',
  "§c": '<span class="sc">',
  "§d": '<span class="sd">',
  "§e": '<span class="se">',
  "§f": '<span class="sf">',
  "§g": '<span class="sg">',
  "§k": '<span class="sk">',
  "§l": '<span class="sl">',
  "§m": '<span class="sm">',
  "§n": '<span class="sn">',
  "§o": '<span class="so">',
  "§r": '<span class="sr">',
};

/**
 * A method for converting strings containing `§` symbols to colorized HTML
 * @param {String} value The string to colorize
 */
function highlightString(value) {
  var buffer = value;
  var keys = Object.keys(formatters);
  var spans = 0;

  for (var i = 0; i < keys.length; i++) {
    var re = new RegExp(keys[i], "g");
    if (buffer.match(re) === null) {
      continue;
    }
    spans += buffer.match(re).length;
    buffer = buffer.replace(re, formatters[keys[i]]);
  }
  for (var i = 0; i < spans; i++) {
    buffer += "</span>";
  }
  return buffer;
}

function langToJson(lang) {
  /**
   * @type {String[]}
   */
  var lines = lang.split("\n");
  var result = {};
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    if (l.includes("#")) {
      l = l.substring(0, l.indexOf("#"));
    }
    result[l.substring(0, l.indexOf("="))] = l.substring(l.indexOf("=") + 1, l.length);
  }
  result.$lines = lines;
  return result;
}

function updateContent(text) {
  editor.innerText = text;
  var json = langToJson(text);
  /**
   * @type {String[]}
   */
  var lines = json.$lines;
  var p = "";

  for (var i = 0; i < lines.length; i++) {
    p += highlightString(json[lines[i].substring(0, lines[i].lastIndexOf("="))]);
    p += "<br>";
  }

  preview.innerHTML = p;
}

//#endregion

document.getElementById("loading").remove();

window.addEventListener("message", (event) => {
  const message = event.data;
  switch (message.type) {
    case "update":
      const text = message.text;
      updateContent(text);
      vscode.setState({ text });
      return;
  }
});

const state = vscode.getState();
if (state) {
  updateContent(state.text);
}

//#region Typing handler
var typingTimer; //timer identifier
var doneTypingInterval = 1000; //time in ms, 5 seconds for example
var $input = editor;

//on keyup, start the countdown
$input.addEventListener("keyup", function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown
$input.addEventListener("keydown", function () {
  clearTimeout(typingTimer);
});
//#endregion

var last = editor.innerText;
//user is "finished typing," do something
function doneTyping() {
  if (editor.innerText !== last) {
    updateContent(editor.innerText);
    last = editor.innerText;
    vscode.postMessage({ type: "content", code: editor.innerText });
  }
}

java.addEventListener("click", function () {
  document.body.classList.add("java");
  document.body.classList.remove("bedrock");
  render.innerText = "Java";
});
bedrock.addEventListener("click", function () {
  document.body.classList.add("bedrock");
  document.body.classList.remove("java");
  render.innerText = "Bedrock";
});
java.click();
