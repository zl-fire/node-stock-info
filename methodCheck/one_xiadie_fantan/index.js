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

// 回测函数
async function huiC() {
    // /Users/lu/Desktop/stocksInfo/data/one_xiadie_fantan/all_history_data2023_1_10_21_51_23.json
    let nameArr = [
        "all_history_data_2023_1_10_23_53_43.json",
        "all_history_data_2023_1_10_23_59_37.json",
        "all_history_data_2023_1_11_00_05_50.json",
        "all_history_data_2023_1_11_00_11_54.json",
        "all_history_data_2023_1_11_00_13_03.json",
        "all_history_data_2023_1_11_00_19_32.json",
        "all_history_data_2023_1_11_00_25_06.json",
        "all_history_data_2023_1_11_00_28_21.json"
    ];

    let date = new Date().toLocaleString().replace(/\//g, "_").replace(/:/g, "_").replace(/\s/g, "_");// 爬取时间
    let yinLiStockNumber = 0; //盈利票的数量
    let zeroStockNumber = 0; //不输不赢的票
    let kuiSunStockNumber = 0; //亏损的票
    let huiCStockArr = []; //盈利票的具体盈利多少记录
    let z = 0;//统计已经执行的总数
    for (let i = 0; i < nameArr.length; i++) {
        let nameStr = nameArr[i];
        console.log("==路径===", "../data/one_xiadie_fantan/" + nameStr)
        let increaseObj = require(path.resolve(".", "data/one_xiadie_fantan/", nameStr));
        let increaseAllData = increaseObj.increaseAll;
        for (let i = 0; i < increaseAllData.length; i++) {
            z++;
            let stock = increaseAllData[i];
            let { name, code, increaseAll, dateAll } = stock;
            // 创建一个新的对象记录当前票的信息
            let currentStock = { name, code, shouYiV: 0, shouYiVArr: [] }

            let incrTot = 0;//累加的连续涨跌幅值
            let shouYiV = 0;//此模式下的最终收益值
            for (let j = 0; j < increaseAll.length - 1; j++) {
                let currentInc = Number(increaseAll[j]);
                let nextInc = Number(increaseAll[j + 1]);
                // 如果当天不下跌，且前面不是连续下跌，就跳过（通过累加的连续涨跌幅值是否为0判断）
                // 如果是连续下跌，就表示连续下跌的趋势已经止住，这时，
                // 如果连续下跌的总值超过了10个点，则将后一天的值计入到盈利里面去，否则跳过，重新计算
                if (currentInc >= 0) {
                    if (incrTot == 0) continue;//上一天没有下跌
                    if (incrTot < 0 && incrTot > -10) { incrTot = 0; continue; } //连续下跌没有超过10个点,且已经反弹
                    if (incrTot < -10) {
                        shouYiV += nextInc; //买入连续下跌超过10个点的第二天反弹
                        j++;
                        incrTot = 0;
                        currentStock.shouYiVArr.push({ [dateAll[j + 1]]: nextInc })
                    }
                }
                // 如果当天下跌，直接在incrTot上累加
                else {
                    incrTot += currentInc;
                }
            }
            // 当前票计算完成，将收益值写入文件，同时记录盈利票的总数
            currentStock.shouYiV = shouYiV;
            var db = new JsonDB(new Config(path.resolve(".", "data/one_xiadie_fantan/tong_ji/inc_record_" + date), true, true, '/'));
            await db.push("/shouYiArr[]", currentStock); //将收益写入文件
            console.log(z, ":", name, code, shouYiV)
            // 统计
            huiCStockArr.push(shouYiV);
            if (shouYiV > 0) yinLiStockNumber += 1;
            else if (shouYiV == 0) zeroStockNumber += 1;
            else kuiSunStockNumber += 1;
        }
    }

    console.log("==结束==")
    console.log("==回测股票总数:", huiCStockArr.length)
    console.log("==盈利票数量:", yinLiStockNumber)
    console.log("==亏损票数量:", kuiSunStockNumber)
    console.log("==不亏不赢票数量:", zeroStockNumber)
    console.log("====================================")
    console.log("==最高盈利:", Math.max(...huiCStockArr))
    console.log("==最低盈利:", Math.min(...huiCStockArr.filter(ele => ele > 0)))
    console.log("==最大亏损:", Math.min(...huiCStockArr))
}

module.exports = huiC

huiC();