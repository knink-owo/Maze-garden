---
permalink: python-uv-study
---

## 介绍
uv 是一个用 Rust 编写的极速 Python 包和环境管理工具
替代 `pip` + `venv` + `pyenv` + `poetry` 等多工具的复杂组合
## 安装
```bash
# macOS || Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# windows
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 查看版本，可验证是否安装成功
uv --version
```
## 项目初始化

```bash
#处于项目文件夹中
uv init           #初始化会自动搭建标准的项目骨架：pyproject.toml，README.md，main.py等
#--python 3.12   （指定python版本，若无会自动下载）
```

### 统一配置文件：pyproject.toml
1. **声明项目元数据**：项目的名称、版本、作者、描述、许可证等。
2. **声明项目依赖**：列出项目运行和开发所需的第三方包（替代 `requirements.txt`）。
3. **配置开发工具**：在这里可以统一配置 `black`（格式化）、`ruff`（检查）、`mypy`（类型检查）乃至 `uv` 自身的行为。

## 管理依赖与环境

**添加依赖**：`uv add <指定包1> <指定包2>`（`--dev <开发环境>` 添加开发依赖）
1. 将依赖信息写入 `pyproject.toml`。
2. 解析并锁定所有依赖的精确版本，生成 `uv.lock` 文件。
3. 在项目专属的虚拟环境 `.venv` 中安装这个包。

**移除依赖**： `uv remove <指定包>`

**同步项目环境**：`uv sync`
1. 读取 `uv.lock` 文件，在新环境中创建相同的依赖包版本

**更新锁文件**：`uv lock`
1. 创建或更新 `uv.lock` 文件

### 依赖锁定文件：uv.lock
- 项目**所有直接依赖**（你主动添加的包，如 `requests`）的**精确版本号**（如 `2.31.0`）。
- 这些依赖的**所有间接依赖**（即它们自身依赖的包）及其精确版本。
- 每个包的**哈希值**（校验和），用于确保下载的文件未被篡改。

## 执行与调试

**便捷执行**：`uv run main.py`
- 自动在对应项目的虚拟环境中执行脚本。

**临时工具**：`uvx <工具>` = `uv tool run <工具>`
- 创建一个临时环境来运行它，用完即走，保持项目环境的整洁。

## 构建与发布

**构建分发包**：`uv build` （`--sdist` 只构建源码包；`--wheel` 只构建 wheel 包）
- 管家会自动将你的项目打包成 `wheel` 或源码包`.tar.gz`，这是分发Python包的标准格式。
**发布到PyPI**：`uv publish`
- 将你的包一键上传到 PyPI（Python包索引），让全世界的人都能通过 `pip install` 来安装使用你的项目。
（这一块没怎么了解过不太懂）

## 总结

| 项目阶段     | 核心任务            | `uv` 命令                                                                                                                                                                                                           |
| -------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **项目诞生** | 创建项目、指定Python版本 | `uv init`[](https://docs.astral.org.cn/uv/getting-started/features/)                                                                                                                                              |
| **项目成长** | 添加/移除依赖、同步环境    | `uv add`[](https://docs.astral.org.cn/uv/getting-started/features/), `uv remove`[](https://docs.astral.org.cn/uv/getting-started/features/), `uv sync`[](https://docs.astral.org.cn/uv/getting-started/features/) |
| **项目运行** | 执行脚本、运行临时工具     | `uv run`[](https://docs.astral.org.cn/uv/getting-started/features/), `uvx`[](https://docs.astral.org.cn/uv/getting-started/features/)                                                                             |
| **项目交付** | 构建包、发布到PyPI     | `uv build`[](https://docs.astral.org.cn/uv/getting-started/features/), `uv publish`                                                                                                                               |
|          |                 |                                                                                                                                                                                                                   |
