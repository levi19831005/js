/**
 * 脚本地址 https://raw.githubusercontent.com/kristallsi/JavaScript/main/pddgy.js
 
 * 请勿烂分享脚本
 * tg群 https://t.me/+JHc9YrZT1Iw0NDFl
   频道 https://t.me/+l-JQvXtZeZU3MTk1
 * 
 
 * 拼多多   vx小程序
 
 * 抓包https://mobile.yangkeduo.com 里的accesstoken
 
 * cron 0 0 7,13,19 * * ? 定时自己改务必在7-8，12-14，18-21点之间个运行一次
 
 * 7/3     初步完成领水滴 领肥料 浇水 四个打卡任务
 
 * ========= 青龙--配置文件 =========
 * 变量格式: export pdd_accesstoken="accesstoken@accesstoken"多个账号换行 或用 @ 分割
 *
 */

const $ = new Env("拼多多果园");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1 		//0为关闭通知,1为打开通知,默认为1
const debug = 0 		//0为关闭调试,1为打开调试,默认为0
///////////////////////////////////////////////////////////////////
let ckStr = process.env.pdd_accesstoken;
let msg = "";
let host = "mobile.yangkeduo.com";
let hostname = "https://" + host;
let ts = Math.round(new Date().getTime()).toString();

async function tips(ckArr) {

    console.log(`\n=============== 共找到 ${ckArr.length} 个账号 ===============`);
    msg += `\n =============== 共找到 ${ckArr.length} 个账号 ===============`
    debugLog(`【debug】 这是你的账号数组: \n ${ckArr} `);
}

!(async () => {
    let ckArr = await getCks(ckStr, "pdd_accesstoken");
    await tips(ckArr);
    for (let index = 0; index < ckArr.length; index++) {
        pdd_num = index + 1;
        console.log(`\n------------- 开始【第 ${pdd_num} 个账号】------------- `);
        msg += `\n------------- 开始【第 ${pdd_num} 个账号】------------- `
        ck = ckArr[index].split("&");
        debugLog(`【debug】 这是你第 ${pdd_num} 账号信息: ${ck} `);
        await start();
    }
    await SendMsg(msg);
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done());

async function start() {

        console.log("\n ==============领水滴==============");
        n = local_hours();
        if (n >= 7 && n <= 8) {
        await reward();
        await $.wait(6 * 1000);
        console.log("\n ============搜索得水滴============");
        await complete1();
        console.log("\n =============三餐领水滴=============");
        await complete();
        console.log("\n =============每日领水滴=============");
        await gain();
        await $.wait(6 * 1000);
        console.log("\n =============四日打卡=============");
        await activity();
        await $.wait(5 * 1000);
        } else {
        console.log("\n 时间不对 跳过！")
        msg += `\n 时间不对 跳过！`;
        } if (n >= 12 && n <= 14) {
        console.log("\n =============三餐领水滴==============");
        await complete();
        await $.wait(3 * 1000);
        } if (n >= 18 && n <= 21) {
        console.log("\n =============三餐领水滴=============");
        await complete();
        await $.wait(3 * 1000);
        }
        
        console.log("\n =============肥料打卡=============");
        await complete2();
        await $.wait(5 * 1000);
        
        console.log("\n =============收集养分=============");
        await complete3();
        await $.wait(5 * 1000);
        
        console.log("\n =============施肥=============");
        await goods();
        await $.wait(5 * 1000);
        
        console.log("\n =============领水=============");
        await sd();
        
        console.log("\n =============浇水=============");
        await cost1();
        await name();
        
    }
    
    
//浇水 慢
async function cost1() {
    let options = {
        method: 'POST',
        url: `${hostname}/proxy/api/api/manor/water/cost?`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"screen_token":"","atw":false,"location_auth":false,"mission_type":0,"can_trigger_random_mission":true,"is_high_nut_user":true,"fun_id":"xcx_home_page","product_scene":0,"tubetoken":"%2BD2uCKfmN3v4JC9cDIU92SzzsujD7UDuU5aHCIznmjZpD29nzZjUB%2BPiucypYP1JJ%2FJAKNOT7rkq%0ASMvAUFMDNhHY4bfJ2Oi6Jlso52BoimTG1%2FYsVsyf0oaJP8O7CvjdR71rcl1MXSHR1WSuIdub5xEi%0A1Nfj9EVToekJXVga37qoIhC0fkWDdecltQT%2FXtKF1qfzE9%2BV1gE3On%2FxbZ6lRBKkVyvfXQy8sujJ%0AssHNbGhmTmyyJLn6tpFxUSWhHU5C","fun_pl":7})
    };
    let result = await httpRequest(options, `浇水`);

    if (result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    } else if (result.error_code == 10109) {
        console.log(`\n 浇水：${result.error_msg}`);
        msg += `\n 浇水：${result.error_msg}`;
    } else if (result.product.status == 1) {
        console.log(`\n 当前浇水冷却${result.next_valid_water_time}\n 剩余水滴${result.now_water_amount}\n 剩余进度${result.product.progress_text}`);
        msg += `\n 当前浇水冷却${result.next_valid_water_time}\n 剩余水滴${result.now_water_amount}\n 剩余进度${result.product.progress_text}`;
        if (result.now_water_amount >= 200)
        console.log(`\n 剩余水滴过多 使用快速浇水`);
        await cost2();
        await $.wait(5 * 1000);
    }
}
//浇水 快
async function cost2() {
    let options = {
        method: 'POST',
        url: `${hostname}/proxy/api/api/manor/water/cost?`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"screen_token":"","atw":true,"location_auth":false,"mission_type":0,"merge_cost":true,"source":3,"cost_water_amount":200,"can_trigger_random_mission":true,"fun_id":"xcx_home_page","product_scene":0,"tubetoken":"WVq%2B8f%2FecZ3LXTvEF6vgcJgy547xwvA3K3EaroOzmnpgQfwa5jN9Q5vQEajPbWgwDC7LkPQahjOx%0A%2BJmKQVz7eqcF18jymHskkS9LVwTOWNBxZ0OZim6JX7NEymPGZrAICTfmC%2FnemHR8stqihfn398%2F%2F%0AYtBAz3qTGPu%2Fw8QyBG4HF%2FN1ijEUtwlTt%2FAH26t0uLwMrTpvsOpxq5Sn%2BFVz6KtyKFPN81ghnTE5%0AXK6YOmA%3D","fun_pl":7})
    };
    let result = await httpRequest(options, `浇水`);

    if(result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    } else if (result.error_code == 10109) {
        console.log(`\n 浇水：${result.error_msg}`);
        msg += `\n 浇水：${result.error_msg}`;
    } else if (result.product.status == 1) {
        console.log(`\n 当前浇水冷却${result.next_valid_water_time}\n 剩余水滴${result.now_water_amount}\n 剩余进度${result.product.progress_text}`);
        msg += `\n 当前浇水冷却${result.next_valid_water_time}\n 剩余水滴${result.now_water_amount}\n 剩余进度${result.product.progress_text}`;
        if (result.now_water_amount <= 20)
        console.log(` 水滴即将用完 恢复正常浇水`);
        msg += `\n 水滴即将用完 恢复正常浇水}`;
        await cost1();
        await $.wait(5 * 1000);
    }
}


//施肥
async function goods() {
    let options = {
        method: 'POST',
        url: `${hostname}/proxy/api/api/manor/use/backpack/goods`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"type":2,"source":53,"exchange_amount":1,"tubetoken":"%2BD2uCKfmN3v4JC9cDIU92QEvazkoIU9aLBhRsKUD93h%2BINgiq80yzJE0yBDXtEyqLz8aR6LmlWF9%0A5c1pWK994DHPY7e%2BpMNexSbvlwDvoruBjl%2Bs655k%2FwBtPiwn6Gu1yztlsmMtq6i%2FyYVRYkUl0J11%0Ab9c6%2B7%2BOuWhkw4n86M8X8I3a%2BJMsiEBmejW9D1dPwzru0DLh8LfAJ%2Fr%2Fv5qIFb0B%2FVQm3acMnXd3%0ABiIqRoZqLEjjrePYMcRSsqgtuwCE","fun_pl":7})
    };
    let result = await httpRequest(options, `施肥小`);

    if(result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    } else if (result.error_code == null) {
        console.log(`\n施肥小：成功 现在养分${result.health_degree}`);
        msg += `\n 施肥小：成功 现在养分${result.health_degree}`;
    } else if (result.error_code == 20002) {
        console.log(`\n施肥小：${result.error_msg}`);
        msg += `\n 施肥小：${result.error_msg}`;
    }
}

//收集养分
async function complete3() {
    let options = {
        method: 'POST',
        url: `${hostname}/proxy/api/api/manor/mission/complete`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"mission_type":37269,"tubetoken":"WVq%2B8f%2FecZ3LXTvEF6vgcJgy547xwvA3K3EaroOzmnpgQfwa5jN9Q5vQEajPbWgwDC7LkPQahjOx%0A%2BJmKQVz7eqcF18jymHskkS9LVwTOWNBxZ0OZim6JX7NEymPGZrAICTfmC%2FnemHR8stqihfn398%2F%2F%0AYtBAz3qTGPu%2Fw8QyBG4HF%2FN1ijEUtwlTt%2FAH26t0uLwMrTpvsOpxq5Sn%2BFVz6KtyKFPN81ghnTE5%0AXK6YOmA%3D","fun_pl":7})
    };
    let result = await httpRequest(options, `收集养分`);

    if(result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    } else if (result.result == true) {
        console.log(`\n收集养分：成功`);
        msg += `\n 收集养分：成功`;
    } else if (result.result == false) {
        console.log(`\n收集养分：已完成`);
        msg += `\n 收集养分：已完成`;
    }
}
    
//四日打卡
async function activity() {
    let options = {
        method: 'POST',
        url: `${hostname}/proxy/api/api/manor/common/apply/activity`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"type":18,"tubetoken":"WVq%2B8f%2FecZ3LXTvEF6vgcIEl7IhaIMHHfPdp2bnB02JgaZ65pZ5nIrwKnpGll2VDcRiJo7l8rrIi%0A0GDgHqMEisgrgQzpeWbQZD37IdkxEg4DPYoK%2B4LHcZiuUtj91SVU8fVSCTjpPIl9t%2FwndKq9F8bY%0AuaHGXDtU5aA7H3R1javFxEHtq3LDaOFJd39LYZ9tESOFxPZKkt8AclCFzi1srW9ZUW%2B%2FHqKg8ua0%0A3mpjGLE%3D","fun_pl":7})
    };
    let result = await httpRequest(options, `四日打卡`);

    if(result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    }  if (result.success == true) {
        console.log(`\n四日打卡：第${result.continuous_check_in_to_collect_water_vo.finished_count}天打卡成功`);
        msg += `\n 四日打卡：第${result.continuous_check_in_to_collect_water_vo.finished_count}天打卡成功`;
    }
}    
    
//肥料打卡
async function complete2() {
    let options = {
        method: 'POST',
        url: `${hostname}/proxy/api/api/manor/mission/complete`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"mission_type":36069,"tubetoken":"WVq%2B8f%2FecZ3LXTvEF6vgcJgy547xwvA3K3EaroOzmnpgQfwa5jN9Q5vQEajPbWgwDC7LkPQahjOx%0A%2BJmKQVz7eqcF18jymHskkS9LVwTOWNBxZ0OZim6JX7NEymPGZrAICTfmC%2FnemHR8stqihfn398%2F%2F%0AYtBAz3qTGPu%2Fw8QyBG4HF%2FN1ijEUtwlTt%2FAH26t0uLwMrTpvsOpxq5Sn%2BFVz6KtyKFPN81ghnTE5%0AXK6YOmA%3D","fun_pl":7})
    };
    let result = await httpRequest(options, `肥料打卡`);

    if(result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    } else if (result.result == null) {
        console.log(`\n第一次肥料打卡：打卡成功`);
        msg += `\n 第一次肥料打卡：打卡成功`;
    } else if (result.result == false) {
        console.log(`\n第一次肥料打卡：已完成`);
        msg += `\n 第一次肥料打卡：已完成`;
        await $.wait(5 * 1000);
        await complete4();
        
    }
}    

async function complete4() {
    let options = {
        method: 'POST',
        url: `${hostname}/proxy/api/api/manor/mission/complete`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"mission_type":36069,"gain_time":1,"no_reward":false,"tubetoken":"WVq%2B8f%2FecZ3LXTvEF6vgcIEl7IhaIMHHfPdp2bnB02JgaZ65pZ5nIrwKnpGll2VDcRiJo7l8rrIi%0A0GDgHqMEisgrgQzpeWbQZD37IdkxEg4DPYoK%2B4LHcZiuUtj91SVU8fVSCTjpPIl9t%2FwndKq9F8bY%0AuaHGXDtU5aA7H3R1javFxEHtq3LDaOFJd39LYZ9tESOFxPZKkt8AclCFzi1srW9ZUW%2B%2FHqKg8ua0%0A3mpjGLE%3D","fun_pl":7})
    };
    let result = await httpRequest(options, `肥料打卡`);

    if(result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    } else if (result.result == null) {
        console.log(`\n第二次肥料打卡：打卡成功`);
        msg += `\n 第二次肥料打卡：打卡成功`;
    } else if (result.result == false) {
        console.log(`\n第二次肥料打卡：已完成`);
        msg += `\n 第二次肥料打卡：已完成`;
    }
}
    
//每日领水
async function gain() {
    let options = {
        method: 'POST',
        url: `${hostname}/proxy/api/api/manor/mission/complete/gain?ts=${ts}`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"mission_type":36155,"gain_time":1,"no_reward":false,"tubetoken":"WVq%2B8f%2FecZ3LXTvEF6vgcJgy547xwvA3K3EaroOzmnpgQfwa5jN9Q5vQEajPbWgwDC7LkPQahjOx%0A%2BJmKQVz7eqcF18jymHskkS9LVwTOWNBxZ0OZim6JX7NEymPGZrAICTfmC%2FnemHR8stqihfn398%2F%2F%0AYtBAz3qTGPu%2Fw8QyBG4HF%2FN1ijEUtwlTt%2FAH26t0uLwMrTpvsOpxq5Sn%2BFVz6KtyKFPN81ghnTE5%0AXK6YOmA%3D","fun_pl":7})
    };
    let result = await httpRequest(options, `每日领水`);

    if(result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    } else if (result.result == null) {
        console.log(`\n每日领水滴：获得${result.gain_amount}滴水`);
        msg += `\n 每日领水滴：获得${result.gain_amount}滴水`;
    } else if (result.result == false) {
        console.log(`\n每日领水滴：今日已经领取过了`);
        msg += `\n 每日领水滴：今日已经领取过了`;
    }
}    
    

//搜索任务
async function complete1() {
    let options = {
        method: 'POST',
        url: `${hostname}/proxy/api/api/manor/mission/complete`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"page_sn":"10015","mission_type":36288,"screen_token":"0aqAfxndIihYY9EpkZggQo0pl5gdtd_j6uMMjnpP15ptg85TtPggVkH_8aaphBu5ALmaKj4aP0goHZPaP4Ej4KjeZT-LVq9v6wspnRhKLmRWuLD1uu1vNruD7jFukDc-kePbqaVwUFFhBewUw1GvfCeYjBvLoUjXvekf9LZCUmHvPq-ZyzSxJxyNtJ1b-sBEiktkwJaApMFXZhYGHjxdsG2zFgdFjsk9WfuOz4_Vpa1z7kOLWQqNJWWuID75-JVTV9UO-QDBGUTorhPPEbIEJuEISzBjicqUJNLIOt_FxicD6rv2RUepaf1gCl4wH2FHuU62qGtdaJ2VQW29glgRICnLPPMUpMc5b42gEGTX_2gRR0Ye9NmesM4K-qAbiSUvOlo6n0S6YYBowjTN0d07DeEK8hCtmHvp3vKvyGOveJteISvZjs5Ba1A2jDp5-Lk-29oBspKRG2hESCafG017soz5l-_bha_b9GzlqTirsds7RpKC4MseXaxY3jPHvzO3H9B8B48zIeKnWW9FGv7vfHYsJbusuhBGlcdUI_Wqm5UAgEZ-Ua48xHuBBR-t5HlilqH_dAVbAMILYkROWLKVrLL7ptFRTFnTUShpQ6clStAEY6ZgAWiqWE3bUYwRQ_any3nLQdUwNv28BKi1KL778biiAD0FLHaMTwRINm56EaNrTNM8kpYtwcu5FwhoRu0gp9KAsmS151_DSkQwGmdhdpGMO0WkrN29OD5KaQ5OHNL","use_anti_token":1,"fun_pl":7})
    };
    let result = await httpRequest(options, `搜索`);

    if(result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    } else if (result.result == true) {
        console.log(`\n搜索领水滴：获得${result.reward_amount}滴水`);
        msg += `\n 搜索领水滴：获得${result.reward_amount}滴水`;
        await $.wait(60 * 1000);
    }  else if (result.result == false) {
        console.log(`\n搜索领水滴：今日已经领取过了`);
        msg += `\n 搜索领水滴：今日已经领取过了`;
    }
}

//三餐
async function complete() {
    let options = {
        method: 'POST',
        url: `${hostname}/proxy/api/api/manor/mission/complete`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"mission_type":37265,"tubetoken":"WVq%2B8f%2FecZ3LXTvEF6vgcJgy547xwvA3K3EaroOzmnpgQfwa5jN9Q5vQEajPbWgwDC7LkPQahjOx%0A%2BJmKQVz7eqcF18jymHskkS9LVwTOWNBxZ0OZim6JX7NEymPGZrAICTfmC%2FnemHR8stqihfn398%2F%2F%0AYtBAz3qTGPu%2Fw8QyBG4HF%2FN1ijEUtwlTt%2FAH26t0uLwMrTpvsOpxq5Sn%2BFVz6KtyKFPN81ghnTE5%0AXK6YOmA%3D","fun_pl":7})
    };
    let result = await httpRequest(options, `三餐领水滴`);

    if(result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    } else if (result.result == true) {
        console.log(`\n三餐领水滴：获得${result.reward_amount}滴水`);
        msg += `\n 三餐领水滴：获得${result.reward_amount}滴水`;
    } else if (result.result == false) {
        console.log(`\n三餐领水滴：今日已经领取过了`);
        msg += `\n 三餐领水滴：今日已经领取过了`;
    }
}


//领水滴
async function reward() {
    let options = {
        method: 'POST',
        url: `${hostname}/proxy/api/api/manor/gain/accumulate/water/reward`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"tubetoken":"WVq%2B8f%2FecZ3LXTvEF6vgcJgy547xwvA3K3EaroOzmnpgQfwa5jN9Q5vQEajPbWgwDC7LkPQahjOx%0A%2BJmKQVz7eqcF18jymHskkS9LVwTOWNBxZ0OZim6JX7NEymPGZrAICTfmC%2FnemHR8stqihfn398%2F%2F%0AYtBAz3qTGPu%2Fw8QyBG4HF%2FN1ijEUtwlTt%2FAH26t0uLwMrTpvsOpxq5Sn%2BFVz6KtyKFPN81ghnTE5%0AXK6YOmA%3D","fun_pl":7})
    };
    let result = await httpRequest(options, `领水滴`);

    if(result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    } else if (result.accumulate_water_vo.status == 4) {
        console.log(`\n领水瓶水滴：获得${result.accumulate_water_vo.reward_amount}滴水`);
        msg += `\n 领水瓶水滴：获得${result.accumulate_water_vo.reward_amount}滴水`;
    } else if (result.accumulate_water_vo.status == 2) {
        console.log(`\n领水瓶水滴：今日已经领取过了`);
        msg += `\n 领水瓶水滴：今日已经领取过了`;
    }
}


//领水滴
async function sd() {
    let options = {
        method: 'POST',
        url: `https://mobile.yangkeduo.com/proxy/api/api/manor/common/water/gain`,
        headers: {
            Host: host,
            'accesstoken': `${ck[0]}`
        },
        body: JSON.stringify({"type":15,"mission_type":null,"params":{"15":40000},"tubetoken":"WVq%2B8f%2FecZ3LXTvEF6vgcIEl7IhaIMHHfPdp2bnB02JgaZ65pZ5nIrwKnpGll2VDcRiJo7l8rrIi%0A0GDgHqMEisgrgQzpeWbQZD37IdkxEg4DPYoK%2B4LHcZiuUtj91SVU8fVSCTjpPIl9t%2FwndKq9F8bY%0AuaHGXDtU5aA7H3R1javFxEHtq3LDaOFJd39LYZ9tESOFxPZKkt8AclCFzi1srW9ZUW%2B%2FHqKg8ua0%0A3mpjGLE%3D","fun_pl":7})
    };
    let result = await httpRequest(options, `领水滴`);

    if(result.error_code == 40001){
    console.log(`\n变量已失效`);
    msg += `\n 变量已失效`;
    } else if (result.status == 3) {
        console.log(`\n领水滴：暂时不可领取`);
        msg += `\n 领水滴：暂时不可领取`;
    } else if (result.status == 1) {
        console.log(`\n领水滴：领取成功`);
        msg += `\n 领水滴：领取成功`;
    } else {
    console.log(`\n任务失败 可能你没有此任务`);
        msg += `\n 任务失败 可能你没有此任务`;
    }
}

//用户名
async function name() {
    let options = {
        method: 'GET',
        url: `https://api.pinduoduo.com/user/profile/me`,
        headers: {
            Host: 'api.pinduoduo.com',
            'accesstoken': `${ck[0]}`
        },
    };
    let result = await httpRequest(options, `用户名`);

        console.log(`\n 用户：${result.nickname}`);
        msg += `\n 用户：${result.nickname}`;
    
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
