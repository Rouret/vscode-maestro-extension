import * as vscode from "vscode";
import { ItemTree } from "../../treeView/FileSystemTreeBuilder";

export const launchFlow = (fileItem: ItemTree) => {
  const completePath = fileItem.command?.arguments?.[0];
  if (completePath) {
    const terminal = vscode.window.createTerminal();
    terminal.sendText(`maestro test ${completePath}`);
    terminal.show();
  }
};
