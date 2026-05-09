# V2EX Fish 🐟

在 VS Code 中浏览 V2EX 帖子，假装写代码，实则摸鱼。

## 功能特性

- 🌐 浏览 V2EX 热门帖子和最新帖子
- 💬 查看帖子详情和评论
- 🎨 跟随 VS Code 主题颜色
- 🎭 代码风格界面，完美伪装

## 安装方法

### 方法一：从 VSIX 文件安装

1. 下载最新的 `.vsix` 文件
2. 打开 VS Code
3. 打开扩展面板 (`Ctrl+Shift+X` 或 `Cmd+Shift+X`)
4. 点击右上角 `...` 菜单
5. 选择 `Install from VSIX...`
6. 选择下载的 `.vsix` 文件

### 方法二：手动构建安装

```bash
# 克隆仓库
git clone https://github.com/Crecendow/v2ex_plgins.git
cd v2ex_plgins

# 安装依赖
npm install

# 编译项目
npm run compile

# 打包插件
npm install -g vsce
vsce package

# 安装插件
code --install-extension v2ex-fish-0.1.0.vsix
```

## 使用说明

1. 点击左侧活动栏的 🐟 图标
2. 等待帖子列表加载
3. 点击帖子标题查看详情
4. 点击刷新按钮更新帖子列表


## 项目结构

```
v2ex_plugin/
├── src/
│   ├── api/v2ex.ts          # V2EX API 调用
│   ├── types/index.ts       # TypeScript 类型定义
│   ├── treeView/postTreeDataProvider.ts  # 帖子树视图
│   └── extension.ts         # 扩展入口
├── resources/
│   └── icon.svg             # 插件图标
├── out/                     # 编译输出
├── package.json             # 插件配置
└── tsconfig.json            # TypeScript 配置
```

## 注意事项

- 需要网络连接才能获取帖子数据
- 建议使用深色主题以获得最佳伪装效果
- 摸鱼有风险，谨慎使用 😄

## License

MIT