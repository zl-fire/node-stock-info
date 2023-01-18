// 从新获取错误的股票信息

const fetch = require('node-fetch');
let { JsonDB, Config } = require('node-json-db')
async function getErrorStocks() {
    let stockCodes = require("./data/cjl/A60_A00_Info_error_2022_12_29_18_56_36.json");
    let errorArr = stockCodes.error;
    let date = new Date().toLocaleString().replace(/\//g, "_").replace(/:/g, "_").replace(/\s/g, "_");// 爬取时间
    for (let i = 0; i < errorArr.length; i++) {
        let codePar = errorArr[i]
        try {
            console.log((i + 1) + "/" + errorArr.length + ":", codePar)
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
            await db.push("/error[]", codePar)
        }
    }

}
module.exports = getErrorStocks;

getErrorStocks();