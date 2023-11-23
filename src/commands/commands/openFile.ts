import * as vscode from 'vscode';

export function openFile(filePath: string) {
    // Implémentation de la commande pour ouvrir un fichier
    const openPath = vscode.Uri.file(filePath);
    vscode.workspace.openTextDocument(openPath).then(doc => {
        vscode.window.showTextDocument(doc);
    });
}