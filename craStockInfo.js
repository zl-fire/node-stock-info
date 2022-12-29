//=========爬取沪深京所有的个股信息===========



// http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=SH600965
// http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=SH688141
// http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=BJ831039
// http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=BJ430418
// http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=SZ002659
// http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=SZ300359


// 流程：
// 1. 先读取stocks.json文件
// 2. 循环每个股票，先取出要的字段，然后获取公司概况信息在取出要的字段，
// 3. 将最后的数据写入到jsonDB中保存

var axios = require("axios");
let { JsonDB, Config } = require('node-json-db')

async function getInfo() {
    // 爬取沪深京所有的个股数据
    let stocks = require("./data/stocks.json");
    // console.log(stocks)
    let diff = stocks.data.diff;
    // 删除老数据
    var db = new JsonDB(new Config("data/info", true, true, '/'));
    await db.delete("data/info");
    for (let i = 0; i < diff.length; i++) {
        let ele = diff[i];
        //获取股票代码
        let code = ele.f12;
        let codePar = "";
        if (/^60/.test(code)) codePar = "SH" + code;
        else if (/^68/.test(code)) codePar = "SH" + code;
        else if (/^4/.test(code)) codePar = "BJ" + code;
        else if (/^8/.test(code)) codePar = "BJ" + code;
        else if (/^00/.test(code)) codePar = "SZ" + code;
        else if (/^30/.test(code)) codePar = "SZ" + code;
        else codePar = code
        try {
            console.log((i + 1) + "/" + diff.length + ":", codePar)
            let res = await axios.get('http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=' + codePar);
            // 处理成功情况
            let info = res.data;
            var db = new JsonDB(new Config("data/info", true, true, '/'));
            let jbzl = info.jbzl[0];
            let fxxg = info.fxxg[0];

            let newInfo = {};
            for (let key in jbzl) {
                newInfo["JBZL_" + key] = jbzl[key]
            }
            for (let key in fxxg) {
                newInfo["FXXG_" + key] = fxxg[key]
            }
            db.push("/info[]", newInfo);
            console.log((codePar) + "成功")
        }
        catch (error) {
            // 处理错误情况
            console.log("error", error);
            console.log("codePar", codePar);
            let db = new JsonDB(new Config("data/error", true, true, '/'));
            db.push("/error[]", codePar)
        }
    }
}

module.exports = getInfo

// getInfo()
