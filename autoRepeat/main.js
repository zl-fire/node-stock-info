
(async function () {
    //获取涨停数据
    let getTopicZTPool = require("../base/getTopicZTPool");
    let ztData = await getTopicZTPool();

    //解析涨停数据
    let resolveZTstock = require("./service/resolveZTstock");
    let { tot, blockArr, date } = await resolveZTstock(ztData);

    let newArr = [];
    blockArr.forEach(ele => {
        newArr.push({
            板块名: ele.blockName,
            涨停股数量: ele.ztNum,
            最大连板数: ele.maxLBN,
            连板数集合: ele.lbnArr.toString(),
            涨停股集合: ele.stockArr.toString(),
            板块涨幅: ele.zdf,
            资金流入: ele.zjlr + "亿",
            板块下跌率: ele.xdl,
            板块下跌比: ele.xdb,
            板块领涨股: ele.lzg,

        })
    })

    // 控制台显示表格
    console.log("\n=============", new Date().toLocaleString(), "=============")
    console.log("\n【涨停股池分析】共有涨停股数量为:", tot, "分布如下")
    console.table(newArr)

    // 解析板块数据，预测热门板块
    let resolverBlockData = require("./service/resolverBlockData");
    let { blockResolve, hotBlock, includePreHotBLOCK } = await resolverBlockData(blockArr);
    console.log("\n\n【含涨停板块分析]:");
    console.table(blockResolve)

    // 热门板块预测
    console.log("\n\n【热门板块预测]:", hotBlock.slice(1));
    // 预热板块预测（含涨停)
    let preHot=includePreHotBLOCK.slice(1).filter(ele => !hotBlock.includes(ele));
    console.log("\n【预热板块预测_含涨停】:",preHot );


    // 计算推荐龙头股 和 一进二打板股
    let resolveLtgDbg = require("./service/resolveLtgDbg");
    let { tjLTG, daBan } = await resolveLtgDbg(blockArr, hotBlock,preHot);

    console.log("\n\n【操作建议】")
    console.log(
        "\n  1. 关注热门板块龙头股:", tjLTG,
        "操作方式为:放入龙头股分组，第二天竞价完成后，如果高开(涨幅大于+5%)直接委托买入.其他:8.5%时打板买入",
    );

    console.log("\n  2. 关注打板票如下，操作方式为:放入热门板块打板分组,第二天竞价开盘后，8.5%时打板买入(这些打板票包含:热门板块的一板，预热板块的一板或非一板）:\n");
    daBan.forEach(ele=>console.log("\t",ele))
    console.log("\n");
}())
