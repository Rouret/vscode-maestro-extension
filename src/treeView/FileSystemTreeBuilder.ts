import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import { MaestroCommands } from "../commands/MaestroCommands";
import { getIconPathByIconType, IconType } from "../utils/ressourceManager";

export enum ItemTreeType {
  folder = "folder",
  yamlFile = "yamlFile",
  none = "none",
}

export class ItemTree extends vscode.TreeItem {
  type: ItemTreeType;
  children: ItemTree[];
  iconPath: { light: string | vscode.Uri; dark: string | vscode.Uri };
  path: string;
  command: vscode.Command | undefined;

  constructor(
    label: string,
    path: string,
    children: ItemTree[],
    collapsibleState: vscode.TreeItemCollapsibleState,
    type: ItemTreeType,
    iconType: IconType
  ) {
    super(label, collapsibleState);
    this.path = path;
    this.children = children;
    this.type = type;
    this.contextValue = type;
    this.iconPath = getIconPathByIconType(iconType);
  }
}

export class FolderTree extends ItemTree {
  constructor(label: string, path: string, children: ItemTree[]) {
    super(
      label,
      path,
      children,
      vscode.TreeItemCollapsibleState.Expanded,
      ItemTreeType.folder,
      IconType.folder
    );
    this.children = children;

    // If the folder is empty we don't want to show the expand arrow
    if (this.children.length === 0) {
      this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }

    this.command = {
      command: MaestroCommands.openFolder,
      title: "",
      arguments: [path],
    };
  }
}

export class FileTree extends ItemTree {
  content: string;

  constructor(label: string, path: string, content: string) {
    super(
      label,
      path,
      [],
      vscode.TreeItemCollapsibleState.None,
      ItemTreeType.yamlFile,
      IconType.file
    );
    this.content = content;
    this.command = {
      command: MaestroCommands.openFile,
      title: "",
      arguments: [path],
    };
  }
}

export const getFolderTreeFromParentPath = (parentPath: string): ItemTree => {
  const stats = fs.lstatSync(parentPath);

  if (stats.isDirectory()) {
    const children = fs
      .readdirSync(parentPath)
      .map((childPath) => path.join(parentPath, childPath))
      .filter((fullChildPath) => {
        const childStats = fs.lstatSync(fullChildPath);
        return (
          childStats.isDirectory() || path.extname(fullChildPath) === ".yaml"
        );
      })
      .map((validChildPath) => {
        return getFolderTreeFromParentPath(validChildPath);
      });
    return new FolderTree(path.basename(parentPath), parentPath, children);
  } else {
    const content = fs.readFileSync(parentPath, "utf8");
    const filePath = path.join(parentPath);
    return new FileTree(path.basename(parentPath), filePath, content);
  }
};
