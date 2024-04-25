import * as vscode from "vscode";
import * as path from "path";
import {
  ItemTree,
  ItemTreeType,
  getFolderTreeFromParentPath,
} from "./FileSystemTreeBuilder";
import * as fs from "fs";

const MAESTRO_ROOT_FOLDER_NAME = ["maestro", ".maestro"];

type ItemTreeChangeEvent = ItemTree | undefined | null | void;

export class MaestroFilesProvider implements vscode.TreeDataProvider<ItemTree> {
  private _onDidChangeTreeData: vscode.EventEmitter<ItemTreeChangeEvent> =
    new vscode.EventEmitter<ItemTreeChangeEvent>();
  readonly onDidChangeTreeData: vscode.Event<ItemTreeChangeEvent> =
    this._onDidChangeTreeData.event;
  constructor(private workspaceRoot: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ItemTree): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ItemTree): Thenable<ItemTree[]> {
    if (!this.workspaceRoot) {
      return this.handleEmptyWorkspace();
    }

    const parentPath = this.resolveParentPath(element);
    return this.loadChildren(parentPath);
  }

  private handleEmptyWorkspace(): Thenable<ItemTree[]> {
    vscode.window.showInformationMessage(
      "No Maestro project found in the empty workspace"
    );
    return Promise.resolve([]);
  }

  private resolveParentPath(element?: ItemTree): string {
    if (element && element.type === ItemTreeType.folder) {
      return element.path;
    }

    let maestroRootFolder = "";

    for (const folderName of MAESTRO_ROOT_FOLDER_NAME) {
      const folderPath = path.join(this.workspaceRoot, folderName);
      if (fs.existsSync(folderPath)) {
        maestroRootFolder = folderName;
        break;
      }
    }

    return path.join(this.workspaceRoot, maestroRootFolder);
  }

  private loadChildren(parentPath: string): Thenable<ItemTree[]> {
    const tree = getFolderTreeFromParentPath(parentPath);
    return Promise.resolve(tree.children);
  }
}
