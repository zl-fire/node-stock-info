//============== 计算获取最终需要的的股票（成交量长期低迷横盘，忽然有翻倍异动）================

/**
* 流程：
* 1. 开始计算最近两个月40天内的成交量，如果40天内的成交量是其他所有天数的3倍以上，n就+1，如果n>=41， 保存这个股票
* 【后面把价格波动考虑进去】
* 2. 计算完成后，将所有的股票id，名字，打印出来，同时统计总数
*/

// 从新获取错误的股票信息

let { JsonDB, Config } = require('node-json-db')
async function getNeededStocks() {
    let data = require("./data/cjl/cjl_price_increase_65_2023_1_1_18_37_38.json");
    let cjl_price_increase_65Arr = data.cjl_price_increase_65;
    let m = 0;//符合要求的股票总数
    let date = new Date().toLocaleString().replace(/\//g, "_").replace(/:/g, "_").replace(/\s/g, "_");// 爬取时间
    for (let i = 0; i < cjl_price_increase_65Arr.length; i++) {
        let cjl_price_increase_65 = cjl_price_increase_65Arr[i];
        // 开始计算成交量问题
        let { name, code, cjl65, price65, increase65 } = cjl_price_increase_65;
        let cjl44 = cjl65.slice(-44);
        let price44 = price65.slice(-44);
        let increase44 = increase65.slice(-44);

        // 获取成交量和价格的最大值与最小值
        let cljMax = Math.max(...cjl44)
        let cjlMin = Math.min(...cjl44)
        let priceMax = Math.max(...price44)
        let priceMin = Math.min(...price44)
        // let increaseMax = Math.max(...increase44)
        // let increaseMin = Math.min(...increase44)



        let flag1 = false; //是否最近三天，第一天下降，后面两天连续上涨，且涨幅都小于3%，
        let flag2 = false; //是否最大价格和最小价格在10%差距以内
        let flag3 = false; //是否每两天之间价格跌涨幅要在1.5%以内的有至少3/4的天数
        let flag4 = false; //是否最大成交量和最小成交量间，倍数差距要小于3倍，或者4倍

        // 条件一
        if (increase44[increase44.length - 3] < 0) {
            if (increase44[increase44.length - 2] > 0 && increase44[increase44.length - 2] < 3) {
                if (increase44[increase44.length - 1] > 0 && increase44[increase44.length - 1] < 3) {
                    flag1 = true;
                }
            }
        }


        // 条件二
        // let lowPrice = price44[0] >= price44[price44.length - 1] ? price44[price44.length - 1] : price44[0]
        // let higPrice = price44[0] >= price44[price44.length - 1] ? price44[0] : price44[price44.length - 1]
        // if ((higPrice - lowPrice) <= lowPrice * 0.1) {
        if ((priceMax - priceMin) <= priceMin * 0.1) {
            flag2 = true;
        }



        // 条件三
        let n = 0;//计算此股票两个月内符合标准的天数
        for (let j = 1; j < increase44.length; j++) {
            if (Math.abs(increase44[j]) - Math.abs(increase44[j - 1]) < 1.5) n++;
        }
        if (n >= increase44.length * 0.75) flag3 = true;




        // 条件四
        if (cljMax % cjlMin < 4) flag4 = true;


        if (
            flag1 &&
            // flag2 &&
            // flag3 &&
            flag4 &&
            !/^ST/.test(name) &&
            !/^S/.test(name) &&
            !/^\*ST/.test(name) &&
            !/退$/.test(name) &&
            !/^退市/.test(name)
        ) {
            var db = new JsonDB(new Config("./data/cjl/neededStock_" + date, true, true, '/'));
            await db.push("/neededStock[]", {
                name, code
            });
            m++;
            console.log(name + "(" + code + ")");
        }
    }
    console.log("共有符合策略要求的股票数量为:" + m);
}

module.exports = getNeededStocks;

getNeededStocks();