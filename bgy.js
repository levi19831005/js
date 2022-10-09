/**
 
 * ========= 青龙--配置文件 作者HHX=========
 * 百工驿app 只支持青龙。获得青豆换东西，有话费、E卡、视频会员等。进去完善下资料。
 * 9.28更新，完成签到、点赞、分享。审核太严格，发动态、评论、发言大概率都会封号，所以不做了。发布文章和视频不会做。
 * 抓包mapi.baigongyi.com下的Authentication值，放入bgy_cookie中
 * cron  0 7 * * *    一天一次，自己定时。
 * 变量格式: export bgy_cookie="Authentication@Authentication"多个账号换行 或用 @ 分割
 * 本脚本只是自己学习js的一个实践，禁止任何公众号、自媒体进行任何形式的转载、发布，感谢kristallsi、心雨、Sky各位大佬心雨的教学指导！
 * [task_local]
#百工驿
0,30 8 * * * https://raw.githubusercontent.com/levi19831005/js/main/bgy.js, tag=百工驿, enabled=true
[rewrite_local]
#百工驿
https://mapi.baigongyi.com/appStartRecord url script-request-heads https://raw.githubusercontent.com/levi19831005/js/main/bgy.js
[MITM]
hostname = mapi.baigongyi.com

 */

 const $ = new Env("🔱百工驿🔱");
 const notify = $.isNode() ? require("./sendNotify") : "";
 const Notify = 1 		//0为关闭通知,1为打开通知,默认为1
 const debug = 0 		//0为关闭调试,1为打开调试,默认为0
 
 ///////////////////////////////////////////////////////////////////
 let ckStr = process.env.bgy_cookie;
 const {log} = console;
 let msg = "";
 let ck = "";
 let host = "mapi.baigongyi.com";
 let hostname = "https://" + host;
 let sja = randomInt(00001, 99999)
 ram_num = randomInt(1, 10)
 let textarr = ['点赞', '赞', '赞一个', '有用', '强', '学习', '学下', '看看', '学到', '嘿嘿']
 let text = textarr[ram_num];
 let status;
 status = (status = ($.getval("bgystatus") || "1")) > 1 ? `${status}` : "";
 
 async function tips(ckArr) {
 
     console.log(`\n=============== 共找到 ${ckArr.length} 个账号 ===============`);
     msg += `\n =============== 共找到 ${ckArr.length} 个账号 ===============`
     debugLog(`【debug】 这是你的账号数组: \n ${ckArr} `);
 }
 
 !(async () => {
     let ckArr = await getCks(ckStr, "bgy_cookie");
 
     await poem();
     await tips(ckArr);
     for (let index = 0; index < ckArr.length; index++) {
         ks_num = index + 1;
         console.log(`\n------------- 开始【第 ${ks_num} 个账号】------------- `);
         msg += `\n------------- 开始【第 ${ks_num} 个账号】------------- `
         ck = ckArr[index].split("&");
         debugLog(`【debug】 这是你第 ${ks_num} 账号信息: ${ck} `);
         await start();
     }
     await SendMsg(msg);
 })()
     .catch((e) => $.logErr(e))
     .finally(() => $.done());

//圈X获取ck
function bgyck() {
    if ($request.url.indexOf("appStartRecord") > -1) {


        const bgyhd = JSON.stringify($request.headers)
        if (bgyhd) $.setdata(bgyhd, `bgyhd${status}`)
        $.log(bgyhd)



        $.msg($.name, "", `百工驿${status}获取headers成功`)

    }
}





 
 async function start() {
       
 
         console.log("\n =======用户信息=======");
        await yonghu();
         await $.wait(1000)
       
        console.log("\n =========签到=========");
         await sign();
         await $.wait(2500)
        

         console.log("\n =======分享=======");
         await fenx();
         await $.wait(1223)

         /*console.log("\n =======评论=======");
         await pinglun();
         await $.wait(4890)*/
       
         console.log("\n =======点赞=======");
         await dianzan();
         await $.wait(5412)
         await qingdou();
         await $.wait(1000)
         console.log(`\n 🍁任务完成🍁`);
         msg += `\n 🍁任务完成🍁`;
         
     }
 
 
 //封装函数

 //签到
 async function sign() {
     let options = {
         method: 'GET',
         url: `${hostname}/beans/signIn`,
         headers: {
         
             'Accept' : `*/*`,
            
             'Version' : `4.7.0`,
             'Accept-Encoding' : `gzip, deflate, br`,
             'Connection' : `keep-alive`,
             'Host' : `mapi.baigongyi.com`,
             'User-Agent' : `Peer/4.5.8 (iPhone; iOS 15.3.1; Scale/2.00)`,
             'Authentication': `${ck[0]}`
             
 
         },
         body: ``
     };
     let result = await httpRequest(options, `签到情况`);
 
     if (result.code == 200) {
         console.log(`\n 签到结果📝: ${result.message}`);
         msg += `\n 签到结果📝: ${result.message}`;
     } else if (result.code == 9002) {
         console.log(`\n 签到结果📝: ${result.message}`);
         msg += `\n 签到结果📝: ${result.message}`;
     }
 }



 //用户信息
 async function yonghu() {
    let options = {
        method: 'GET',
        url: `${hostname}/user/info`,
        headers: {
            'Accept' : `*/*`,
            'Version' : `4.7.0`,
            'Accept-Encoding' : `gzip, deflate, br`,
            'Connection' : `keep-alive`,
            'Host' : `mapi.baigongyi.com`,
            'User-Agent' : `Peer/4.5.8 (iPhone; iOS 15.3.1; Scale/2.00)`,
            'Authentication': `${ck[0]}`
        },
        body: ``
    };
    let result = await httpRequest(options, `用户信息`);

    if (result.code == 200) {
        console.log(`\n 用户昵称😊: ${result.data.nickName}`);
        msg += `\n 用户昵称😊: ${result.data.nickName}`;
    } 
}

 //青豆信息
 async function qingdou() {
    let options = {
        method: 'GET',
        url: `${hostname}/beans/getTaskCenterList`,
        headers: {
            'Accept' : `*/*`,
            'Version' : `4.7.0`,
            'Accept-Encoding' : `gzip, deflate, br`,
            'Connection' : `keep-alive`,
            'Host' : `mapi.baigongyi.com`,
            'User-Agent' : `Peer/4.5.8 (iPhone; iOS 14.3; Scale/2.00)`,
            'Authentication' : `${ck[0]}`,
            'Accept-Language' : `zh-Hans-CN;q=1`
        },
        body: ``
    };
    let result = await httpRequest(options, `青豆信息`);

    if (result.code == 200) {
        console.log(`\n 现有青豆🐛: ${result.data.totalBean}粒`);
        msg += `\n 现有青豆🐛: ${result.data.totalBean}粒`;
    } 
}
 
/////////////////////////////////////////////////////发布动态
async function fdt() {
    let options = {
        method: 'POST',
        url: `${hostname}/idea/add`,
        headers: {
            'Accept' : `*/*`,
            'Version' : `4.5.8`,
            'Connection' : `keep-alive`,
            'uid' : `2ACFA8EE-17D4-4598-A51F-2750CEFF5573`,
            'Content-Type' : `application/json`,
            'Host' : `mapi.baigongyi.com`,
            'Authentication' : `${ck[0]}`,
            'User-Agent' : `Peer/4.5.8 (iPhone; iOS 14.3; Scale/2.00)`,
            'Accept-Language' : `zh-Hans-CN;q=1`,
            'Accept-Encoding' : `gzip, deflate, br`

        },
        body: `{"activityContent":"${add_comment_text}","content":"${add_comment_text}","activityId":"","atUserIds":""}`
    };
    let result = await httpRequest(options, `发布动态`);

    if (result.code == 200) {
        console.log(`\n 发布动态📕: ${result.message}`);
        msg += `\n 发布动态📕: ${result.message}`;
    } 
}


 //评论
 async function pinglun() {
    let options = {
        method: 'POST',
        url: `${hostname}/commentRecord/add`,
        headers: {
            'content-type' : `application/json`,
            'authentication' : `${ck[0]}`,
            'host' : `mapi.baigongyi.com`,
            'version' : `4.5.8`,
            'user-agent' : `iphone`,
            'accept-encoding' : `gzip`
        },
        body: `{"objId":"fcdfb1cb${sja}3b697b95e0c66e18a56","objType":7,"comment":"${text}"}`
    };
    let result = await httpRequest(options, `评论一次`);

    if (result.code == 200) {
        console.log(`\n 评论一次📑: ${result.message}`);
        msg += `\n 评论一次📑: ${result.message}`;
    } 
}

 //分享
 async function fenx() {
    let options = {
        method: 'POST',
        url: `${hostname}/shareRecord`,
        headers: {
            'Accept' : `*/*`,
            'Version' : `4.7.0`,
            'Connection' : `keep-alive`,
            'Content-Type' : `application/json`,
            'Host' : `mapi.baigongyi.com`,
            'Authentication' : `${ck[0]}`,
            'User-Agent' : `Peer/4.5.8 (iPhone; iOS 14.3; Scale/2.00)`,
            'Accept-Language' : `zh-Hans-CN;q=1`,
            'Accept-Encoding' : `gzip, deflate, br`

        },
        body: `{"objType":"7","accountId":"e2a9f03cdf0f45d18273f0344aea6748","shareDestination":1,"objId":"2d534c0e81d${sja}b9bfd17468b545fc"}`
    };
    let result = await httpRequest(options, `分享第次`);

    if (result.code == 200) {
        console.log(`\n 分享一次📧: ${result.message}`);
        msg += `\n 分享一次📧: ${result.message}`;
    } 
}






 //点赞
 async function dianzan() {
    let options = {
        method: 'POST',
        url: `${hostname}/like/add`,
        headers: {
            'content-type' : `application/json`,
            'authentication' : `${ck[0]}`,
            'host' : `mapi.baigongyi.com`,
            'version' : `4.7.0`,
            'user-agent' : `iphone`,
            'accept-encoding' : `gzip`

        },
        body: `{"objType":7,"objId":"b58bf668e${sja}3888745e1b628310c0","likedFlag":true,"accountId":"e2a9f03cdf0f45d18273f0344aea6748"}`
    };
    let result = await httpRequest(options, `点赞第次`);

    if (result.code == 200) {
        console.log(`\n 点赞一次👍: ${result.message}`);
        msg += `\n 点赞一次👍: ${result.message}`;
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
  * 获取随机诗词
  */
 function poem(timeout = 3 * 1000) {
	return new Promise((resolve) => {
		let url = {
			url: `https://v1.jinrishici.com/all.json`
		}
		$.get(url, async (err, resp, data) => {
			try {
				data = JSON.parse(data)
				log(`${data.content}  \n————《${data.origin}》${data.author}`);
				add_comment_text = data.content    //获取随机古诗词，并定义为变量add_comment_text
			} catch (e) {
				log(e, resp);
			} finally {
				resolve()
			}
		}, timeout)
	})
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
 
