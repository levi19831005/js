/**
 * 骁龙会 
 * cron 18 7 * * *  yml_javascript/xlh.js
 * 
 * 骁龙会 微信小程序 
 * 3-22   签到任务 、 阅读5/15分钟任务 完成，商城任务暂时没写 ，有效期测试中 
 * 3-25   完成圈x、青龙双平台，增加运行通知（理论v2p也兼容，未测试）
 * 感谢所有测试人员
 * ========= 青龙--配置文件 =========
 * 变量格式：  export xlhCookies='sessionKey的值 & userId的值@sessionKey的值&userId的值'  多个账号用 @分割 
 * qualcomm.growthideadata.com  关键词的包   基本每个包都有变量
 * 
 * ========= V2P，QX重写 =========
 * --- mimt(主机名) ---
 * mimt= qualcomm.growthideadata.com
 *  --- 重写 ---
 * https://qualcomm.growthideadata.com/qualcomm-app/api/activity url script-request-header https://raw.githubusercontent.com/yml2213/javascript/master/xlh/xlh.js
 * 
 * 0 0 7 * * ? https://raw.githubusercontent.com/yml2213/javascript/master/xlh/xlh.js, tag=骁龙会, enabled=true
 * 
 * 还是不会的请百度或者群里求助：QQ群：884234287  tg：https://t.me/yml_tg
 */
//const $ = new Env('骁龙会')
//cron: 18 13 * * *
const $ = new Env("骁龙会");
const notify = $.isNode() ? require('./sendNotify') : '';
const Notify = 1; //0为关闭通知，1为打开通知,默认为1
const debug = 0; //0为关闭调试，1为打开调试,默认为0


let xlhCookies = ($.isNode() ? process.env.xlhCookies : $.getdata('xlhCookies')) || "";
let xlhCookiesArr = [];
let msg = '';
let UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.18(0x18001239) NetType/WIFI Language/zh_CN'

// // UA判断部分
// if (!process.env.xlh_UA) {
// 	console.log(`\n【${$.name}】：未填写 xlh_UA 变量,将默认分配一个UA`);
// 	UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.18(0x18001239) NetType/WIFI Language/zh_CN'
// } else {
// 	UA = process.env.xlh_UA
// }


!(async () => {
    if (typeof $request !== "undefined") {
        await GetRewrite()
    } else {
        if (!(await Envs()))  //多账号分割 判断变量是否为空  初步处理多账号
            return;
        else {

            console.log(
                `\n\n=========================================    脚本执行 - 北京时间(UTC+8)：${new Date(
                    new Date().getTime() +
                    new Date().getTimezoneOffset() * 60 * 1000 +
                    8 * 60 * 60 * 1000
                ).toLocaleString()} =========================================\n`);


            await wyy();
            await $.wait(2 * 1000);


            $.log(`\n=================== 共找到 ${xlhCookiesArr.length} 个账号 ===================`)

            if (debug) {
                console.log(`【debug】 这是你的账号数组:\n ${xlhCookiesArr}`);
            }


            if (debug) {
                console.log(`\n【debug】 这是你的UA数据:\n ${UA}\n`);
            }

            for (let index = 0; index < xlhCookiesArr.length; index++) {


                data = xlhCookiesArr[index].split('&')

                if (debug) {
                    console.log(`\n【debug】 这是你的账号信息:\n sessionKey:${data[0]}\n userId:${data[1]}`);
                }

                let num = index + 1
                $.log(`\n========= 开始【第 ${num} 个账号】=========\n`)
                msg += `\n【第 ${num} 个账号】`

                // 获取用户信息
                await getUsreInfo(data[0], data[1]);
                // await Query_Balance(true);
                await $.wait(1 * 1000);




                $.log('开始 【签到】')
                await sign();
                await $.wait(2 * 1000);


                $.log('开始 【获取文章列表】')
                await articles()
                await $.wait(2 * 1000);


                $.log('开始 【阅读文章】')
                await enterRead()
                await $.wait(2 * 1000);


                $.log('停止 【阅读文章】')
                await exitRead()
                await $.wait(2 * 1000);


                $.log('查询 【任务完成后积分】')
                await getUsreInfo_end(data[0], data[1]);
                // await Query_Balance(true);
                await $.wait(1 * 1000);


            }
            await SendMsg(msg);

        }
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

//#region 固定代码
// ============================================变量检查============================================ \\
async function Envs() {
    if (xlhCookies) {
        if (xlhCookies.indexOf("@") != -1) {
            xlhCookies.split("@").forEach((item) => {
                xlhCookiesArr.push(item);
            });
        } else {
            xlhCookiesArr.push(xlhCookies);
        }
    } else {
        $.log(`\n【${$.name}】：未填写变量 xlhCookies`)
        return;
    }

    return true;
}
// ============================================ 重写 ============================================ \\
async function GetRewrite() {
    if ($request.url.indexOf(`check`) > -1 && $request.headers) {

        let sessionKey = $request.headers.sessionKey;
        let userId = $request.headers.userId;

        if (sessionKey == 'sessionKey=anonymous')
            return;
        if (userId == 'userId=anonymous')
            return;

        let cookie = `${sessionKey}&${userId}`

        if (debug) {
            $.msg(`\n【debug】 这是你圈x获取的数据:\n ${cookie}`)
        }


        if (xlhCookies != '') {
            if (xlhCookies.indexOf(cookie) == -1) {
                xlhCookies = xlhCookies + '@' + cookie
                let List = xlhCookies.split('@')

                $.setdata(xlhCookies, 'xlhCookies');
                $.msg(`【${$.name}】 获取第${List.length}个CK成功: ${cookie}`)
            } else {
                //$.msg($.name + ` 该账号CK已存在`)
            }
        } else {
            $.setdata(cookie, 'xlhCookies');
            $.msg(`【${$.name}】 获取第1个CK成功: ${cookie}`)
        }

    }
}
// ============================================发送消息============================================ \\
async function SendMsg(message) {
    if (!message)
        return;

    if (Notify > 0) {
        if ($.isNode()) {
            var notify = require('./sendNotify');
            await notify.sendNotify($.name, message);
        } else {
            $.msg(message);
        }
    } else {
        console.log(message);
    }
}

/**
 * 随机数生成
 */
function randomString(e) {
    e = e || 32;
    var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}

/**
 * 随机整数生成
 */
function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

//每日网抑云
function wyy(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://keai.icu/apiwyy/api`
        }
        $.get(url, async (err, resp, data) => {
            try {
                data = JSON.parse(data)
                $.log(`\n【网抑云时间】: ${data.content}  by--${data.music}`);

            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

//#endregion

/**
 * 获取用户信息
 */
function getUsreInfo(sessionKey, userId) {
    return new Promise((resolve) => {
        let url = {
            url: `https://qualcomm.growthideadata.com/qualcomm-app/api/user/info?userId=${userId}`,
            headers: {

                "userId": data[1],
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Host": "qualcomm.growthideadata.com",
                "User-Agent": UA,
                "sessionKey": sessionKey,
                "Referer": "https://servicewechat.com/wx026c06df6adc5d06/176/page-frame.html",
                "Connection": "keep-alive"
            },

        }

        if (debug) {
            console.log(`\n=============== 这是 获取用户信息 请求 url ===============`);
            console.log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (debug) {
                    console.log(`\n\n=============== 这是 获取用户信息 返回data ==============`);
                    console.log(data)
                }
                if (result.code == 200) {

                    console.log(`\n🎉🎉🎉 欢迎光临 🎉🎉🎉 \n【昵称】${result.data.nick}\n【等级】${result.data.level}级:${result.data.levelName}\n【用户Id】${result.data.id}\n【现有积分】${result.data.coreCoin}\n【累计获得积分】${result.data.cumulativeCoreCoin}\n`);

                    msg += `\n🎉🎉🎉 欢迎光临 🎉🎉🎉 \n【昵称】${result.data.nick}\n【等级】${result.data.level}级:${result.data.levelName}\n【用户Id】${result.data.id}\n【现有积分】${result.data.coreCoin}\n【累计获得积分】${result.data.cumulativeCoreCoin}\n`


                    //  $.msg(`\n🎉🎉🎉 欢迎光临 🎉🎉🎉 \n【昵称】${result.data.nick}\n【等级】${result.data.level}级${result.data.levelName}\n【用户Id】${result.data.id}\n【现有积分】${result.data.coreCoin}\n【累计获得积分】${result.data.cumulativeCoreCoin}\n`)


                } else if (result.code === 40001) { // 登陆过期

                    $.log(`\n【获取用户信息】 失败 ,可能是:${result.message}!\n `)
                    msg += `\n【获取用户信息】 失败 ,可能是:${result.message}!\n`
                    // $.msg(`【${$.name}】 【签到】: ${result.message}`)
                    SendMsg(`${xlhCookiesArr[index]}该CK已过期`)


                } else {
                    //  $.log(results.msg)
                    SendMsg(`${xlhCookiesArr[index]}该CK出现未知问题，请检查！`)
                }

            } catch (e) {
                console.log(e)
            } finally {
                resolve();
            }
        })
    })
}


/**
 * 查询 任务完成后积分
 */
function getUsreInfo_end(sessionKey, userId) {
    return new Promise((resolve) => {
        let url = {
            url: `https://qualcomm.growthideadata.com/qualcomm-app/api/user/info?userId=${userId}`,
            headers: {

                "userId": data[1],
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Host": "qualcomm.growthideadata.com",
                "User-Agent": UA,
                "sessionKey": sessionKey,
                "Referer": "https://servicewechat.com/wx026c06df6adc5d06/176/page-frame.html",
                "Connection": "keep-alive"
            },

        }

        if (debug) {
            console.log(`\n=============== 这是 获取用户信息 请求 url ===============`);
            console.log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (debug) {
                    console.log(`\n\n=============== 这是 获取用户信息 返回data ==============`);
                    console.log(data)
                }
                if (result.code == 200) {

                    console.log(`【昵称】${result.data.nick}\n【任务后积分】${result.data.coreCoin} `)

                    msg += `【昵称】${result.data.nick}\n【任务后积分】${result.data.coreCoin} `

                    //  $.msg(`【昵称】${result.data.nick}\n【任务后积分】${result.data.coreCoin} `)

                }

            } catch (e) {
                console.log(e)
            } finally {
                resolve();
            }
        })
    })
}




/**
 * 签到
 */
function sign(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://qualcomm.growthideadata.com/qualcomm-app/api/user/signIn?userId=${data[1]}`,
            headers: {

                "userId": data[1],
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Host": "qualcomm.growthideadata.com",
                "User-Agent": UA,
                "sessionKey": data[0],
                "Referer": "https://servicewechat.com/wx026c06df6adc5d06/176/page-frame.html",
                "Connection": "keep-alive"
            },

        }

        if (debug) {
            console.log(`\n【debug】=============== 这是 签到 请求 url ===============`);
            console.log(JSON.stringify(url));
        }

        $.get(url, async (error, response, data) => {
            try {
                if (debug) {
                    console.log(`\n\n【debug】===============这是 签到 返回data==============`);
                    console.log(data)
                }
                let result = JSON.parse(data);
                if (result.code == 200) {

                    console.log(`【签到】${result.message} 🎉🎉🎉 `)
                    msg += `\n【签到】${result.message} 🎉🎉🎉`
                    $.msg(`【${$.name}】 【签到】: ${result.message} 🎉🎉🎉`)

                } else if (result.code === 1) {

                    $.log(`\n【签到】 失败 ,可能是:${result.message}!\n `)
                    msg += `\n【签到】 失败 ,可能是:${result.message}!\n`
                    $.msg(`【${$.name}】 【签到】: ${result.message}`)

                } else if (result.code === 40001) {

                    $.log(`\n【签到】 失败 ,可能是:${result.message}!\n `)
                    msg += `\n【签到】 失败 ,可能是:${result.message}!\n`
                    $.msg(`【${$.name}】 【签到】: ${result.message}`)

                } else {

                    $.log(`\n【签到】 失败 ❌ 了呢,可能是网络被外星人抓走了!\n `)
                    msg += `\n【签到】 失败 ❌ 了呢,可能是网络被外星人抓走了!\n`
                    $.msg(`【${$.name}】 【签到】: 失败 ❌ 了呢,可能是网络被外星人抓走了!`)

                }

            } catch (e) {
                console.log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}



/**
 * 阅读任务部分
 * 获取文章列表,随机选择一篇文章获取 articleId 
 */
function articles(timeout = 3 * 1000) {
    return new Promise((resolve, reject) => {

        let d = new Date();
        let y = d.getFullYear();
        let m = d.getMonth();
        m = m.toString();
        if (m.length == 1) {
            m = `0${m}`
        }
        let time = `${y}-${m}`;
        // console.log(time);


        let url = {
            url: `https://qualcomm.growthideadata.com/qualcomm-app/api/home/articles?page=1&size=20&userId=${data[1]}&labelId=&searchDate=${time}&showType=0`,
            headers: {

                "userId": data[1],
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Host": "qualcomm.growthideadata.com",
                "User-Agent": UA,
                "sessionKey": data[0],
                "Referer": "https://servicewechat.com/wx026c06df6adc5d06/176/page-frame.html",
                "Connection": "keep-alive"
            },

        }
        if (debug) {
            console.log(`\n【debug】=============== 这是 获取文章列表 请求 url ===============`);
            console.log(JSON.stringify(url));
        }
        $.get(url, async (error, response, data) => {
            try {

                let result = JSON.parse(data);
                if (debug) {
                    console.log(`\n\n【debug】=============== 这是 获取文章列表 返回data ==============`);
                    console.log(data)
                }

                if (result.code == 200) {


                    console.log(`【获取文章列表】${result.message} 🎉`)
                    msg += `\n 【获取文章列表】${result.message} 🎉`
                    //  $.msg(`【${$.name}】 【获取文章列表】: ${result.message} 🎉`)

                    console.log(`\n 请耐心等待 5 s\n`)
                    await $.wait(5 * 1000);

                    // 随机1-10 数字
                    let num = randomInt(1, 10);
                    // console.log(num);

                    // 获取文章 articleId
                    articleId = result.data.articleList[num].id;
                    // console.log(articleId);
                    // 获取文章 title
                    title = result.data.articleList[num].title;
                    // console.log(title);

                }

            } catch (e) {
                console.log(error)
            } finally {
                resolve();
            }
        }, timeout)
    })
}



/** 
 * 开始阅读
*/
// https://qualcomm.growthideadata.com/qualcomm-app/api/article/enterRead?articleId=7626&userId=281687 
function enterRead(timeout = 3 * 1000) {
    return new Promise((resolve, reject) => {
        let url = {
            url: `https://qualcomm.growthideadata.com/qualcomm-app/api/article/enterRead?articleId=${articleId}&userId=${data[1]}`,
            headers: {

                "userId": data[1],
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Host": "qualcomm.growthideadata.com",
                "User-Agent": UA,
                "sessionKey": data[0],
                "Referer": "https://servicewechat.com/wx026c06df6adc5d06/176/page-frame.html",
                "Connection": "keep-alive"
            },

        }
        if (debug) {
            console.log(`\n【debug】=============== 这是 开始阅读 请求 url ===============`);
            console.log(JSON.stringify(url));
        }
        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (debug) {
                    console.log(`\n\n【debug】=============== 这是 开始阅读 返回data ==============`);
                    console.log(data)
                }
                if (result.code == 200) {

                    console.log(`【开始阅读】阅读${result.message} 🎉\n恭喜你，开始阅读文章“${title}”\n 请耐心等待16分钟,你可以去做别的事情了鸭!\n`)
                    msg += `【开始阅读】阅读${result.message} 🎉\n恭喜你，开始阅读文章“${title}”\n 请耐心等待16分钟,你可以去做别的事情了鸭!\n\n`
                    //  $.msg(`【开始阅读】阅读${result.message} 🎉\n恭喜你，开始阅读文章“${title}”\n 请耐心等待16分钟,你可以去做别的事情了鸭!\n`)



                    await $.wait(10 * 1000);
                    console.log(`\n 请耐心等待16分钟,你可以去做别的事情了鸭!\n`)
                    msg += `\n 请耐心等待16分钟,你可以去做别的事情了鸭!\n`
                    //  $.msg(`\n 请耐心等待16分钟,你可以去做别的事情了鸭!`)

                    await $.wait(10 * 1000);
                    console.log(`\n 请耐心等待16分钟,你可以去做别的事情了鸭!\n`)
                    msg += `\n 请耐心等待16分钟,你可以去做别的事情了鸭!\n`
                    //  $.msg(`\n 请耐心等待16分钟,你可以去做别的事情了鸭!`)

                    await $.wait(960 * 1000);


                }

            } catch (e) {
                console.log(error)
            } finally {
                resolve();
            }
        }, timeout)
    })
}

/** 
 * 停止阅读
*/
// https://qualcomm.growthideadata.com/qualcomm-app/api/article/exitRead?articleId=7626&userId=281687
function exitRead(timeout = 3 * 1000) {
    return new Promise((resolve, reject) => {
        let url = {
            url: `https://qualcomm.growthideadata.com/qualcomm-app/api/article/exitRead?articleId=${articleId}&userId=${data[1]}`,
            headers: {

                "userId": data[1],
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Host": "qualcomm.growthideadata.com",
                "User-Agent": UA,
                "sessionKey": data[0],
                "Referer": "https://servicewechat.com/wx026c06df6adc5d06/176/page-frame.html",
                "Connection": "keep-alive"
            },

        }
        if (debug) {
            console.log(`\n【debug】=============== 这是 停止阅读 请求 url ===============`);
            console.log(JSON.stringify(url));
        }
        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (debug) {
                    console.log(`\n\n【debug】=============== 这是 停止阅读 返回data ==============`);
                    console.log(data)
                }
                if (result.code == 200) {
                    console.log(`【停止阅读】停止阅读${result.message} 🎉】\n恭喜你,停止阅读文章“${title}”\n 快去看看你的任务完成了吗!\n`)
                    msg += `【停止阅读】停止阅读${result.message} 🎉】\n恭喜你,停止阅读文章“${title}”\n 快去看看你的任务完成了吗!\n`
                    //  $.msg(`【停止阅读】停止阅读${result.message} 🎉】\n恭喜你,停止阅读文章“${title}”\n 快去看看你的任务完成了吗!\n`)

                    await $.wait(2 * 1000);

                }

            } catch (e) {
                console.log(error)
            } finally {
                resolve();
            }
        }, timeout)
    })
}













// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }