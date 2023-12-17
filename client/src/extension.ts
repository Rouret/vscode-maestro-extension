import * as vscode from 'vscode';
import { MaestroFilesProvider } from './treeView/MaestroFilesProvider';
import { openFile } from './commands/commands/openFile';
import { openFolder } from './commands/commands/openFolder';
import { MaestroCommands } from './commands/MaestroCommands';
import { launchFlow } from './commands/commands/launchFlow';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';
import * as path from 'path';
import { workspace } from 'vscode';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  console.log('Maestro Client activated!');

  registerCommands(context);
  createTreeView();

  client = initializaLanguageClient(context);
  client.outputChannel.show(true);
  client.start();
}

function registerCommands(context: vscode.ExtensionContext) {
  registerCommand(context, MaestroCommands.openFile, openFile);
  registerCommand(context, MaestroCommands.openFolder, openFolder);
  registerCommand(context, MaestroCommands.launchFlow, launchFlow);
}

function registerCommand(
  context: vscode.ExtensionContext,
  maestroCommand: MaestroCommands,
  callback: (...args: any[]) => any
) {
  const command = vscode.commands.registerCommand(maestroCommand, callback);

  context.subscriptions.push(command);
}

function createTreeView() {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : '';

  vscode.window.createTreeView('maestroExplorer', {
    treeDataProvider: new MaestroFilesProvider(rootPath),
  });
}

function initializaLanguageClient(context: vscode.ExtensionContext) {
  const serverModule = context.asAbsolutePath(
    path.join('server', 'out', 'server.js')
  );

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'yaml' }],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
    },
  };

  return new LanguageClient(
    'maestroServer',
    'Maestro Server',
    serverOptions,
    clientOptions
  );
}

export function deactivate() {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
