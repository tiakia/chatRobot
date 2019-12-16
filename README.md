## 基于腾讯AI的聊天机器人

  本意是一个做postMessage跨域的Demo，后来就弄了一个基于腾讯AI做的闲聊机器人，本来是打算用图灵机器人做的可是还得上传身份证实名认证，有点麻烦就找到腾讯AI做了这个闲聊机器人。

## Start
```
git clone https://github.com/tiakia/chatRobot.git

npm install

pm2 start ecosystem.config.js
```

然后访问 `localhost:8000`就可以看到聊天机器人画面了。

![example.png](https://github.com/tiakia/chatRobot/master/images/example.png)
