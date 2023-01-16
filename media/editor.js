//#region DEFINITIONS

const vscode = acquireVsCodeApi();
const editor = document.getElementById("editor");
const preview = document.getElementById("preview_inner");
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
  var lines = result.$lines;
  var p = "";

  for (var i = 0; i < lines.length; i++) {
    p += highlightString(json[lines[i].substring(0, lines[i].lastIndexOf("="))]);
  }

  preview.innerText = p;
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

var last;

setInterval(function () {
  if (editor.innerText !== last) {
    last = editor.innerText;
    vscode.postMessage({ type: "content", code: editor.innerText });
  }
}, 1000);

const state = vscode.getState();
if (state) {
  updateContent(state.text);
}
