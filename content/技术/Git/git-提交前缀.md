---
aliases:
  - 前缀
---
## Git 提交前缀规范

在团队协作中，规范的 Git 提交信息是代码库可维护性的基石。**提交前缀（Commit Prefix）** 是指在提交信息标题开头使用的类型标识，用于表明本次变更的性质。它让提交历史一目了然，也便于自动化工具生成变更日志（Changelog）和语义化版本号。

目前业界最广泛采用的规范是 **Conventional Commits（约定式提交）** ，它源自 Angular 的提交规范。下面详细介绍这套规范中的常见前缀。

### 一、核心提交类型

以下是最常用、最核心的提交前缀，几乎所有采用 Conventional Commits 的项目都会包含：

|前缀|用途|SemVer 影响|
|---|---|---|
| `feat` |新增功能（feature）|MINOR（次版本）|
| `fix` |修复 Bug|PATCH（补丁版本）|

> **SemVer 说明**：`feat` 类型的提交会触发次版本号（Minor）的递增，`fix` 类型的提交会触发补丁版本号（Patch）的递增。

### 二、扩展提交类型

除 `feat` 和 `fix` 外，社区广泛采用以下扩展类型：

| 前缀         | 用途                             |
| ---------- | ------------------------------ |
| `docs`     | 仅文档变更（如 README、注释）             |
| `style`    | 代码格式调整，不影响逻辑（空格、分号、缩进等）        |
| `refactor` | 代码重构，既不修 Bug 也不加新功能            |
| `perf`     | 性能优化                           |
| `test`     | 添加或修改测试用例                      |
| `build`    | 构建系统或外部依赖变更（如 npm、gulp）        |
| `ci`       | CI 配置文件或脚本变更（如 GitHub Actions） |
| `chore`    | 日常维护任务（工具配置、杂项）                |
| `revert`   | 回退之前的某次提交                      |

### 三、提交信息格式

标准的提交信息格式如下：

```txt
<type>[optional scope]: <description>
[optional body]
[optional footer(s)]
```

**各部分说明**：
- `<type>`：上述表格中的前缀，必填
- `[scope]`：可选的作用域，用括号包裹，指明变更影响的模块，如 `feat(auth): add OAuth 2 login`
- `<description>`：简要描述，使用祈使语气（如 "add" 而非 "added"），首字母小写，不加句号
- `[body]` ：可选的正文，说明变更的动机和详情
- `[footer]`：可选的页脚，用于标注重大变更或关联 Issue
### 四、特殊标记

#### 1. 重大变更（Breaking Change）

当提交包含不兼容的 API 变更时，有两种标记方式：

**方式一：在类型后加 `!`**
```txt
feat!: drop support for Node 6
```

**方式二：在页脚添加 `BREAKING CHANGE:`**

```txt
feat: allow config object to extend other configs

[optional body]

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```
- 两种方式可以同时使用。重大变更对应语义化版本中的 **MAJOR（主版本）** 递增。

#### 2. 关联 Issue

在页脚中引用 Issue 编号，便于追踪：

```txt
fix: handle password reset errors gracefully
Closes: #1234
```

### 五、为什么需要规范前缀？

1. **可读性**：一眼就能看出提交的性质
2. **自动化**：配合工具（如 `release-please`）自动生成变更日志和版本号
3. **追溯性**：结合 Issue 编号，让 `git log` 直接关联到问题追踪系统
4. **团队协作**：统一的规范降低沟通成本

> 不同团队可能对前缀有各自的约定。例如有的团队会增加 `wip`（Work In Progress）表示进行中的工作。建议在项目根目录放置 `commit-convention.md` 文档，统一团队的提交规范。