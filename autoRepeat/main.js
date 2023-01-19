/**
 * 
 * @param {number} showLog true:显示日志，false：不显示日志
 */
async function autoRepeat(showLog=true) {
    if(!showLog) {
      console.log=function(){}
    }
    //获取涨停数据
    let getTopicZTPool = require("../base/getTopicZTPool");
    let ztData = await getTopicZTPool();//"20230117"


    //解析涨停数据
    let resolveZTstock = require("./service/resolveZTstock");
    let { tot, blockArr, date } = await resolveZTstock(ztData);

    // 得到涨停的所有板块名
    let blockNameCodeArr = ztData.poll.reduce((blockNameCodeArr, ele) => {
        blockNameCodeArr[ele.n] = ele.c;
        return blockNameCodeArr
    }, {});

    let newArr = [];
    blockArr.forEach(ele => {
        newArr.push({
            板块名: ele.blockName,
            板块涨幅: ele.zdf,
            资金流入: ele.zjlr + "亿",
            板块下跌率: ele.xdl,
            板块下跌比: ele.xdb,
            涨停股数量: ele.ztNum,
            最大连板数: ele.maxLBN,
            连板数集合: ele.lbnArr.toString(),
            涨停股集合: ele.stockArr.toString(),
            板块领涨股: ele.lzg,

        })
    })

    // 控制台显示表格
    console.log("\n=============", new Date().toLocaleString(), "=============")
    console.log("\n【涨停股分布情况】" + date + "--共有涨停股数量为:", tot, "只,分布板块如下")
    console.table(newArr)

    // 解析板块数据,得到热门板块
    let resolverBlockData = require("./service/resolverBlockData");
    let { blockResolve, hotBlock } = await resolverBlockData(blockArr);

    // 预热板块(不含涨停)
    let getPreHot_noZT = require("./service/getPreHot_noZT");
    let { allRes, preJjArr, allBlockInfo } = await getPreHot_noZT();


    console.log("\n\n【具有涨停股板块_前10分析】:");
    console.table(blockResolve)

    console.log("\n【所有板块_前10分析】:");
    console.table(allRes);

    // 热门板块
    console.log("\n\n【热门板块】:\n\n", hotBlock.slice(1));


    let blockNameArr = blockArr.map(ele => ele.blockName);// 得到涨停的所有板块名
    let noReapetBlockName = preJjArr.filter(ele => !blockNameArr.includes(ele));
    console.log("\n\n【预热板块】:", noReapetBlockName);
    // 打印预热板块中各项数据指标
    let preHotBlockDetail = noReapetBlockName.map(ele => {
        return {
            板块名: allBlockInfo[ele].blocName,
            涨跌幅: allBlockInfo[ele].zdf,
            资金流入: allBlockInfo[ele].lrzj,
            下跌率: allBlockInfo[ele].xdl,
        }
    })
    console.table(preHotBlockDetail)



    // 计算推荐龙头股 和 一进二打板股
    let resolveLtgDbg = require("./service/resolveLtgDbg");
    // let { tjLTG, daBan } = await resolveLtgDbg(blockArr, hotBlock, preHot);
    let { tjLTG, daBan } = await resolveLtgDbg(blockArr, hotBlock);

    console.log("\n\n【建议关注】")

    console.log(`\n  1. 关注热门板块龙头股如下:\n`);
    tjLTG = tjLTG.filter(ele => blockNameCodeArr[ele] ? true : false);
    tjLTG.forEach((ele, i) => {
        let orderNum = (i + 1) < 10 ? "0" + (i + 1) : i + 1; //得到序号
        console.log("\t", "[" + orderNum + "]", blockNameCodeArr[ele], ele)
    })


    console.log("\n  2. 关注一进二打板票如下:\n");
    daBan.forEach((ele, i) => {
        let orderNum = (i + 1) < 10 ? "0" + (i + 1) : i + 1; //得到序号
        console.log("\t", "[" + orderNum + "]", blockNameCodeArr[ele], ele)
    })

    console.log("\n\n【建议操作】")
    console.log(`\n  1.不买计划外的票,哪怕它再好,管住自己的手!`);
    console.log(`\n  2.对于昨日已经买入的龙头票或者一进二打板票,我都是有高预期的,所以:`);
    console.log(`\n  \ta. 开盘时,如果低于5个点,就直接市价卖出。 `);
    console.log(`\n  \tb. 开盘时,如果高于5个点的,就挂低两个点的条件单市价卖出。 `);
    console.log(`\n  \tc. 尾盘2:50时,条件单未触发的票,如果没涨停就直接卖出。 `);
    console.log(`\n  3.对于今天计划买入的龙头票,我也是有高预期的,所以:`);
    console.log(`\n  \ta. 开盘时,如果高于5个点,就直接挂高0.1个点的条件单市价买入`);
    console.log(`\n  \tb. 开盘时,如果低于5个点,但是红了的,就挂达到9个点的条件单市价买入`);
    console.log(`\n  \tc. 开盘时,如果在水下,直接忽略 `);
    console.log(`\n  4.对于今天计划买入的一进二打板票,操作建议:`);
    console.log(`\n  \ta. 早盘竞价结束,时间来的急的情况下,委托9个点的条件单市价买入(最多委托两个就行)`);
    console.log(`\n  \tb. 开盘后,盘中也观察是否有涨势较好的一进二票,可挂条件单市价买入`);
    console.log(`\n  5.对于计划多个交易日持有的反弹票/首版票,操作建议:`);
    console.log(`\n  \ta. 开盘后,和预期相差不大的情况下,设置开盘价低两个点条件单市价卖出`);
    console.log(`\n  \tb. 下午2:00,从自选分组、过去票、热点板块票中寻找合适的票)`);
    console.log(`\n  \tc. 下午2:40,开始卖出不符合预期或达到已认为高度的票`);
    console.log(`\n  \td. 下午2:45,开始买入认为合适的票`);
    console.log("\n\n")


    // 文件持久换 存入json文件中，以日期为键，统计结果为值
    let { JsonDB, Config } = require('node-json-db')
    let db = new JsonDB(new Config("autoRepeat/data/historicalAnalysisResults", true, true, '/'));
    await db.push("/" + date, {
        涨停股分布情况: newArr,
        具有涨停股板块_前10分析: blockResolve,
        所有板块_前10分析: allRes,
        热门板块: hotBlock.slice(1),
        预热板块: noReapetBlockName,
        预热版块详情: preHotBlockDetail,
        股票与代码映射关系: blockNameCodeArr,
        建议关注_热门板块龙头股: tjLTG,
        建议关注_一进二打板股: daBan
    })

    console.log("======分析结果已经成功保存到文件中=====\n\n");

}

module.exports = autoRepeat
