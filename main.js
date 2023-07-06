const md5 = require("md5");
const prompts = require("prompts");
const dotenv = require("dotenv");

dotenv.config();

// 设置百度翻译API的参数
const appID = process.env.BAIDU_APP_ID;
const secretKey = process.env.BAIDU_SECRET_KEY;

async function tr() {
  let exit = false;

  // 需要翻译的文本
  while (!exit) {
    const res = await prompts({
      type: "text",
      name: "text",
      message: "请输入需要翻译的内容:",
    });

    if (res.text.trim() === "exit") {
      exit = true;
      break;
    }
    const text = res.text;

    // 生成随机数和签名
    const salt = Math.floor(Math.random() * 10000);
    const sign = md5(appID + text + salt + secretKey);

    // 构建请求参数
    const params = new URLSearchParams({
      q: text,
      from: "zh",
      to: "en",
      appid: appID,
      salt: salt,
      sign: sign,
    });

    // 发送翻译请求
    fetch(`https://api.fanyi.baidu.com/api/trans/vip/translate?${params}`)
      .then((response) => response.json())
      .then((data) => {
        data.error_code && console.log(data.error_code);
        // const translation_src = data.trans_result[0].src;
        const translation = data.trans_result[0].dst;
        console.log(`${translation}`);
      });
  }
}

tr();