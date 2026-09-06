## 场景一：加入内部团队（直接协作）

这是最标准的流程，假设你已拥有仓库的写入权限。
### 第一阶段：项目初始化（只做一次）

1. **拉取代码到本地**：

```bash
git clone <仓库地址> #克隆仓库
cd <项目文件夹>
```
2. **了解开发分支**：通常团队会有 `main` (生产环境) 和 `develop` (开发环境) 分支。切到开发分支：

```bash
git checkout develop #切换到develop分支
```

### 第二阶段：开发新功能（核心循环）

> **原则：绝对不要在 `main` 或 `develop` 上直接修改代码！**

1. **创建功能分支**（分支名要见名知意）：

```bash
git checkout -b feature/用户登录修复
# 或者修复紧急 bug
git checkout -b hotfix/支付金额错误
```

2. **本地编码与提交**（小而频繁地提交）：

```bash
git add .   # 添加所有修改的文件到暂存区
git commit -m "fix: 修复登录时 token 过期未刷新问题"  # 将暂存区的更改提交到本地仓库
```

> **提交规范**：推荐使用 `feat:`(新功能)、`fix:`(修复)、`docs:`(文档) 等前缀，方便追溯。

3. **与远程保持同步**：  
在推送前，务必拉取最新代码。使用 `rebase` 保持历史线性整洁：

```bash
# 拉取 develop 的最新代码，并将你的修改“嫁接”上去
git pull origin develop --rebase   # --rebase嫁接
```

> _如果有冲突，解决冲突后执行 `git add .` 然后 `git rebase --continue`。_

4. **推送到远程仓库**：

```bash
git push origin feature/用户登录修复
```
### 第三阶段：发起合并请求（Code Review）

- 去 Git 托管平台（GitHub/GitLab/Gitee）创建 **Pull Request (PR)** 或 **Merge Request (MR)**。
- 将 `feature/用户登录修复` 合并到 `develop` 分支。
- 邀请同事 **Review** 代码。如果审查不通过，在本地修改后再次执行 `git push`。

### 第四阶段：合并与清理

- 审查通过后，由项目负责人点击“合并”按钮。
- 删除远程和本地的功能分支：

```bash
git checkout develop           # 切换到主开发分支
git pull origin develop          # 拉取合并后的最新代码，确保最新
git branch -d feature/用户登录修复  # 删除本地分支
```

---

## 场景二：参与开源项目（Fork 工作流）

如果你没有仓库写入权限，流程略有不同：

1. **Fork 项目**：在网页上点击 “Fork” 按钮，将项目复制到你自己的账号下。
2. **克隆你自己的仓库**：`git clone https://github.com/你的用户名/项目名.git`
3. **关联原项目（上游）**：为了保持同步，需要添加原项目地址：
```bash
git remote add upstream https://github.com/原作者/项目名.git

# 3.5 同步上游最新代码（在开始写代码之前，务必先做这一步）
git fetch upstream                  # 下载原项目的最新代码到本地（不合并）
git checkout main                   # 切到你的本地 main 分支
git merge upstream/main             # 将上游的最新代码合并到你的本地 main
git push origin main                # 将同步后的代码推送到你的远程仓库（origin）
```

1. **修改与推送**：修改后推送到 **你自己的远程仓库** (`origin`)。
2. **发起 PR**：在你的仓库页面点击 “Pull Request”，选择从你的分支提交到原项目的 `main` 分支。
3. **等待维护者审核**：维护者可能会让你修改。此时，先执行 `git pull upstream main --rebase`（将上游最新代码同步到你本地功能分支），解决可能的冲突后，再执行 `git push`。PR 会自动更新，且不会出现“合并冲突”的红字提示。
