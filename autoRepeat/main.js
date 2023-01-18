
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
            板块下跌率: ele.xdl,
            板块下跌比:ele.xdb,
            板块领涨股: ele.lzg,

        })
    })

    // 控制台显示表格
    console.log("=================================")
    console.log(date, "共有涨停股数量为:", tot)
    console.table(newArr)

}())
