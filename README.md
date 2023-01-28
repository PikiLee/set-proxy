Run commands with `http_proxy` and `https_proxy` set to the value you specified automatically.

# Install
```
npm install -g @piki.me/set-proxy
```

# Usage
```
// set proxy, set-proxy would memorize this value
sp proxy http://127.0.0.1:7890

// run command
sp "curl https://www.google.com"
```

# SYNOPSIS
```
sp [command]     // run command with http_proxy and https_proxy set
sp proxy [proxy] // set proxy, set-proxy would memorize this value
sp proxy         // show proxy
```