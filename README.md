# Minecraft .lang Editor

<!-- markdownlint-disable MD033 -->
<div align="center">

[![Last Updated](https://img.shields.io/visual-studio-marketplace/last-updated/adamraichu.lang-editor?color=%2300008b&logo=visual%20studio%20code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.lang-editor)
[![VSCode Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/adamraichu.lang-editor?color=00008b&logo=Visual%20Studio%20Code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.lang-editor)
[![Install Count](https://img.shields.io/visual-studio-marketplace/i/adamraichu.lang-editor?color=darkblue&label=Install%20Count&logo=visual%20studio%20code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.lang-editor)
[![Rating](https://img.shields.io/visual-studio-marketplace/stars/adamraichu.lang-editor?color=darkblue&label=Rating&logo=visual%20studio%20code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.lang-editor&ssr=false#review-details)

[![GitHub issues by-label](https://img.shields.io/github/issues/adamraichu/vscode-lang-editor/confirmed?color=orange&logo=github)](https://github.com/AdamRaichu/vscode-lang-editor/labels/confirmed)
[![GitHub stars](https://img.shields.io/github/stars/adamraichu/vscode-lang-editor)](https://github.com/adamraichu/vscode-lang-editor/stargazers)
[![GitHub license](https://img.shields.io/github/license/adamraichu/vscode-lang-editor)](https://github.com/AdamRaichu/vscode-lang-editor/blob/main/LICENSE)

</div>

A VS Code extension which contributes a custom editor for Minecraft's `.lang` files.

> **Warning**: This extension is still in early development. Opening a large file currently causes the extension to hang my browser, so I would recommend only using it for small files. Version 2 will have a fixed method of rendering. Sorry for the inconvenience.

## Installation

Install from the VSCode Extension panel.
Search `adamraichu.lang-editor`.

You can also find this extension [on the VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=AdamRaichu.lang-editor).

## Usage

This editor has two `<pre>` elements.
One shows the raw text of the file; the other shows a preview of what the value of the string would look like in Minecraft.

There are also two buttons.
Clicking on these buttons will change the render method to either Bedrock or Java (depending on which you click).

At the bottom of the editor is a table showing color codes (`§`).

Your changes will automatically be saved after 3 seconds of inactivity
