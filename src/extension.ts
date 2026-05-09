import * as vscode from 'vscode';
import { V2EXPostTreeDataProvider } from './treeView/postTreeDataProvider';
import { fetchHotPosts } from './api/v2ex';

let treeDataProvider: V2EXPostTreeDataProvider;

export function activate(context: vscode.ExtensionContext) {
  treeDataProvider = new V2EXPostTreeDataProvider(context);
  
  vscode.window.registerTreeDataProvider('v2exPosts', treeDataProvider);
  
  let showPostsDisposable = vscode.commands.registerCommand('v2ex-fish.showPosts', async () => {
    await treeDataProvider.refresh();
    vscode.commands.executeCommand('workbench.action.view.focusView', 'v2exPosts');
  });
  
  let refreshPostsDisposable = vscode.commands.registerCommand('v2ex-fish.refreshPosts', async () => {
    await treeDataProvider.refresh();
  });

  let openPostDisposable = vscode.commands.registerCommand('v2ex-fish.openPost', async (postId: number) => {
    await treeDataProvider.openPostDetail(postId);
  });

  context.subscriptions.push(
    showPostsDisposable,
    refreshPostsDisposable,
    openPostDisposable
  );

  treeDataProvider.refresh();
}

export function deactivate() {}