# 迷宫花园 🏯🌱

一个极简主义的个人知识博客（数字花园）：没有导航栏、没有分类、没有标签云——只有一篇入口文章，和由**双向链接**连成的迷宫。

- 站点：https://knink-owo.github.io/Maze-garden
- 写作：Obsidian + Markdown（`content/` 目录就是 Obsidian vault）
- 引擎：Quartz 5（TypeScript / Node，静态生成，GitHub Pages 自动部署）

## 快速开始

```bash
npm i                 # 安装依赖
npx quartz build --serve   # 本地预览 http://localhost:8080
npx quartz sync       # 提交并推送（触发 GitHub Actions 自动部署）
```

## 目录结构

```
content/              # Obsidian vault（你的全部文章，中文文件名）
  index.md            # 入口文章（主页）
  assets/             # 图片附件（![[图片.png]] 自动渲染）
quartz/components/maze/  # 迷宫专属自定义组件（图标簇/反链/探索进度/统计/最近更新/目录抽屉）
quartz/styles/custom.scss # 主题样式（暖纸色 + 深墨色）
quartz/static/music/     # 背景音乐（放入后右上角自动出现音乐图标）
quartz.config.yaml       # 站点配置
docs/                    # 设计文档 / 功能文档 / 写作与发布指南
```

## 写作约定（摘要）

每篇笔记开头：

```yaml
---
title: 文章标题
description: 一句话摘要（用于反向链接和悬停预览）
---
```

想给某篇文章漂亮的分享链接（默认中文文件名 URL 会编码）：

```yaml
permalink: pretty-url
```

详见 [项目文档/写作与发布指南.md](项目文档/写作与发布指南.md)。
