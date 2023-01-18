

/**
 * 实现流程
 * 1. 先获取所有的A60-00票
 * 2. 遍历每一个票，获取当前票的最近3个月的成交量
 */

let { JsonDB, Config } = require('node-json-db')

async function getCjlPrice65() {
    // 获取所有的a00,a60的股票的三月内的成交量
    let nameArr = [
        "A60_A00_Info_2022_12_29_17_35_11.json",
        "A60_A00_Info_2022_12_29_18_56_36.json",
        "A60_A00_Info_2022_12_29_19_58_17.json"
    ];

    let date = new Date().toLocaleString().replace(/\//g, "_").replace(/:/g, "_").replace(/\s/g, "_");// 爬取时间
    let tot = 0;
    for (let i = 0; i < nameArr.length; i++) {
        let nameStr = nameArr[i];
        console.log("==路径===", "./data/cjl/" + nameStr)
        let stocks = require("./data/cjl/" + nameStr);
        let A60_A00_Info = stocks.A60_A00_Info;
        tot += A60_A00_Info.length
        for (let i = 0; i < A60_A00_Info.length; i++) {
            let ele = A60_A00_Info[i];
            let { code, name, klines } = ele
            let klines65 = klines.slice(-65); //获取最近3个月的成交量
            let cjl65 = klines65.map(ele => {
                return ele.split(",")[5];// 返回成交量
            })
            let price65 = klines65.map(ele => {
                return ele.split(",")[2];// 返回价格
            })
            let increase65 = klines65.map(ele => {
                return ele.split(",")[8];// 返回涨幅
            })
            // 先保存下成交量65，price65，方便下次快速的读取
            var db = new JsonDB(new Config("./data/cjl/cjl_price_increase_65_" + date, true, true, '/'));
            await db.push("/cjl_price_increase_65[]", {
                code, name, cjl65, price65, increase65
            });
            console.log((i + 1) + "/" + A60_A00_Info.length, ",", name, code);
        }
    }

    console.log("==结束:共" + tot + "条==")
}

module.exports = getCjlPrice65

getCjlPrice65();