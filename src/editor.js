const vscode = require("vscode");
import table from "./table.js";
const extUri = vscode.extensions.getExtension("adamraichu.lang-editor").extensionUri;

export default class LangEdit {
  static register() {
    return vscode.window.registerCustomEditorProvider(LangEdit.viewType, new LangEdit());
  }

  static viewType = "langEditor.LangEdit";

  constructor() {}

  async resolveCustomTextEditor(document, panel, _token) {
    panel.webview.options = {
      enableScripts: true,
    };
    panel.webview.html = this.getWebviewHtml(panel, document.getText());

    function updateWebview() {
      panel.webview.postMessage({
        type: "update",
        text: document.getText(),
      });
    }

    const docSub = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });

    panel.onDidDispose(() => {
      docSub.dispose();
    });

    updateWebview();

    panel.webview.onDidReceiveMessage((e) => {
      switch (e.type) {
        case "content":
          const edit = new vscode.WorkspaceEdit();
          edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), e.code);
          return vscode.workspace.applyEdit(edit);
      }
    });
  }

  /**
   * A function to get the HTML for the webview
   * @param {vscode.WebviewPanel} panel The panel to get html for
   * @param {String} text The content of the file
   * @returns The HTML for the webview
   */
  getWebviewHtml(panel, text) {
    return `<!DOCTYPE html>
<html>
<head>
  <script src="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "editor.js"))}" defer></script>
  <link rel="stylesheet" href="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "editor.css"))}">
</head>
<body>
  <h1 id="loading">Document is loading...</h1>
  <button id="java">Render as Java</button><button id="bedrock">Render as Bedrock</button><div>Currently rendered as <span id="render">(loading)</span></div>
  <div id="main">
    <div id="content">
      <pre>
        <code id="editor" contenteditable>${text}</code>
      </pre>
    </div>
    <div id="preview">
      <pre>
        <code id="preview_inner" class="sr"></code>
      </pre>
    </div>
    ${table}
  </div>
</body>
</html>`;
  }
}
