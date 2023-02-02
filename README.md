Run commands with `http_proxy` and `https_proxy` set to the value you specified automatically.

[中文文档](./README_CHINESE.md)

# Install
```
npm install -g @piki.me/set-proxy
```

# Example
```
// set proxy, set-proxy would memorize this value
sp proxy http://127.0.0.1:7890

// show proxy
sp proxy

// run command
sp curl https://www.google.com
// or
sp "curl https://www.google.com"
```

# SYNOPSIS
```
sp [command]     // run command with http_proxy and https_proxy set
sp proxy [proxy] // set proxy, set-proxy would memorize this value
sp proxy         // show proxy
```