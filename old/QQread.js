/**
 * 请勿烂分享脚本
 * 
 * 请填写我的邀请码 937240599 (你的支持就是我最大的动力)
 
 * QQ阅读app  
 
 * 抓包任意url https://eventv3.reader.qq.com 里的cookie
 
 * cron 0 0 0/1 * * ? 定时自己改 每天8-18点至少20次 务必在早上9-10之间执行一次
 
 * 7/3     初步完成签到 开宝箱 看广告等任务
 
 * ========= 青龙--配置文件 =========
 * 变量格式: export qqreadCookie="cookie@cookie"多个账号换行 或用 @ 分割
 *
 */

const $ = new Env("QQ阅读");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 0 		//0为关闭通知,1为打开通知,默认为1
const debug = 0 		//0为关闭调试,1为打开调试,默认为0
///////////////////////////////////////////////////////////////////
let ckStr = process.env.qqreadCookie;
let msg = "";
let ck = "";
let ck_status = 0;
let host = "eventv3.reader.qq.com";
let hostname = "https://" + host;

async function tips(ckArr) {

    console.log(`\n=============== 共找到 ${ckArr.length} 个账号 ===============`);
    msg += `\n =============== 共找到 ${ckArr.length} 个账号 ===============`
    debugLog(`【debug】 这是你的账号数组: \n ${ckArr} `);
}

!(async () => {
    let ckArr = await getCks(ckStr, "qqreadCookie");
    await tips(ckArr);
    for (let index = 0; index < ckArr.length; index++) {
        qckf_num = index + 1;
        console.log(`\n------------- 开始【第 ${qckf_num} 个账号】------------- `);
        msg += `\n------------- 开始【第 ${qckf_num} 个账号】------------- `
        ck = ckArr[index].split("&");
        debugLog(`【debug】 这是你第 ${qckf_num} 账号信息: ${ck} `);
        await start();
    }
    await SendMsg(msg);
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done());

async function start() {

        console.log("\n ==============7日打卡==============");
        n = local_hours();
        if (n >= 8 && n <= 10) {
        await pickReadAwardV2();
        await $.wait(10 * 1000);
        await sign(); 
        await $.wait(10 * 1000);
        await pickLottery();
        await $.wait(10 * 1000);
        await punchCardWatchVideo();
        await $.wait(10 * 1000);
        console.log("\n ==============加入书架==============");
        await addBookShelfWatchVideo();
        await $.wait(10 * 1000);
        console.log("\n ==============阅读指定书籍==============");
        await pickReadConfigBook();
        await $.wait(60 * 1000);
        } else {
        console.log("\n 时间不对 跳过！")
        msg += `\n 时间不对 跳过！`;
        }
        
        console.log("\n ==============开宝箱==============");
        await openBox();
        await $.wait(10 * 1000);
        await pickOpenBoxWatchVideo();
        
        console.log("\n ==============阅读奖励==============");
        if (local_hours() == 9) {
        ts = 5
        await readBookWatchVideo();
        } if (local_hours() == 11) {
        ts = 30
        await readBookWatchVideo();
        } if (local_hours() == 14) {
        ts = 60
        await readBookWatchVideo();
        } if (local_hours() == 18) {
        ts = 120
        await readBookWatchVideo();
        } else {
        console.log("\n时间不对 跳过！")
        msg += `\n 时间不对 跳过！`;
        }
        
        console.log("\n ===========刷视频随机奖励===========");
        await watchVideo();
        
        console.log("\n ===========资产统计===========");
        await myPageInit();
    }

async function myPageInit() {
    let options = {
        method: 'GET',
        url: `${hostname}/activity/pkg11955/myPageInit`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
      //  body: JSON.stringify({})
    };
    let result = await httpRequest(options, `资产统计`);

    if (result.code == 0) {
        console.log(`\n累计收益：${result.data.cashGet}\n现存余额：${result.data.cashBalance}\n今日金币：${result.data.coinBalance}`);
        msg += `\n 累计收益：${result.data.cashGet}\n 现存余额：${result.data.cashBalance}\n 今日金币：${result.data.coinBalance}`;
    }
}
/**
 * 新手红包    GET
 */
async function pickReadAwardV2() {
    let options = {
        method: 'GET',
        url: `${hostname}/activity/pkg11955/pickReadAwardV2`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
      //  body: JSON.stringify({})
    };
    let result = await httpRequest(options, `新手红包`);

    if (result.code == -1) {
        console.log(`\n新手红包：${result.msg}`);
        msg += `\n 新手红包：${result.msg}`;
    } else if (result.code == 0) {
        console.log(`\n新手红包：领取${result.data.count}红包`);
        msg += `\n 新手红包：领取${result.data.count}红包`;
    }
}


/**
 * 7日打卡    GET
 */
async function sign() {
    let options = {
        method: 'GET',
        url: `${hostname}/activity/pkg11955/punchCard_v2`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
      //  body: JSON.stringify({})
    };
    let result = await httpRequest(options, `7日打卡`);

    if (result.code == -19) {
        console.log(`\n连续打卡：${result.msg}`);
        msg += `\n 连续打卡：${result.msg}`;
    } else if (result.code == 0) {
        console.log(`\n连续打卡：获得${result.data.coinNum}金币`);
        msg += `\n 连续打卡：获得${result.data.coinNum}金币`;
    }
}

async function punchCardWatchVideo() {
    let options = {
        method: 'GET',
        url: `${hostname}/activity/pkg11955/punchCardWatchVideo`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
      //  body: JSON.stringify({})
    };
    let result = await httpRequest(options, `打卡广告`);

    if (result.code == -19) {
        console.log(`打卡广告：${result.msg}`);
        msg += `\n 打卡广告：${result.msg}`;
    } else if (result.code == 0) {
        console.log(`打卡广告：获得${result.data.count}金币`);
        msg += `\n 打卡广告：获得${result.data.count}金币`;
        await $.wait(35 * 1000);
    }
}
async function pickLottery() {
    let options = {
        method: 'GET',
        url: `${hostname}/activity/pkg11955/pickLottery`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
      //  body: JSON.stringify({})
    };
    let result = await httpRequest(options, `大转盘`);

    if (result.code == -106) {
        console.log(`大转盘：${result.msg}`);
        msg += `\n 大转盘：${result.msg}`;
    } else if (result.code == 0) {
        console.log(`大转盘：获得${result.data.count}金币`);
        msg += `\n 大转盘：获得${result.data.count}金币`;
        await pickLottery();
        console.log(`循环执行4次 等待5秒`);
        await $.wait(5 * 1000);
    }
}
/**
 * 开宝箱    GET
 */
async function openBox() {
    let options = {
        method: 'GET',
        url: `${hostname}/activity/pkg11955/openBox`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
      //  body: JSON.stringify({})
    };
    let result = await httpRequest(options, `开宝箱`);
    if (result.data.status == 1) {
        console.log(`\n开宝箱：今日已开完`);
        msg += `\n 开宝箱：今日已开完`;
    } else if (result.data.status == 3) {
        console.log(`\n开宝箱：${result.msg}`);
        msg += `\n 开宝箱：${result.msg}`;
    } else if (result.data.status == 0) {
        console.log(`\n开宝箱：获得${result.data.coin}金币`);
        msg += `\n 开宝箱：获得${result.data.coin}金币`;
    }
}

async function pickOpenBoxWatchVideo() {
    let options = {
        method: 'GET',
        url: `${hostname}/activity/pkg11955/pickOpenBoxWatchVideo`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
      //  body: JSON.stringify({})
    };
    let result = await httpRequest(options, `开宝箱广告`);

    if (result.code == -106) {
        console.log(`开宝箱广告：${result.msg}`);
        msg += `\n 开宝箱广告：${result.msg}`;
    } else if (result.code == 0) {
        console.log(`开宝箱广告：获得${result.data.count}金币`);
        msg += `\n 开宝箱广告：获得${result.data.count}金币`;
    }
}

/**
 * 阅读奖励    GET
 */
async function readBookWatchVideo() {
    let options = {
        method: 'GET',
        url: `${hostname}/activity/pkg11955/readBookWatchVideo?targetTime=${ts}`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
      //  body: JSON.stringify({})
    };
    let result = await httpRequest(options, `每日阅读`);

    if (result.code == -19) {
        console.log(`\n每日阅读：${result.msg}`);
        msg += `\n 每日阅读：${result.msg}`;
    } else if (result.code == 0) {
        console.log(`\n每日阅读：获得${result.data.count}金币`);
        msg += `\n 每日阅读：获得${result.data.count}金币`;
    }
}

/**
 * 刷视频    GET
 */
async function watchVideo() {
    let options = {
        method: 'GET',
        url: `${hostname}/activity/pkg11955/watchVideo`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
      //  body: JSON.stringify({})
    };
    let result = await httpRequest(options, `刷视频`);

    if (result.code == -19) {
        console.log(`\n 刷视频：${result.msg}`);
        msg += `\n 刷视频：${result.msg}`;
    } else if (result.code == 0) {
        console.log(`\n 刷视频：获得${result.data.watchVideoCoin}金币`);
        msg += `\n 刷视频：获得${result.data.watchVideoCoin}金币`;
    }
}
async function addBookShelfWatchVideo() {
    let options = {
        method: 'GET',
        url: `${hostname}/activity/pkg11955/addBookShelfWatchVideo`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
      //  body: JSON.stringify({})
    };
    let result = await httpRequest(options, `加入书架`);

    if (result.code == -19) {
        console.log(`\n加入书架：${result.msg}`);
        msg += `\n 加入书架：${result.msg}`;
    } else if (result.code == 0) {
        console.log(`\n加入书架：获得${result.data.count}金币`);
        msg += `\n 加入书架：获得${result.data.count}金币`;
    }
}

async function pickReadConfigBook() {
    let options = {
        method: 'GET',
        url: `${hostname}/activity/pkg11955/pickReadConfigBook`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
      //  body: JSON.stringify({})
    };
    let result = await httpRequest(options, `阅读指定书籍`);

    if (result.code == -106) {
        console.log(`\n阅读指定书：${result.msg}`);
        msg += `\n 阅读指定书：${result.msg}`;
    } else if (result.code == 0) {
        console.log(`\n阅读指定书：获得${result.data.count}金币`);
        msg += `\n 阅读指定书：获得${result.data.count}金币`;
    }
}

// #region *************************************************************  固定代码  *************************************************************
/**
 * 变量检查
 */
async function getCks(ck, str) {
    return new Promise((resolve) => {
        let ckArr = []
        if (ck) {
            if (ck.indexOf("@") !== -1) {

                ck.split("@").forEach((item) => {
                    ckArr.push(item);
                });
            } else if (ck.indexOf("\n") !== -1) {

                ck.split("\n").forEach((item) => {
                    ckArr.push(item);
                });
            } else {
                ckArr.push(ck);
            }
            resolve(ckArr)
        } else {
            console.log(` :未填写变量 ${str}`)
        }
    }
    )
}



/**
 * 发送消息
 */
async function SendMsg(message) {
    if (!message) return;

    if (Notify > 0) {
        if ($.isNode()) {
            var notify = require("./sendNotify");
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

    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
}

/**
 * 随机整数生成
 */

function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


/**
 * 时间戳 13位
 */
function ts13() {
    return Math.round(new Date().getTime()).toString();
}

/**
 * 时间戳 10位
 */
function ts10() {
    return Math.round(new Date().getTime() / 1000).toString();
}

/**
 * 获取当前小时数
 */
function local_hours() {
    let myDate = new Date();
    h = myDate.getHours();
    return h;
}

/**
 * 获取当前分钟数
 */
function local_minutes() {
    let myDate = new Date();
    m = myDate.getMinutes();
    return m;
}


/**
 * 等待 X 秒
 */
function wait(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}



/**
 * get请求
 */
async function httpGet(getUrlObject, tip, timeout = 3) {
    return new Promise((resolve) => {
        let url = getUrlObject;
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 url ===============`);
            console.log(url);
        }

        $.get(
            url,
            async (err, resp, data) => {
                try {
                    if (debug) {
                        console.log(`\n\n 【debug】===============这是 ${tip} 返回data==============`);
                        console.log(data);
                        console.log(`======`);
                        console.log(JSON.parse(data));
                    }
                    let result = JSON.parse(data);
                    if (result == undefined) {
                        return;
                    } else {
                        resolve(result);
                    }

                } catch (e) {
                    console.log(err, resp);
                    console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                    msg += `\n ${tip} 失败了!请稍后尝试!!`
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * post请求
 */
async function httpPost(postUrlObject, tip, timeout = 3) {
    return new Promise((resolve) => {
        let url = postUrlObject;
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 url ===============`);
            console.log(url);
        }

        $.post(
            url,
            async (err, resp, data) => {
                try {
                    if (debug) {
                        console.log(`\n\n 【debug】===============这是 ${tip} 返回data==============`);
                        console.log(data);
                        console.log(`======`);
                        console.log(JSON.parse(data));
                    }
                    let result = JSON.parse(data);
                    if (result == undefined) {
                        return;
                    } else {
                        resolve(result);
                    }

                } catch (e) {
                    console.log(err, resp);
                    console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                    msg += `\n ${tip} 失败了!请稍后尝试!!`
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * 网络请求 (get, post等)
 */
async function httpRequest(postOptionsObject, tip, timeout = 3) {
    return new Promise((resolve) => {

        let options = postOptionsObject;
        let request = require('request');
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 信息 ===============`);
            console.log(options);
        }

        request(options, async (err, resp, data) => {
            try {
                if (debug) {
                    console.log(`\n\n 【debug】===============这是 ${tip} 返回数据==============`);
                    console.log(data);
                    console.log(`\n 【debug】=============这是 ${tip} json解析后数据============`);
                    console.log(JSON.parse(data));
                }
                let result = JSON.parse(data);
                if (!result) return;
                resolve(result);
            } catch (e) {
                console.log(err, resp);
                console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                msg += `\n ${tip} 失败了!请稍后尝试!!`
            } finally {
                resolve();
            }
        }), timeout

    });
}


/**
 * debug调试
 */
function debugLog(...args) {
    if (debug) {
        console.log(...args);
    }
}

// /**
//  *  单名字 Env
//  */
// function Env() {
//     return new class {
//         isNode() {
//             return "undefined" != typeof module && !!module.exports
//         }
//     }()
// }



// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

     //#endregion
