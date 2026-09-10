---
description: pip 是 Python 包管理工具，该工具提供了对 Python 包的查找、下载、安装、卸载的功能。
---

## 介绍

pip 是 Python 包管理工具，该工具提供了对 Python 包的查找、下载、安装、卸载的功能。

如果你在 [python.org](https://www.python.org/) 下载最新版本的安装包，或是 Python 3.4+ 以上版本，则自带了该工具而不必安装。

## 安装

```bash
$ curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py   # 下载安装脚本
$ python3 get-pip.py --user    # 运行安装脚本
```

判断是否已安装：
```bash
pip --version     
#若显示如下则为安装成功：
#pip 26.0.1 from D:\app\tools\Miniconda\Lib\site-packages\pip (python 3.13)
```
- pip 会绑定对应的 python 版本


更新 pip 版本：

```bash
# Linux 或 macOS

# 法一：直接用 pip3 命令
pip3 install --upgrade pip
# 法二：用 Python 模块方式调用
python3 -m pip install --upgrade pip

# Windows：

py -m pip install --upgrade pip 
```

## 常用命令

**显示版本和路径**

`pip --version`

**获取帮助**

`pip --help`

**升级 pip**

`pip install -U pip`


**安装包**

```bash
pip install SomePackage              # 最新版本
pip install SomePackage==1.0.4       # 指定版本
pip install 'SomePackage>=1.0.4'     # 限制最小版本，安装符合条件的最新版
```


**升级包**

`pip install --upgrade SomePackage`
- 升级指定的包，通过使用 `==`, `>=,` `<=`, `>`, `<` 来指定一个版本号。

**卸载包**

`pip uninstall SomePackage`



**显示安装包信息**

`pip show`

**查看指定包的详细信息**

`pip show -f SomePackage`

**列出已安装的包**

`pip list`

**查看可升级的包**

`pip list -o`

**检查冲突**

`pip check`
- 检查当前环境中已安装的包是否存在版本冲突或互不兼容的依赖关系。若环境健康，则无任何输出。

**离线安装**
`pip download SomePackage -d ./offline_dir`
- 将指定包及其依赖下载到本地文件夹（通常为 `.whl` 格式），便于在无互联网的服务器上离线安装。

**清理本地缓存**
`pip cache purge`
- 随着安装次数增多，pip 会缓存大量 `.whl` 文件占用磁盘空间，此命令可一键清除缓存。

## 依赖管理

在实际项目开发中，通常需要将当前环境的依赖导出来项目迁移，便于团队协作或部署上线。

**导出所有依赖**：
`pip freeze > requirements.txt`
- 该命令将当前环境所有已安装的包及版本号写入 `requirements.txt` 文件。

**安装依赖**：
`pip install -r requirements.txt`
- 在新环境或部署服务器上执行此命令，即可一次性还原项目所需的所有包。

## 其他

### python 2 与 3 间 pip 可能有使用冲突

如果同时有 Python 2 和 Python3 的 pip，则使用方法有所不同。

### pip 清华大学开源软件镜像站

使用国内镜像可以加快下载速度。

临时使用：
`pip install -i https://pypi.tuna.tsinghua.edu.cn/simple some-package`

如果要设为默认需要升级 pip >= 10.0.0 后进行配置：
```bash
pip install pip -U
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

如果您到 pip 默认源的网络连接较差，临时使用本镜像站来升级 pip：
`pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pip -U`

### Conda 不可混用

如果你的 `pip --version` 显示路径包含 `Miniconda` 或 `Anaconda`，说明你处在 Conda 环境中。

- **优先推荐**：使用 `conda install` 安装包，兼容性更好。
- **混用警告**：用 `pip` 安装的包，`conda uninstall` 无法识别；反之用 `conda` 安装的包，`pip uninstall` 可能无法彻底删除。请尽量在同一个虚拟环境中固定使用一种包管理工具。

## 参考

pip 官网：[https://pypi.org/project/pip/](https://pypi.org/project/pip/)
菜鸟教程：[Python pip 安装与使用 | 菜鸟教程](https://www.runoob.com/w3cnote/python-pip-install-usage.html)（这教程有点落后了）