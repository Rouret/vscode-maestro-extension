import * as vscode from "vscode";

export const openFile = (filePath: string) => {
  const openPath = vscode.Uri.file(filePath);
  vscode.workspace.openTextDocument(openPath).then((doc) => {
    vscode.window.showTextDocument(doc);
  });
};
