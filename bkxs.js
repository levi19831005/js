/*
APP:必看小说
变量 如
bkxshd='sessionid=6e52cab4cefa43c193f3a466b0c33111'
抓包点我的 关键字 info
查看请求头COOKIE里的 只需要sessionid=XXXXXX这一段
多账号用艾特隔开@
提现变量为withdraws
withdraws='' 1为1元 2为5元 3为10元 4为30元 5为50元 6为100元
每天额度是每天刷新的10点吧 
建议一天别跑多了 怕黑 
cron 0 1,10 * * * bkxs.js
*/

const $ = new Env('必看小说');
var crypto = require("crypto");
let status;
status = (status = ($.getval("bkxsstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
let bkxshdArr = [],bkxscount = ''
const notify = $.isNode() ? require('./sendNotify') : '';
let bkxshd= $.isNode() ? (process.env.bkxshd ? process.env.bkxshd : "") : ($.getdata('bkxshd') ? $.getdata('bkxshd') : "")
let withdraws=$.isNode() ? (process.env.withdraws ? process.env.withdraws : "") : ($.getdata('withdraws') ? $.getdata('withdraws') : "")
let allMessage = '';
let bkxshds = ""
const logs =0;
const host='https://api.ibreader.com/'
var hours = new Date().getHours();
var s = new Date().getMinutes();

var timestamp = Math.round(new Date().getTime()/1000).toString();
!(async () => {

      if(!$.isNode()){
          bkxshdArr.push($.getdata('bkxshd'))
          let bkxscount = ($.getval('bkxscount') || '1');
          for (let i = 2; i <= bkxscount; i++) {
            bkxshdArr.push($.getdata(`bkxshd${i}`))
            }
    console.log(`------------- 共${bkxshdArr.length}个账号-------------\n`)
      for (let i = 0; i < bkxshdArr.length; i++) {
        if (bkxshdArr[i]) {
          bkxshd = bkxshdArr[i];
          $.index = i + 1;

  }
}
      }else  {
          if (process.env.bkxshd && process.env.bkxshd.indexOf('@') > -1) {
            bkxshdArr = process.env.bkxshd.split('@');
            console.log(`您选择的是用"@"隔开\n`)
        } else {
            bkxshds = [process.env.bkxshd]
        };
        Object.keys(bkxshds).forEach((item) => {
        if (bkxshds[item]) {
            bkxshdArr.push(bkxshds[item])
        }
    })
          console.log(`共${bkxshdArr.length}个cookie`)
	        for (let k = 0; k < bkxshdArr.length; k++) {
                $.message = ""
                bkxshd = bkxshdArr[k]
                $.index = k + 1;
 
          console.log(`\n开始【必看小说${$.index}】`)
//allMessage +=`\n开始【必看小说${$.index}】`
          
await withdraw(withdraws)
await info()
await getServiceAreaTaskList()
await getChapterTaskList()
await list()

}


      }
  
  if ($.isNode() && allMessage) {
      await notify.sendNotify(`${$.name}`, `${allMessage}` )
    }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
  function info() {
 return new Promise((resolve) => {
  
$.post(bkxs(`api/task/v1/wallet/user/info`,'encrypted_param=DVf%2Frs12MOEFrDOSEPa98erYQ0eqbyQj%2FNpp0H2FxjNTHT9XGY1Hr2LwJ26bkcg4CbE2eO4gFNM1fM2nv%2FsPgzX3zqJklKx2JNqZKuv2ibOUK7WiY46v%2B2zq9IjD9lNas4v6j8pbAJP%2FmAYUon%2FrvSUnT%2FDle%2BpoN3S%2Fg%2BQJBfI%3D&sign=84601349ea093486774c54e62f005b7b&'), async (err, resp, data) => {
        //$.log(data)
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        }// else {
          if (safeGet(data)) {
            data = JSON.parse(data);
             if(data.code==100){

                  $.log("Total: "+data.data.total+"\n")  
                  $.log("Today: "+data.data.today+"\n") 
                  $.log("Cash: "+data.data.cash+"\n") 
             
             }
             else if(data.code !== 100){
             console.log(data.msg+"\n")
                 //allMessage +='\n'+data.msg+'\n'
             }
          }
        
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function list() {
 return new Promise((resolve) => {
  
$.post(bkxs(`task_api/task/list`,'sign=75F761FEACAA604E19A0F4FEFABE556E&time=1654363935000'), async (err, resp, data) => {
        //$.log(data)
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        }// else {
          if (safeGet(data)) {
            data = JSON.parse(data);
             if(data.code==100){
                
              taskVOS = data.data
              for(let i=0;i<taskVOS.length;i++){
                 isFinish = taskVOS[i].isFinish
                // if(isFinish = 0){
                  $.log("Do Task: "+taskVOS[i].name+"\n")   
                 
                 await finish(taskVOS[i].id) 
                 await $.wait(2000)
                 
                 //}  
              }
             
             }
             else if(data.code !== 100){
             console.log(data.msg+"\n")
                 //allMessage +='\n'+data.msg+'\n'
             }
          }
        
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function getServiceAreaTaskList() {
 return new Promise((resolve) => {
  
$.post(bkxs(`task_api/task/getServiceAreaTaskList`,'chapterCoinRate=10&readChapterCount=0&sign=59DE7B94F2B947C52EF8E1DCFA699597&time=1654363936000'), async (err, resp, data) => {
        
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        }// else {
          if (safeGet(data)) {
            data = JSON.parse(data);
             if(data.code==100){
               console.log('\n叼毛：'+data.data.userInfoBO.clientInfo.user.nickname+"\n")  
              taskVOS = data.data.taskVOS
              for(let i=0;i<taskVOS.length;i++){
                 isFinish = taskVOS[i].isFinish
                 //if(isFinish = 0){
                  $.log("Do Task: "+taskVOS[i].name+"\n")   
                 
                 await finish(taskVOS[i].id) 
                 await $.wait(2000)
                 
                 //}  
              }
             
             }
             else if(data.code !== 100){
             console.log(data.msg+"\n")
                 //allMessage +='\n'+data.msg+'\n'
             }
          }
        
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function getChapterTaskList() {
 return new Promise((resolve) => {
  
$.post(bkxs(`task_api/task/getChapterTaskList`,'time=1654363108019&sign=c57423f4fd93025efc42c048ff96f5b0&'), async (err, resp, data) => {
        //$.log(data)
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        }// else {
          if (safeGet(data)) {
            data = JSON.parse(data);
             if(data.code==100){
               console.log('\n叼毛：'+data.data.userInfoBO.clientInfo.user.nickname+"\n")  
              taskVOS = data.data.taskVOS
              for(let i=0;i<taskVOS.length;i++){
                 isFinish = taskVOS[i].isFinish
                 //if(isFinish = 0){
                  $.log("Do Task: "+taskVOS[i].name+"\n")   
                 
                 await finish(taskVOS[i].id) 
                 await $.wait(2000)
                 
                // }  
              }
             
             }
             else if(data.code !== 100){
             console.log(data.msg+"\n")
                 //allMessage +='\n'+data.msg+'\n'
             }
          }
        
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function finish(taskId) {
 return new Promise((resolve) => {
  sign =md5('7b7fpld4roey0e6e&taskId='+taskId+'&time='+timestamp)
$.post(bkxs(`task_api/task/finish`,`time=${timestamp}&sign=${sign}&taskId=${taskId}&`), async (err, resp, data) => {
    //$.log(data)    
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        }// else {
          if (safeGet(data)) {
            data = JSON.parse(data);
             if(data.code==100){
               console.log('\nTask：'+data.msg + ' rewardNum：'+data.data.rewardNum+"\n")  
              
              
             
             }
             else if(data.code !== 100){
             console.log(data.msg+"\n")
                 //allMessage +='\n'+data.msg+'\n'
             }
          }
        
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function withdraw(itemId) {
 return new Promise((resolve) => {
  sign =md5('7b7fpld4roey0e6e&itemId='+itemId+'&platform=0&time='+timestamp)
$.post(bkxs(`task_api/task/v1/withdraw/submit`,`itemId=${itemId}&platform=0&sign=${sign}&time=${timestamp}`), async (err, resp, data) => {
    //$.log(data)    
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        }// else {
          if (safeGet(data)) {
            data = JSON.parse(data);
             if(data.code==100){
               console.log('\nWithdraw：'+data.msg+"\n")  
              
              
             
             }
             else if(data.code !== 100){
             console.log(data.msg+"\n")
                 //allMessage +='\n'+data.msg+'\n'
             }
          }
        
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function bkxs(a,body) {
  return {

    url: `${host}${a}`,
    body:`${body}`,
    headers: {
'Connection': 'Keep-Alive',
'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
'Accept': '*/*',
'Accept-Language': 'zh-cn',
'Cookie': bkxshd,
'Host': 'api.ibreader.com',
'Referer': 'https://api.ibreader.com/task_api/task/getChapterTaskList',
'User-Agent': 'Mozilla/5.0 (Linux; Android 7.1.2; PCAM00 Build/NGI77B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/62.0.3202.84 Mobile Safari/537.36',
'X-Client': 'sv=7.1.2;pm=PCAM00;ss=1080*2196;version=5.1.86.18.130500001;vId=60752445880d4366988c18aa9d9f6b80;signVersion=2;webVersion=new;oaid=null;pkv=1;ddid=DUzp43Y2YF9X-5bmS5YXSEZcB3nELTOxTV04RFV6cDQzWTJZRjlYLTVibVM1WVhTRVpjQjNuRUxUT3hUVjA0c2h1;androidosv=25;os=0;muk=ui98HJmkunswcEuBWDlg3A%3D%3D;firm=OPPO;duk=Bv6b4gAgfXcjaj%2BBwEtH32pUNNCFZYDKNOv%2Boplr96Q%3D;',
'Accept-Encoding': 'gzip, deflate',

    }
  }
}
function bkxsget(a) {
  return {

    url: `${host}${a}`,
    headers: {
'User-Agent': 'Mozilla/5.0 (Linux; Android 7.1.2; PCAM00 Build/NGI77B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/62.0.3202.84 Mobile Safari/537.36',
'Connection': 'keep-alive',
'Content-Type': 'application/x-www-form-urlencoded',
'COOKIE': bkxs,
'X-Client': 'sv=7.1.2;pm=PCAM00;ss=1080*2196;version=5.1.86.18.130500001;vId=60752445880d4366988c18aa9d9f6b80;signVersion=2;webVersion=new;oaid=null;pkv=1;ddid=DUzp43Y2YF9X-5bmS5YXSEZcB3nELTOxTV04RFV6cDQzWTJZRjlYLTVibVM1WVhTRVpjQjNuRUxUT3hUVjA0c2h1;androidosv=25;os=0;muk=ui98HJmkunswcEuBWDlg3A%3D%3D;firm=OPPO;duk=Bv6b4gAgfXcjaj%2BBwEtH32pUNNCFZYDKNOv%2Boplr96Q%3D;',
'Host': 'api.ibreader.com',
'Accept-Encoding': 'gzip, deflate',


    }
  }
}


function md5(s) {
        
         return crypto.createHash('md5').update(String(s)).digest('hex').toUpperCase();
    }

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
