const fs = require("fs");
const http = require("http");
const crypto = require("crypto");
const { resolve } = require("path");
const fetch = require("node-fetch");

const app_id = "2125785319";
const app_key = "dufLa8XD8zCHl67B";
const session = "tiankai";
const api = "https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat";

// 获取随机32位字符串
function getNonceStr() {
  let char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let len = Math.floor(Math.random() * (32 - 1) + 1);
  let result = "";
  for (let i = 0; i < len; i++) {
    let randomNum = Math.floor(Math.random() * char.length);
    result += char[randomNum];
  }
  return result;
}

// 签名
function sign(params, appKey) {
  // 生成签名 sign
  let strOrderArr = Object.keys(params).sort();
  let stringA = "";
  strOrderArr.map(val => {
    //如果参数值为空，或者验证返回的 sign 不参与签名
    if (!!!val || val === "sign" || params[val].length === 0) return;
    stringA += val + "=" + encodeURIComponent(params[val]) + "&";
  });
  let stringSignTemp = stringA + "app_key=" + appKey;
  // console.log("sign: ", stringSignTemp);
  let md5 = crypto.createHash("md5");
  let sign = md5
    .update(stringSignTemp)
    .digest("hex")
    .toUpperCase();
  return sign;
}

// fetch
function getReqBody(question) {
  const reqBody = {
    app_id: app_id,
    time_stamp: parseInt(+new Date() / 1000),
    nonce_str: getNonceStr(),
    session,
    question
  };
  return reqBody;
}
// 处理发送参数为 key=value&
const handleParams = function(params) {
  if (!!!params) {
    return;
  }
  let arr = Object.keys(params);
  let result = "";
  arr.forEach(val => {
    result += val + "=" + params[val] + "&";
  });
  // console.log("params: ", result);
  return result;
};

const fetchChat = async function(question) {
  try {
    const reqBody = getReqBody(question);
    let res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: handleParams({
        sign: sign(reqBody, app_key),
        ...reqBody
      })
    });
    let json = await res.json();
    console.log(json);
    return json;
  } catch (e) {
    console.log("-----------------");
    console.log(e);
    console.log("-----------------");
  }
};
const server = http.createServer((req, res) => {
  // console.log(req.url);
  if (req.url === "/a.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    let data = fs.readFileSync(resolve(__dirname, "./a.html"));
    res.end(data);
  } else if (req.url === "/chat" && req.method === "POST") {
    let chunk = "";
    req.on("data", data => {
      chunk += data;
    });
    req.on("end", async () => {
      // console.log(JSON.parse(chunk).data + "|");
      let chatRes = await fetchChat(JSON.parse(chunk).data);
      //console.log(chatRes);
      if (String(chatRes.ret) === "0") {
        // console.log(chatRes.data);
        res.writeHead(200, { "Content-Type": "text/json;charset=utf8" });
        res.end(JSON.stringify({ code: "0000", data: chatRes.data }));
      } else {
        res.writeHead(200, { "Content-Type": "text/json;charset=utf8" });
        res.end(
          JSON.stringify({
            code: "9999",
            data: { answer: "我看你是故意为难我✿◡‿◡" }
          })
        );
      }
    });
  }
});

server.listen(8001, "127.0.0.1", () => {
  console.log("listening at port 127.0.0.1:8001");
});
