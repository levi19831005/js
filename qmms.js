
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `https://api.qiumeiapp.com/qmxcx/10006/qmSeckillPointProduct`;
const method = `POST`;
const headers = {
'Accept-Encoding' : `gzip,compress,br,deflate`,
'content-type' : `application/json`,
'Connection' : `keep-alive`,
'Referer' : `https://servicewechat.com/wx30cc0fb02a84eb74/122/page-frame.html`,
'Host' : `api.qiumeiapp.com`,
'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.28(0x18001c2e) NetType/4G Language/zh_CN`
};
const body = `{"appUserToken":"2b11a66a9ad6a4df9417c472926deca545de2b3e","pointProductSeckillId":"1095"}`;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
