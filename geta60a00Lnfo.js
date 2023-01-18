// =========获取所有A股的k线数据（目前只获取00或60开始，既主板的票）===========

//  深圳的票，股票代码是以00或30开始的，id是以0.开始】
//  上海的票，股票代码是以68或60开始的，id是以1.开始】
//  北京的票，股票代码是以83或43开始的，id是以0.开始】（url还有点不一样）

// 目前我这里主要获取的是00和60的票的成交量（除了主板外，其他的票暂时无法交易）
// 002820: http://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&beg=0&end=20500101&ut=fa5fd1943c7b386f172d6893dbfba10b&rtntype=6&secid=0.002820&klt=101&fqt=1&cb=jsonp1672300934214
// 603933: http://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&beg=0&end=20500101&ut=fa5fd1943c7b386f172d6893dbfba10b&rtntype=6&secid=1.603933&klt=101&fqt=1&cb=jsonp1672301896003
// ===============================================




// 上证

// 002820

// http://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&beg=0&end=20500101&ut=fa5fd1943c7b386f172d6893dbfba10b
// &rtntype=6&secid=0.002820&klt=101&fqt=1&cb=jsonp1672300934214


// 300452
// http://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&beg=0&end=20500101&ut=fa5fd1943c7b386f172d6893dbfba10b
// &rtntype=6&secid=0.300452&klt=101&fqt=1&cb=jsonp1672302291549


// 深证

// 688248

// http://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&beg=0&end=20500101&ut=fa5fd1943c7b386f172d6893dbfba10b
// &rtntype=6&secid=1.688248&klt=101&fqt=1&cb=jsonp1672051914952


// 603933

// http://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&beg=0&end=20500101&ut=fa5fd1943c7b386f172d6893dbfba10b
// &rtntype=6&secid=1.603933&klt=101&fqt=1&cb=jsonp1672301896003


// 北证

// 834415
// http://82.push2his.eastmoney.com/api/qt/stock/kline/get?cb=jQuery35109135894876741621_1672302224572
// &secid=0.834415&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61&klt=101&fqt=1&beg=0&end=20500101&smplmt=460&lmt=1000000&_=1672302224595


// 430510
// http://54.push2his.eastmoney.com/api/qt/stock/kline/get?cb=jQuery3510284211538258339_1672302399813
// &secid=0.430510&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61&klt=101&fqt=1&beg=0&end=20500101&smplmt=460&lmt=1000000&_=1672302399819


/**
 * 实现流程：
 * 1. 先读取所有的股票json信息，然后过滤出60和00开始的
 * 2. 对00和60的票依次请求，获取到成交量信息保存
 */

const fetch = require('node-fetch');
let { JsonDB, Config } = require('node-json-db')

async function getA60_A00_Info() {
    // 爬取沪深京所有的个股数据
    let stocks = require("./data/stocks.json");
    // console.log(stocks)
    let diff = stocks.data.diff;

    //计算出所有60和00的票的个数
    let tot60_00_Num = 0;
    for (let i = 0; i < diff.length; i++) {
        let ele = diff[i];
        //获取股票代码
        let code = ele.f12;
        if (/^60/.test(code)) tot60_00_Num++;
        else if (/^00/.test(code)) tot60_00_Num++;
    }
    console.log("\n60和00开头的票共有:" + tot60_00_Num + "个");

    // 开始爬取数据
    let m = 0; //表示当前取的第几个60/00票
    let date = new Date().toLocaleString().replace(/\//g, "_").replace(/:/g, "_").replace(/\s/g, "_");// 爬取时间
    for (let i = 0; i < diff.length; i++) {
        let ele = diff[i];
        //获取股票代码
        let code = ele.f12;
        if (!/^60/.test(code) && !/^00/.test(code)) continue;
        else m++;

        // 如果存储超过了1000个股票数据，就分文件进行存储
        if (m % 1000 == 0) {
            date = new Date().toLocaleString().replace(/\//g, "_").replace(/:/g, "_").replace(/\s/g, "_");// 爬取时间
        }

        // // 后面要注释掉这个代码
        // if (m < 1957) continue;
        // date = '2022_12_29_17_35_11';


        let codePar = "";
        if (/^60/.test(code)) codePar = "1." + code;
        else if (/^00/.test(code)) codePar = "0." + code;
        else codePar = code
        try {
            console.log(m + "/" + tot60_00_Num + ":", codePar)
            let res = await fetch('http://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&beg=0&end=20500101&ut=fa5fd1943c7b386f172d6893dbfba10b&rtntype=6&secid=' + codePar + '&klt=101&fqt=1&cb=jsonp1672300934214')
            let text = await res.text();
            let jsonText = text.replace(/^jsonp\d+\(/, "").replace(/\);$/, "")
            let obj = JSON.parse(jsonText)
            let newInfo = {
                code: obj.data.code,
                name: obj.data.name,
                klines: obj.data.klines
            }
            var db = new JsonDB(new Config("data/cjl/A60_A00_Info_" + date, true, true, '/'));
            await db.push("/A60_A00_Info[]", newInfo);
            console.log((codePar) + "成功")
        }
        catch (error) {
            // 处理错误情况
            console.log("error", error);
            console.log("codePar", codePar);
            let db = new JsonDB(new Config("data/cjl/A60_A00_Info_error_" + date, true, true, '/'));
            await  db.push("/error[]", codePar)
        }
    }
}

module.exports = getA60_A00_Info;

getA60_A00_Info()