
(async function () {
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
    console.log("\n【涨停股分布情况】" + date + "--共有涨停股数量为:", tot, "只，分布板块如下")
    console.table(newArr)

    // 解析板块数据，得到热门板块
    let resolverBlockData = require("./service/resolverBlockData");
    let { blockResolve, hotBlock } = await resolverBlockData(blockArr);

    // 预热板块（不含涨停)
    let getPreHot_noZT = require("./service/getPreHot_noZT");
    let { allRes, preJjArr } = await getPreHot_noZT();


    console.log("\n\n【具有涨停股板块_前10分析】:");
    console.table(blockResolve)

    console.log("\n【所有板块_前10分析】:");
    console.table(allRes);

    // 热门板块
    console.log("\n\n【热门板块】:", hotBlock.slice(1));


    let blockNameArr = blockArr.map(ele => ele.blockName);// 得到涨停的所有板块名
    let noReapetBlockName = preJjArr.filter(ele => !blockNameArr.includes(ele));
    console.log("\n【预热板块】:", noReapetBlockName);

    // 计算推荐龙头股 和 一进二打板股
    let resolveLtgDbg = require("./service/resolveLtgDbg");
    // let { tjLTG, daBan } = await resolveLtgDbg(blockArr, hotBlock, preHot);
    let { tjLTG, daBan } = await resolveLtgDbg(blockArr, hotBlock);

    console.log("\n\n【操作关注】")

    console.log(`\n  1. 关注热门板块龙头股如下:\n`);
    tjLTG = tjLTG.filter(ele => blockNameCodeArr[ele] ? true : false);
    tjLTG.forEach((ele, i) => {
        let orderNum = (i + 1) < 10 ? "0" + (i + 1) : i + 1; //得到序号
        console.log("\t", "[" + orderNum + "]", blockNameCodeArr[ele], ele)
    })


    console.log("\n  2. 关注打板票如下:\n");
    daBan.forEach((ele, i) => {
        let orderNum = (i + 1) < 10 ? "0" + (i + 1) : i + 1; //得到序号
        console.log("\t", "[" + orderNum + "]", blockNameCodeArr[ele], ele)
    })
    console.log("\n");
}())
