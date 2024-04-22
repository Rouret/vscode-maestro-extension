import * as vscode from "vscode";
import { MaestroFilesProvider } from "./treeView/MaestroFilesProvider";
import { openFile } from "./commands/commands/openFile";
import { openFolder } from "./commands/commands/openFolder";
import { MaestroCommands } from "./commands/MaestroCommands";
import { launchFlow } from "./commands/commands/launchFlow";
import { registerCommand } from "./utils/command";

export const activate = (context: vscode.ExtensionContext) => {
  registerCommands(context);
  createTreeView(context);
};

const registerCommands = (context: vscode.ExtensionContext) => {
  registerCommand(context, MaestroCommands.openFile, openFile);
  registerCommand(context, MaestroCommands.openFolder, openFolder);
  registerCommand(context, MaestroCommands.launchFlow, launchFlow);
};

const createTreeView = (_context: vscode.ExtensionContext) => {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : "";

  vscode.window.createTreeView("maestroExplorer", {
    treeDataProvider: new MaestroFilesProvider(rootPath),
  });
};
