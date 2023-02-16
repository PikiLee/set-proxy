自动为在命令行输入的命令设置`http_proxy`和`https_proxy`

[English README](./README.md)

# 安装
```
npm install -g @piki.me/set-proxy
```

# 例子
```
// 设置代理地址，set-proxy会记住这个地址
sp proxy http://127.0.0.1:7890

// 显示目前代理地址
sp proxy

// 运行命令
sp curl https://www.google.com
// 或者
sp "curl https://www.google.com" // 如果命令参数里有空格使用反斜杠转义
```

# 句法
```
sp [command]     // 运行命令
sp proxy [proxy] // 设置代理地址，set-proxy会记住这个地址
sp proxy         // 显示目前代理地址
```