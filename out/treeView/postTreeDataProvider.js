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
exports.PostTreeItem = exports.V2EXPostTreeDataProvider = void 0;
const vscode = __importStar(require("vscode"));
const v2ex_1 = require("../api/v2ex");
function getThemeColors() {
    const config = vscode.workspace.getConfiguration();
    const getColor = (key, defaultValue) => {
        const color = config.get(`workbench.colorCustomizations.${key}`);
        if (color) {
            return color;
        }
        const themeColor = vscode.window.activeColorTheme;
        if (themeColor.kind === vscode.ColorThemeKind.Dark) {
            const darkDefaults = {
                'editor.background': '#1e1e1e',
                'editor.foreground': '#d4d4d4',
                'editorLineNumber.foreground': '#858585',
                'editor.selectionBackground': '#264f78',
                'editorLineNumber.activeForeground': '#c6c6c6',
                'editorCursor.foreground': '#aeafad',
                'editorWhitespace.foreground': '#3b3b3b',
                'editorIndentGuide.background': '#3b3b3b',
                'activityBar.background': '#333333',
                'activityBar.foreground': '#ffffff',
                'sideBar.background': '#252526',
                'sideBar.foreground': '#bbbbbb',
                'list.activeSelectionBackground': '#094771',
                'list.activeSelectionForeground': '#ffffff',
                'list.hoverBackground': '#2a2a2a',
                'button.background': '#007acc',
                'button.foreground': '#ffffff',
                'scrollbar.shadow': '#1e1e1e',
                'scrollbarSlider.background': '#424242',
                'scrollbarSlider.hoverBackground': '#4e4e4e',
                'scrollbarSlider.activeBackground': '#6e6e6e',
            };
            return darkDefaults[key] || defaultValue;
        }
        else if (themeColor.kind === vscode.ColorThemeKind.Light) {
            const lightDefaults = {
                'editor.background': '#ffffff',
                'editor.foreground': '#3c3c3c',
                'editorLineNumber.foreground': '#858585',
                'editor.selectionBackground': '#add6ff',
                'editorLineNumber.activeForeground': '#3c3c3c',
                'editorCursor.foreground': '#000000',
                'editorWhitespace.foreground': '#cccccc',
                'editorIndentGuide.background': '#cccccc',
                'activityBar.background': '#007acc',
                'activityBar.foreground': '#ffffff',
                'sideBar.background': '#f3f3f3',
                'sideBar.foreground': '#3c3c3c',
                'list.activeSelectionBackground': '#007acc',
                'list.activeSelectionForeground': '#ffffff',
                'list.hoverBackground': '#e6e6e6',
                'button.background': '#007acc',
                'button.foreground': '#ffffff',
                'scrollbar.shadow': '#ffffff',
                'scrollbarSlider.background': '#cccccc',
                'scrollbarSlider.hoverBackground': '#b3b3b3',
                'scrollbarSlider.activeBackground': '#999999',
            };
            return lightDefaults[key] || defaultValue;
        }
        else {
            return defaultValue;
        }
    };
    return {
        background: getColor('editor.background', '#1e1e1e'),
        foreground: getColor('editor.foreground', '#d4d4d4'),
        border: getColor('editorLineNumber.foreground', '#858585'),
        comment: getColor('editorLineNumber.foreground', '#858585'),
        keyword: getColor('list.activeSelectionBackground', '#094771'),
        string: getColor('editorLineNumber.activeForeground', '#c6c6c6'),
    };
}
class V2EXPostTreeDataProvider {
    constructor(context) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.posts = [];
        this.webviewPanel = null;
        this.context = context;
    }
    async refresh() {
        const hotPosts = await (0, v2ex_1.fetchHotPosts)();
        const latestPosts = await (0, v2ex_1.fetchLatestPosts)();
        const allPosts = [...new Map([...hotPosts, ...latestPosts].map(post => [post.id, post])).values()];
        this.posts = allPosts.sort((a, b) => b.created - a.created);
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element) {
            return Promise.resolve([]);
        }
        return Promise.resolve(this.posts.map(post => new PostTreeItem(post)));
    }
    async openPostDetail(postId) {
        const post = await (0, v2ex_1.fetchPostDetail)(postId);
        if (!post) {
            vscode.window.showErrorMessage('Failed to load post detail');
            return;
        }
        const replies = await (0, v2ex_1.fetchReplies)(postId);
        const colors = getThemeColors();
        if (this.webviewPanel) {
            this.webviewPanel.title = post.title;
            this.webviewPanel.webview.html = this.getWebviewContent(post, replies, colors);
            this.webviewPanel.reveal(vscode.ViewColumn.Beside);
        }
        else {
            this.createWebviewPanel(post, replies, colors);
        }
    }
    createWebviewPanel(post, replies, colors) {
        this.webviewPanel = vscode.window.createWebviewPanel('v2ex-post-detail', post.title, vscode.ViewColumn.Beside, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        this.webviewPanel.webview.html = this.getWebviewContent(post, replies, colors);
        this.webviewPanel.onDidDispose(() => {
            this.webviewPanel = null;
        });
        vscode.window.onDidChangeActiveColorTheme(() => {
            if (this.webviewPanel) {
                const newColors = getThemeColors();
                this.webviewPanel.webview.html = this.getWebviewContent(post, replies, newColors);
            }
        });
    }
    getWebviewContent(post, replies, colors) {
        const createdAt = new Date(post.created * 1000).toLocaleString('zh-CN');
        const lastModified = new Date(post.last_modified * 1000).toLocaleString('zh-CN');
        const repliesHtml = replies.map((reply, index) => {
            const replyCreated = new Date(reply.created * 1000).toLocaleString('zh-CN');
            return `
<div class="reply">
  <div class="reply-header">
    <span class="reply-index">/* ${index + 1} */</span>
    <span class="reply-author">
      <img src="${reply.member.avatar_large}" class="avatar" />
      <span>@${reply.member.username}</span>
    </span>
    <span class="reply-time">// ${replyCreated}</span>
  </div>
  <div class="reply-content">${reply.content_rendered}</div>
</div>
      `;
        }).join('');
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title}</title>
  <style>
    body {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      padding: 20px;
      background-color: ${colors.background};
      color: ${colors.foreground};
      min-height: 100vh;
      font-size: 14px;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 1px solid ${colors.border};
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    .title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 12px;
      color: ${colors.string};
      text-decoration: underline;
      text-decoration-style: dashed;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 12px;
      color: ${colors.comment};
    }
    .author {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .avatar {
      width: 18px;
      height: 18px;
      border-radius: 2px;
      filter: grayscale(100%);
    }
    .node {
      background-color: ${colors.keyword};
      padding: 1px 6px;
      border-radius: 2px;
      font-weight: 600;
      color: ${colors.background};
    }
    .content {
      line-height: 1.7;
      font-size: 14px;
    }
    .content h1, .content h2, .content h3 {
      font-size: 15px;
      font-weight: 700;
      margin: 16px 0 8px;
      color: ${colors.string};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .content p {
      margin: 8px 0;
      text-indent: 2em;
    }
    .content code {
      background-color: ${colors.keyword};
      padding: 1px 4px;
      border-radius: 2px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
      color: ${colors.foreground};
    }
    .content pre {
      background-color: ${colors.keyword};
      padding: 12px;
      border-radius: 2px;
      overflow-x: auto;
      margin: 12px 0;
      border-left: 3px solid ${colors.comment};
    }
    .content pre code {
      padding: 0;
      background-color: transparent;
    }
    .content blockquote {
      border-left: 2px solid ${colors.comment};
      padding-left: 12px;
      margin: 12px 0;
      color: ${colors.comment};
      font-style: italic;
    }
    .content a {
      color: ${colors.foreground};
      text-decoration: underline;
      text-decoration-color: ${colors.comment};
    }
    .content a:hover {
      text-decoration-color: ${colors.string};
    }
    .stats {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid ${colors.border};
      font-size: 12px;
      color: ${colors.comment};
    }
    .replies-section {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid ${colors.border};
    }
    .replies-title {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 16px;
      color: ${colors.string};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .reply {
      background-color: transparent;
      border-radius: 2px;
      padding: 12px;
      margin-bottom: 12px;
      border-left: 3px solid ${colors.comment};
      border-bottom: 1px solid ${colors.border};
    }
    .reply-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      font-size: 12px;
      color: ${colors.comment};
    }
    .reply-author {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .reply-index {
      background-color: ${colors.comment};
      color: ${colors.foreground};
      padding: 1px 5px;
      border-radius: 2px;
      font-size: 11px;
      font-weight: 600;
    }
    .reply-content {
      line-height: 1.6;
      font-size: 13px;
    }
    .reply-content code {
      background-color: ${colors.background};
      padding: 1px 4px;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">// ${post.title}</div>
      <div class="meta">
        <span class="author">
          <img src="${post.member.avatar_large}" class="avatar" />
          <span>@${post.member.username}</span>
        </span>
        <span class="node">${post.node.title}</span>
        <span>/* ${createdAt} */</span>
        <span>// last modified: ${lastModified}</span>
      </div>
    </div>
    <div class="content">${post.content_rendered}</div>
    <div class="stats">
      <span>// replies: ${post.replies}</span>
    </div>
    <div class="replies-section">
      <div class="replies-title">// comments (${replies.length})</div>
      ${repliesHtml}
    </div>
  </div>
</body>
</html>`;
    }
}
exports.V2EXPostTreeDataProvider = V2EXPostTreeDataProvider;
class PostTreeItem extends vscode.TreeItem {
    constructor(post) {
        super(post.title);
        this.post = post;
        this.description = `📦 ${post.node.title} | 💬 ${post.replies} | 👤 ${post.member.username}`;
        this.tooltip = `${post.title}\n${post.node.title} | ${post.replies} replies`;
        this.command = {
            command: 'v2ex-fish.openPost',
            title: 'Open Post',
            arguments: [post.id]
        };
    }
}
exports.PostTreeItem = PostTreeItem;
//# sourceMappingURL=postTreeDataProvider.js.map