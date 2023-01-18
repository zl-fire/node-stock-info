/**
 * 策略说明
 *   主要对那些连续下跌超过了10个点的票，在飘红后的第一天买入，第二天套利走人
 * 
 * 程序验证：
 *    
 *     1. 先取出每个票的历史跌涨幅，单独形成一个文件（为了后面运算加快速度）
 *     2. 读取文件中的每个票数据进行回测计算
 */


let { JsonDB, Config } = require('node-json-db')
let path = require("path");

async function getAllHistoryData() {
    let nameArr = [
        "A60_A00_Info_2022_12_29_17_35_11.json",
        "A60_A00_Info_2022_12_29_18_56_36.json",
        "A60_A00_Info_2022_12_29_19_58_17.json"
    ];

    let date = new Date().toLocaleString().replace(/\//g, "_").replace(/:/g, "_").replace(/\s/g, "_");// 爬取时间
    let tot = 0;
    for (let i = 0; i < nameArr.length; i++) {
        let nameStr = nameArr[i];
        console.log("==路径===", "../data/cjl/" + nameStr)
        let stocks = require(path.resolve(".", "data/cjl/", nameStr));
        let A60_A00_Info = stocks.A60_A00_Info;
        tot += A60_A00_Info.length
        for (let i = 0; i < A60_A00_Info.length; i++) {
            if (i % 500 == 0) date = new Date().toLocaleString().replace(/\//g, "_").replace(/:/g, "_").replace(/\s/g, "_");// 爬取时间
            let ele = A60_A00_Info[i];
            let { code, name, klines } = ele;
            //  获取所有的日期
            let dateAll = klines.map(ele => {
                return ele.split(",")[0];// 返回日期
            })
            //  获取所有的涨跌幅历史数据
            let increaseAll = klines.map(ele => {
                return ele.split(",")[8];// 返回涨幅
            })
            // 先保存下,方便下次快速的读取
            var db = new JsonDB(new Config("./data/one_xiadie_fantan/all_history_data_" + date, true, true, '/'));
            await db.push("/increaseAll[]", {
                code, name, increaseAll, dateAll
            });
            console.log((i + 1) + "/" + A60_A00_Info.length, ",", name, code);
        }
    }

    console.log("==结束:共" + tot + "条==")
}

module.exports = getAllHistoryData

getAllHistoryData();