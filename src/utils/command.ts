import * as vscode from "vscode";
import { MaestroCommands } from "../commands/MaestroCommands";

export const registerCommand = (
  context: vscode.ExtensionContext,
  maestroCommand: MaestroCommands,
  callback: (...args: any[]) => any
) => {
  const command = vscode.commands.registerCommand(maestroCommand, callback);

  context.subscriptions.push(command);
};
