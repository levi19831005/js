/**
 * 请勿烂分享脚本
 *
 * 电视家大本营 vx小程序 
 *
 * cron 30 18 * * *  请自定义时间 每日一次
 * 6-9      初步完成签到任务
 * 6-15     更新连续签到奖励
 * 7-1      增加两小任务，添加条件足够自动兑换5元话费
 * ========= 青龙--配置文件 =========
 * 变量格式: export dsj_userid="userid@userid"多个账号换行 或用 @ 分割
 *
 */

const $ = new Env("电视家签到");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1 		//0为关闭通知,1为打开通知,默认为1
const debug = 0 		//0为关闭调试,1为打开调试,默认为0
///////////////////////////////////////////////////////////////////
let ckStr = process.env.dsj_userid;
let msg = "";
let ck = "";
let host = "api.mydianshijia.com";
let hostname = "https://" + host;

async function tips(ckArr) {

    console.log(`\n=============== 共找到 ${ckArr.length} 个账号 ===============`);
    msg += `\n =============== 共找到 ${ckArr.length} 个账号 ===============`
    debugLog(`【debug】 这是你的账号数组: \n ${ckArr} `);
}

!(async () => {
    let ckArr = await getCks(ckStr, "dsj_userid");
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

        console.log("\n ----------每日签到----------");
        await sign();
        
        console.log("\n ----------签到奖励----------");
        await user2();
        await $.wait(6000)
        await user1();
        await $.wait(6000)
        await report();
        await $.wait(6000)
        await taskreceive();
        await $.wait(6000)
        await taskreceive1();
        
        console.log("\n ----------用户信息----------");
        await user4();
        await $.wait(6000)
        await user3();
        
    }



/**
 * 签到    POST
 */
async function sign() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/pd/sign`,
        headers: {
            'Host': host,
            'userid': `${ck[0]}`,
        },
        body: JSON.stringify({})
    };
    let result = await httpRequest(options, `签到`);

    if (result.errCode == 4) {
        console.log(`\n签到： ${result.msg}`);
        msg += `\n 签到： ${result.msg}`;
    } else if (result.errCode == 0) {
        console.log(`\n签到： 获得${result.data.score}积分`);
        msg += `\n 签到： 获得${result.data.score}积分`;
    } else if (result.errCode == 6){
        console.log(`\n签到： ${result.msg}`);
        msg += `\n 签到： ${result.msg}`;
    }
}
async function report() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/pd/report`,
        headers: {
            'Host': host,
            'userid': `${ck[0]}`,
        },
        body: JSON.stringify({"taskCode":"share_sy"})
    };
    let result = await httpRequest(options, `分享任务`);

    if (result.errCode == 0) {
        console.log(`\n分享 模拟分享完成`);
        msg += `\n 分享 模拟分享完成`;
    } else if (result.errCode == 4) {
        console.log(`\n分享 成功${result.msg}`);
        msg += `\n 分享 成功${result.msg}`;
    } else if (result.errCode == 6){
        console.log(`\n分享 ${result.msg}`);
        msg += `\n 分享 ${result.msg}`;
    }
}
async function taskreceive() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/pd/taskreceive`,
        headers: {
            'Host': host,
            'userid': `${ck[0]}`,
        },
        body: JSON.stringify({"taskCode":"share_sy"})
    };
    let result = await httpRequest(options, `分享任务`);

    if (result.errCode == 0) {
        console.log(`\n分享 获得2积分`);
        msg += `\n 分享 获得2积分`;
    } else if (result.errCode == 4) {
        console.log(`\n分享 ${result.msg}`);
        msg += `\n 分享 ${result.msg}`;
    } else if (result.errCode == 6){
        console.log(`\n分享 ${result.msg}`);
        msg += `\n 分享 ${result.msg}`;
    }
}
async function taskreceive1() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/pd/taskreceive`,
        headers: {
            'Host': host,
            'userid': `${ck[0]}`,
        },
        body: JSON.stringify({"taskCode":"MobileDailyActve"})
    };
    let result = await httpRequest(options, `登录`);

    if (result.errCode == 0) {
        console.log(`\n登录任务 获得2积分`);
        msg += `\n 登录任务 获得2积分`;
    } else if (result.errCode == 4) {
        console.log(`\n登录任务 ${result.msg}`);
        msg += `\n 登录任务 ${result.msg}`;
    } else if (result.errCode == 6){
        console.log(`\n登录任务 ${result.msg}`);
        msg += `\n 登录任务 ${result.msg}`;
    }
}

/**
 * 连续签到额外奖励 POST
 */
async function user2() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/pd/receive?type=continous`,
        headers: {
            'Host': host,
            'userid': `${ck[0]}`,
        },
        body: JSON.stringify({"type":"continous"})
    };
    let result = await httpRequest(options, `额外奖励`);

    if (result.errCode == 0) {
        console.log(`\n已连续签到 ${result.data.days}天\n领取额外奖励 ${result.data.award}`);
        msg += `\n 已连续签到 ${result.data.days}\n领取额外奖励 ${result.data.award}`;
    } else if (result.errCode == 4) {
        console.log(`\n连续签到 ${result.msg}`);
        msg += `\n 连续签到 ${result.msg}`;
    }
}
async function user1() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/pd/receive?type=cumulative`,
        headers: {
            'Host': host,
            'userid': `${ck[0]}`,
        },
        body: JSON.stringify({"type":"continous"})
    };
    let result = await httpRequest(options, `额外奖励`);

    if (result.errCode == 0) {
        console.log(`\n已连续签到 ${result.data.days}天\n领取额外奖励 ${result.data.award}`);
        msg += `\n 已连续签到 ${result.data.days}\n领取额外奖励 ${result.data.award}`;
    } else if (result.errCode == 4) {
        console.log(`\n连续签到 ${result.msg}`);
        msg += `\n 连续签到 ${result.msg}`;
    }
}

/**
 * 用户信息 GET
 */
async function user3() {
    let options = {
        method: 'GET',
        url: `${hostname}/api/user/pd/score`,
        headers: {
            'Host': host,
            'userid': `${ck[0]}`,
        },
       // body: JSON.stringify()
    };
    let result = await httpRequest(options, `用户信息`);

    if (result.errCode == 0) {
        console.log(`\n现有积分${result.data}`);
        msg += `\n 现有积分${result.data}`;
    if (result.data > 400){
        await exchange();
        console.log("\n ----------兑换话费----------");
        } else{
        console.log("\n积分小于400 跳过兑换任务");
        }
    } else if (result.errCode == 4) {
        console.log(`\n现有积分 ${result.msg}`);
        msg += `\n 现有积分 ${result.msg}`;
    }
}
async function user4() {
    let options = {
        method: 'GET',
        url: `${hostname}/api/user/base/info`,
        headers: {
            'Host': host,
            'userid': `${ck[0]}`,
        },
       // body: JSON.stringify()
    };
    let result = await httpRequest(options, `用户信息`);

    if (result.errCode == 0) {
        console.log(`\n用户：${result.data.nickname}`);
        msg += `\n 用户：${result.data.nickname}`;
    }
}
/**
 * 自动兑换5元话费 POST
 */
async function exchange() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/pd/exchange`,
        headers: {
            'Host': host,
            'userid': `${ck[0]}`,
        },
        body: JSON.stringify({"goodsId":9})
    };
    let result = await httpRequest(options, `兑换话费`);

    if (result.errCode == 0) {
        console.log(`\n兑换${result.goods.name}库存${result.goods.stock}需要${result.goods.score}积分`);
        msg += `\n 兑换${result.goods.name}库存${result.goods.stock}需要${result.goods.score}积分`;
    } else if (result.errCode == 4) {
        console.log(`\n兑换结果 ${result.msg}`);
        msg += `\n 兑换结果 ${result.msg}`;
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
