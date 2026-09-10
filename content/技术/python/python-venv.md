---
description: "`venv` 是 Python 标准库自带的虚拟环境工具，用于为每个项目创建独立的 Python 运行环境。"
---

## 介绍

`venv` 是 Python 标准库自带的虚拟环境工具，用于为每个项目创建独立的 Python 运行环境。

不同项目可能依赖同一个包的不同版本，如果全部安装到全局 Python，容易产生冲突。使用 `venv` 后，每个项目可以拥有自己的包和版本，互不影响。

`venv` 会绑定创建时使用的 Python 版本。例如用 `python3.11` 创建，则环境中就是 Python 3.11。

## 安装

`venv` 是 Python 标准库的一部分，**Python 3.3+ 自带，无需通过 pip 安装**。

判断是否可用：

```bash
python3 -m venv --help
# 若显示 usage: venv ... 则说明可用
```

某些 Linux 发行版（如 Ubuntu / Debian）可能将 `venv` 拆分为独立包，若提示 `ensurepip is not available`，可安装：

```bash
sudo apt install python3-venv
```

Windows 和 macOS 的官方 Python 安装包一般已自带 `venv`。Python 3.4+ 创建的虚拟环境默认自带 `pip`。

## 常用命令

**显示版本和路径**

```bash
python3 --version

# Linux / macOS
which python3
# Windows
where python
```
**获取帮助**

```bash
python3 -m venv --help
```

**创建虚拟环境**

```bash
# Linux / macOS：在当前目录创建名为 .venv 的虚拟环境
python3 -m venv .venv

# Windows
py -3 -m venv .venv
# 指定 Python 版本创建
python3.11 -m venv .venv
py -3.11 -m venv .venv
```

**激活虚拟环境**

bash

# Linux / macOS
source .venv/bin/activate
# Windows CMD
.venv\Scripts\activate.bat
# Windows PowerShell
.venv\Scripts\Activate.ps 1
# Windows Git Bash
source .venv/Scripts/activate

激活成功后，命令行前会出现 `(.venv)` 之类的提示。

**退出虚拟环境**

bash

deactivate

**删除虚拟环境**

bash

# 先退出，再删除整个文件夹
deactivate
# Linux / macOS
rm -rf .venv
# Windows CMD
rmdir /s /q .venv
# Windows PowerShell
Remove-Item -Recurse -Force .venv

**在虚拟环境中安装包**

bash

# 激活后，pip 会绑定到当前虚拟环境
pip install SomePackage
# 更稳妥的写法：用 python -m pip 调用当前环境的 pip
python -m pip install SomePackage

**升级 pip**

bash

python -m pip install --upgrade pip

**导出依赖**

bash

pip freeze > requirements.txt

**根据依赖文件安装**

bash

pip install -r requirements.txt

**查看当前使用的是哪个 Python**

bash

# Linux / macOS
which python
# Windows
where python
# 通用：查看当前环境路径
python -c "import sys; print(sys.prefix)"

## 其他

### 为什么要用 venv

- 每个项目独立管理依赖，避免版本冲突。
    
- 不污染系统全局 Python 环境。
    
- 方便导出 `requirements.txt`，便于团队协作和部署。
    
- 可以针对不同项目使用不同 Python 版本。
    

### venv 与 virtualenv 的区别

- `venv`：Python 标准库自带，Python 3.3+ 可用，日常开发足够。
    
- `virtualenv`：第三方工具，支持更老的 Python 版本，速度更快，功能更多。
    
- 现在一般优先使用 `venv`，除非有特殊兼容需求。
    

### Windows PowerShell 激活报错

如果 PowerShell 提示“因为在此系统上禁止运行脚本”，可执行：

powershell

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

然后重新激活。也可以改用 CMD 激活：

cmd

.venv\Scripts\activate.bat

### 不要提交 venv 到 Git

虚拟环境文件夹通常很大，而且和本机路径、Python 版本有关，不应该提交到 Git。

建议在 `.gitignore` 中加入：

gitignore

.venv/
venv/

### 与 Conda 混用提醒

如果你使用 Anaconda / Miniconda，通常优先使用 `conda` 管理环境。  
在 Conda 环境中再创建 `venv` 不是不可以，但容易让包管理变混乱。建议一个项目固定使用一种环境管理工具。

### 镜像源

在虚拟环境中使用 `pip` 时，镜像源配置方法与普通 pip 相同。

临时使用清华镜像：

bash

pip install -i https://pypi.tuna.tsinghua.edu.cn/simple some-package

如果希望全局默认使用，可参考 pip 教程中的 `pip config set global.index-url` 配置。

### 在 IDE 中选择解释器

创建虚拟环境后，在 VSCode、PyCharm 等 IDE 中手动选择解释器：

text

Linux / macOS：项目路径/.venv/bin/python
Windows：项目路径\.venv\Scripts\python.exe

选择后，IDE 的终端和运行配置都会使用这个虚拟环境。

## 参考

Python venv 官方文档：[https://docs.python.org/zh-cn/3/library/venv.html](https://docs.python.org/zh-cn/3/library/venv.html)  
PEP 405：[https://peps.python.org/pep-0405/](https://peps.python.org/pep-0405/)  
virtualenv 官网：[https://virtualenv.pypa.io/](https://virtualenv.pypa.io/)  
pip 教程：前面整理的 pip 安装与使用教程