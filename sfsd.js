/**
 * 请勿烂分享脚本
 
 * 顺丰速递app   劲量抓app的cookie  小程序的也行但是失效非常快
 * 可攒足够多兑换抵扣券
 
 * 感谢群友支持及测试
 
 * 7/5     初步完成签到 几个浏览任务
 * 7/11    已修复所有问题
 * cron 0 0 8 * * ? 定时自己改 每天一次
 
 * 抓包任意url https://mcs-mimp-web.sf-express.com/mcs-mimp/ 里的cookie只需要 sessionId=xxxxxxxxx这条
 
 * 增加账号互助功能(必须两个号)
 * 分享邀请链接到微信 访问微信分享的链接 抓取https://mcs-mimp-web.sf-express.com/mcs-mimp/commonPost/~memberNonactivity~integralTaskStrategyService~inviteTaskNotice
 提取 请求体body里的 inviteUserId 例如{"inviteUserId":"TFpKOVdIc1Q4K2ZyUFZ6eGlIbEJ4Ykg0QXVES09Id3VjRzlWUm9iR2kxc2ZLTVhrdGFiSllWa2daaGpOaUdkQQ==","sceneCode":"647"}
 
 cookie和inviteUserId用&连接   sessionId=xxxxxxxxx&TFpKOVdIc1Q4K2ZyUFZ6eGlIbEJ4Ykg0QXVES09Id3VjRzlWUm9iR2kxc2ZLTVhrdGFiSllWa2daaGpOaUdkQQ==
 
 * 账号1连接账号2的互助码 账号2连接账号1的互助码 才生效
   等以后会写了再改……
 
 * ========= 青龙--配置文件 =========
 * 变量格式: export sfsdcookie="cookie@cookie"多个账号换行 或用 @ 分割
 *
 */

const $ = new Env("顺丰速递+");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1 		//0为关闭通知,1为打开通知,默认为1
const debug = 0 		//0为关闭调试,1为打开调试,默认为0
///////////////////////////////////////////////////////////////////
let ckStr = process.env.sfsdcookie;
let msg = "";
let ck = "";
let browse = true;
let browse1 = true;
let host = "mcs-mimp-web.sf-express.com";
let hostname = "https://" + host;

async function tips(ckArr) {

    console.log(`\n=============== 共找到 ${ckArr.length} 个账号 ===============`);
    msg += `\n =============== 共找到 ${ckArr.length} 个账号 ===============`
    debugLog(`【debug】 这是你的账号数组: \n ${ckArr} `);
}

!(async () => {
    let ckArr = await getCks(ckStr, "sfsdcookie");
    await tips(ckArr);
    for (let index = 0; index < ckArr.length; index++) {
        sfsd_num = index + 1;
        console.log(`\n------------- 开始【第 ${sfsd_num} 个账号】------------- `);
        msg += `\n------------- 开始【第 ${sfsd_num} 个账号】------------- `
        ck = ckArr[index].split("&");
        debugLog(`【debug】 这是你第 ${sfsd_num} 账号信息: ${ck} `);
        await start();
    }
    await SendMsg(msg);
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done());

async function start() {
        
        console.log("\n =========开始  每日任务=========");
        msg += `\n =========开始 每日福利=========`;
        await sign();
        if (browse) {
        taskid = `TASK20220419161811952422`
        id = `6BCCA692CB51485D96D709582EDB4AB2`
        console.log("\n =========探索超值福利=========");
        msg += `\n =========探索超值福利=========`;
        await $.wait(20 * 1000);
        await id1();
        }
        if (browse) {
        taskid = `TASK20211222175441522390`
        id = `1454FE1A0D824937A074726F3416208E`
        console.log("\n =========浏览积分秒杀=========");
        msg += `\n =========浏览积分秒杀=========`;
        await $.wait(20 * 1000);
        await id1();
        }
        if (browse) {
        taskid = `TASK20211021150043121178`
        id = `54D846E056B740AAA4C543817114CEFA`
        console.log("\n =========浏览积分商城=========");
        msg += `\n =========浏览积分商城=========`;
        await $.wait(20 * 1000);
        await id1();
        }
        if (browse) {
        taskid = `TASK20220609181656759192`
        id = `EF75E46057AD47328FCFC941DF89E201`
        console.log("\n =========新浪微博互动=========");
        msg += `\n =========新浪微博互动=========`;
        await $.wait(20 * 1000);
        await id2();
        }
        
        console.log("\n\n =========开始 每周任务=========");
        msg += `\n =========开始 每周任务=========`;
        if (browse) {
        taskid = `TASK20211021152450608942`
        id = `1125AEDD23DA491C8D1486DE5805B807`
        console.log("\n =========浏览会员权益=========");
        msg += `\n =========浏览会员权益=========`;
        await $.wait(20 * 1000);
        await id1();
        }
        
        console.log("\n\n =========开始 每月任务=========");
        msg += `\n =========开始 每月任务=========`;
        await $.wait(15 * 1000);
        await receive();
        
        if (sfsd_num >= 1){
        console.log("\n =========开始 内部互助=========");
        msg += `\n =========开始 内部互助=========`;
        if (browse1) {
        cd = `647`
        taskid = `TASK20211118145756912941`
        id = `E4FEA100E504426FBC5FF85CB62507DE`
        console.log("\n =========邀请访问签到=========");
        msg += `\n =========邀请访问签到=========`;
        await $.wait(15 * 1000);
        await TaskNotice();
        }
        if (browse1) {
        cd = `691`
        taskid = `TASK20211118152352423666`
        id = `BA0414B8CA194502813E8B087B0AC1BA`
        console.log("\n =========邀请访问抽奖=========");
        msg += `\n =========邀请访问抽奖=========`;
        await $.wait(15 * 1000);
        await TaskNotice();
        }
        if (browse1) {
        cd = `643`
        taskid = `TASK20211118152657999923`
        id = `8F36C102BF044334B1AE984ACE86A386`
        console.log("\n =========邀请访问夺宝=========");
        msg += `\n =========邀请访问夺宝=========`;
        await $.wait(15 * 1000);
        await TaskNotice();
        }
        if (browse1) {
        cd = `665`
        taskid = `TASK20211118152718999655`
        id = `1221AFD558724EF7A3A010C9FF28B0D4`
        console.log("\n =========邀请访问秒杀=========");
        msg += `\n =========邀请访问秒杀=========`;
        await $.wait(15 * 1000);
        await TaskNotice();
        }
        
        console.log("\n =========开始  积分查询=========");
        msg += `\n =========开始 积分查询=========`;
        await balance();
        
        }
    }
//积分查询
async function balance() {
    let options = {
        method: 'POST',
        url: `${hostname}/mcs-mimp/member/personalInfo`,
        headers: {
            Host: host,
            'content-type': 'application/json;charset=UTF-8',
            'cookie': `${ck[0]}`
        },
        body: JSON.stringify({})
    };
    let result = await httpRequest(options, `积分查询`);

    if(result.errorCode == 100111) {
        console.log(`\n ${result.errorMessage}`);
        msg += `\n ${result.errorMessage}`;
    }  else if(result.success == true) {
        console.log(`\n用户${result.obj.mobile}\n${result.obj.levelName}\n剩余${result.obj.availablePoints}积分\n`);
        msg += `\n 用户${result.obj.mobile}\n${result.obj.levelName}\n剩余${result.obj.availablePoints}积分`;
    }
}



//尝试内部互助
async function TaskNotice() {
    let options = {
        method: 'POST',
        url: `${hostname}/mcs-mimp/commonPost/~memberNonactivity~integralTaskStrategyService~inviteTaskNotice`,
        headers: {
            Host: host,
            'content-type': 'application/json;charset=UTF-8',
            'cookie': `${ck[0]}`
        },
        body: JSON.stringify({"inviteUserId":`${ck[1]}`,"sceneCode":`${cd}`})
    };
    let result = await httpRequest(options, `邀请用户`);

    if(result.errorCode == 100111) {
        console.log(`\n ${result.errorMessage}`);
        msg += `\n ${result.errorMessage}`;
    } else if (result.success == false) {
        console.log(`\n邀请：${result.errorMessage}`);
        msg += `\n 邀请：${result.errorMessage}`;
        await $.wait(20 * 1000);
        await receive1();
    } else if(result.success == true) {
        console.log(`\n邀请：助力成功`);
        msg += `\n 邀请：助力成功`;
        await $.wait(20 * 1000);
        await receive1();
    } else {
    return browse1 = false;
    }
}
async function receive1() {
    let options = {
        method: 'POST',
        url: `${hostname}/mcs-mimp/commonPost/~memberNonactivity~integralTaskStrategyService~fetchIntegral`,
        headers: {
            Host: host,
            'content-type': 'application/json;charset=UTF-8',
            'cookie': `${ck[0]}`
        },
        body: JSON.stringify({"strategyId":22,"taskId":`${taskid}`,"taskCode":`${id}`})
    };
    let result = await httpRequest(options, `领取积分`);

    if(result.errorCode == 100111) {
        console.log(`\n ${result.errorMessage}`);
        msg += `\n ${result.errorMessage}`;
    } else if (result.success == false) {
        console.log(`\n领积分：${result.errorMessage}`);
        msg += `\n 领积分：${result.errorMessage}`;
    } else if(result.success == true) {
        console.log(`\n领积分：获得${result.obj.point}积分`);
        msg += `\n 领积分：获得${result.obj.point}积分`;
    }
}


//模拟浏览
async function id1() {
    let options = {
        method: 'GET',
        url: `${hostname}/mcs-mimp/task/finishTask?id=${id}`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
       // body: JSON.stringify()
    };
    let result = await httpRequest(options, `模拟浏览`);

    if(result.errorCode == 100111) {
        console.log(`\n ${result.errorMessage}`);
        msg += `\n ${result.errorMessage}`;
    } else if (result.obj == false) {
        console.log(`\n今日已完成`);
        msg += `\n 今日已完成`;
        await $.wait(20 * 1000);
        await receive();
    } else if(result.obj == true) {
        console.log(`\n模拟浏览成功`);
        msg += `\n 模拟浏览成功`;
        await $.wait(20 * 1000);
        await receive();
    }
}

async function id2() {
    let options = {
        method: 'GET',
        url: `${hostname}/mcs-mimp/task/finishTask?id=${id}`,
        headers: {
            Host: host,
            'cookie': `${ck[0]}`
        },
       // body: JSON.stringify()
    };
    let result = await httpRequest(options, `模拟浏览`);

    if(result.errorCode == 100111) {
        console.log(`\n ${result.errorMessage}`);
        msg += `\n ${result.errorMessage}`;
    } else if (result.obj == false) {
        console.log(`\n今日已完成`);
        msg += `\n 今日已完成`;
    } else if(result.obj == true) {
        console.log(`\n模拟浏览成功`);
        msg += `\n 模拟浏览成功`;
        await $.wait(20 * 1000);
        await receive1();
    }
}

async function receive() {
    let options = {
        method: 'POST',
        url: `${hostname}/mcs-mimp/commonPost/~memberNonactivity~integralTaskStrategyService~fetchIntegral`,
        headers: {
            Host: host,
            'content-type': 'application/json;charset=UTF-8',
            'cookie': `${ck[0]}`
        },
        body: JSON.stringify({"strategyId":1,"taskId":`${taskid}`,"taskCode":`${id}`})
    };
    let result = await httpRequest(options, `领取积分`);

    if(result.errorCode == 100111) {
        console.log(`\n ${result.errorMessage}`);
        msg += `\n ${result.errorMessage}`;
    } else if (result.success == false) {
        console.log(`\n领积分：${result.errorMessage}`);
        msg += `\n 领积分：${result.errorMessage}`;
    } else if(result.success == true) {
        console.log(`\n领积分：获得${result.obj.point}积分`);
        msg += `\n 领积分：获得${result.obj.point}积分`;
    }
}
//签到
async function sign() {
    let options = {
        method: 'POST',
        url: `${hostname}/mcs-mimp/integralTaskSignPlusService/automaticSignFetchPackage`,
        headers: {
            Host: host,
            'content-type': 'application/json;charset=UTF-8',
            'cookie': `${ck[0]}`
        },
        body: JSON.stringify({"strategyId":14,"taskId":"TASK20211021135739329023","taskCode":"BF21CB6C1540463DBD4B1B86F1C0D9DC"})
    };
    let result = await httpRequest(options, `连续签到签到`);

    if(result.errorCode == 100111) {
        console.log(`\n ${result.errorMessage}`);
        msg += `\n ${result.errorMessage}`;
    } else if (result.obj.hasFinishSign == 1) {
        console.log(`\n连续签到奖励：今日已完成`);
        msg += `\n 连续签到奖励：今日已完成`;
    } else if(result.obj.hasFinishSign == 0) {
        console.log(`\n连续签到：您已连续签到${result.obj.countDay}天获得${result.obj.integralTaskSignPackageVOList[0].signPopupTitle}`);
        msg += `\n 连续签到：您已连续签到${result.obj.countDay}天获得${result.obj.integralTaskSignPackageVOList[0].signPopupTitle}`;
    } else {
    return browse = false;
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
