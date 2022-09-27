/*软件名称:启牛果园 
更新时间：2022-09-27
脚本说明：启牛果园分享、种树


boxjs地址 :  
https://raw.githubusercontent.com/YaphetS0903/JStest/main/YaphteS0903.boxjs.json
启牛果园
圈X配置如下，其他软件自行测试
[task_local]
自行设置运行时间，可设置5分钟到10分钟一次，别太快，垃圾游戏容易黑
#启牛果园

[rewrite_local]
#启牛果园分享
https://qaf.feierlaiedu.com/knowledge-app-farm/api/v1/activity/reward/share url script-request-head https://raw.githubusercontent.com/levi19831005/js/main/qxrewrite/qngyck.js
https://qaf.feierlaiedu.com/knowledge-app-farm/api/v1/activity/reward/share url script-request-body https://raw.githubusercontent.com/levi19831005/js/main/qxrewrite/qngyck.js
#启牛果园浇水
https://qaf.feierlaiedu.com/knowledge-app-farm/api/v1/activity/feed url script-request-head https://raw.githubusercontent.com/levi19831005/js/main/qxrewrite/qngyck.js
https://qaf.feierlaiedu.com/knowledge-app-farm/api/v1/activity/feed url script-request-body https://raw.githubusercontent.com/levi19831005/js/main/qxrewrite/qngyck.js
[MITM]
hostname = qaf.feierlaiedu.com
*/


const $ = new Env('启牛果园');
let status;
status = (status = ($.getval("qngystatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符


const qngyhdArr = [],qngybodyArr = [],qngyjshdArr = [],qngyjsbodyArr = [],qngycount = ''

let qngyhd = $.getdata('qngyhd')
let qngybody = $.getdata('qngybody')
let qngyjshd = $.getdata('qngyhd')
let qngyjsbody = $.getdata('qngyspbody')



!(async () => {
  if (typeof $request !== "undefined") {
    await qngyck()
   
  } else {
    qngyhdArr.push($.getdata('qngyhd'))
    qngybodyArr.push($.getdata('qngybody'))
    qngyjshdArr.push($.getdata('qngyhd'))
    qngyjsbodyArr.push($.getdata('qngyspbody'))
    let qngycount = ($.getval('qngycount') || '1');
  for (let i = 2; i <= qngycount; i++) {
    qngyhdArr.push($.getdata(`qngyhd${i}`))
    qngybodyArr.push($.getdata(`qngybody${i}`))
    qngyjshdArr.push($.getdata(`qngyhd${i}`))
    qngyjsbodyArr.push($.getdata(`qngyspbody${i}`))
  }
    console.log(`------------- 共${qngyhdArr.length}个账号-------------\n`)
      for (let i = 0; i < qngyhdArr.length; i++) {
        if (qngyhdArr[i]) {
          qngyhd = qngyhdArr[i];
          qngybody = qngybodyArr[i];
          qngyjshd = qngyhdArr[i];
          qngyjsbody = qngyspbodyArr[i];
          $.index = i + 1;
          console.log(`\n开始【启牛果园${$.index}】`)
   
    
         await qngy();
         

    
    
  }
}}

})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
//数据获取


function qngyck() {
   if ($request.url.indexOf("reward/share") > -1) {
 
  const qngyhd = JSON.stringify($request.headers)
        if(qngyhd)    $.setdata(qngyhd,`qngyhd${status}`)
$.log(qngyhd)
const qngybody = $request.body
        if(qngybody)    $.setdata(qngybody,`qngybody${status}`)
$.log(qngybody)
   $.msg($.name,"",'启牛果园'+`${status}` +'分享拿水滴数据获取成功！')
  }else if ($request.url.indexOf("activity/feed") > -1) {
 
  const qngyjshd = JSON.stringify($request.headers)
        if(qngyjshd)    $.setdata(qngyhd,`qngyhd${status}`)
$.log(qngyjshd)
const qngyjsbody = $request.body
        if(qngyjsbody)    $.setdata(qngybody,`qngybody${status}`)
$.log(qngyjsbody)
   $.msg($.name,"",'启牛果园'+`${status}` +'浇水数据获取成功！')
  }
}
