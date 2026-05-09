"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const postTreeDataProvider_1 = require("./treeView/postTreeDataProvider");
let treeDataProvider;
function activate(context) {
    treeDataProvider = new postTreeDataProvider_1.V2EXPostTreeDataProvider(context);
    vscode.window.registerTreeDataProvider('v2exPosts', treeDataProvider);
    let showPostsDisposable = vscode.commands.registerCommand('v2ex-fish.showPosts', async () => {
        await treeDataProvider.refresh();
        vscode.commands.executeCommand('workbench.action.view.focusView', 'v2exPosts');
    });
    let refreshPostsDisposable = vscode.commands.registerCommand('v2ex-fish.refreshPosts', async () => {
        await treeDataProvider.refresh();
    });
    let openPostDisposable = vscode.commands.registerCommand('v2ex-fish.openPost', async (postId) => {
        await treeDataProvider.openPostDetail(postId);
    });
    context.subscriptions.push(showPostsDisposable, refreshPostsDisposable, openPostDisposable);
    treeDataProvider.refresh();
}
function deactivate() { }
//# sourceMappingURL=extension.js.map