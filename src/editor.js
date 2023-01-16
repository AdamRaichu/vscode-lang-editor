const vscode = require("vscode");
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
    panel.webview.html = this.getWebviewHtml(document.getText());

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
          const edit = new vscode.workspaceEdit();
          edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), e.code);
          return vscode.workspace.applyEdit(edit);
      }
    });
  }

  getWebviewHtml(text) {
    return `<!DOCTYPE html>
<html>
<head>
  <script src="${vscode.Uri.joinPath(extUri, "media", "editor.js")}" defer></script>
  <link rel="stylesheet" href="${vscode.Uri.joinPath(extUri, "media", "editor.css")}">
</head>
<body>
  <h1 id="loading">Document is loading...</h1>
  <div id="main">
    <div id="content">
      <pre>
        <code id="editor">${text}</code>
      </pre>
    </div>
    <div id="preview>
      <pre>
        <code id="preview_inner"></code>
      </pre>
    </div>
  </div>
</body>
</html>`;
  }
}
