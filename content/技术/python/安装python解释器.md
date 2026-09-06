[下载python官方安装与管理工具](https://www.python.org/downloads/release/pymanager-263/)
- 管理器会自动把该版本加入系统路径
- 管理器会自动更新

验证是否安装成功
```bash
py --help
```

查看可安装版本
```bash
py list --online
```

安装特定 Python 版本
```bash
py install 3.14     # --arch x86（特定版本）  --target D:\MyPython（指定路径）
```

查看已安装的版本
```bash
py list
```

卸载 Python
```bash
py uninstall 3.13
```

测试运行
```bash
py -3.14
#进入 Python 交互式命令行 `>>>` 则为运行成功
#退出交互环境：输入 `exit()` 或按 `Ctrl + Z` + 回车。
```

使用指定版本 python 运行 py 脚本
```bash
py -3.14 your_script.py
#永久设置默认：你可以通过修改配置文件 `%AppData%\Python\pymanager.json`，在里面添加 `"default_tag": "3.14"` 来设定默认版本。
```

显示所有已安装 Python 版本的路径
```bash
py -0p 
# 默认路径：
# %LocalAppData%\Programs\Python\PythonXY
# C:\Users\你的用户名\AppData\Local\Programs\Python\Python314
```


