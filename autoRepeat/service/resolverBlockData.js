//解析板块中下跌率排名前十的板块  和 板块涨幅前十的板块 ，并返回

async function resolverBlockData(blockData) {
    let cloneData1 = JSON.parse(JSON.stringify(blockData));
    let cloneData2 = JSON.parse(JSON.stringify(blockData));
    let cloneData3 = JSON.parse(JSON.stringify(blockData));
    // 解析按板块的涨停个股排序前十板块
    let ztc10 = blockData.map((ele) => ele.blockName);

    //解析板块中下跌率最小前十的板块
    cloneData1.sort(function (a, b) {
        return a.xdl.slice(0, -1) - b.xdl.slice(0, -1)
    })
    let xdl10 = cloneData1.map((ele) => ele.blockName);

    // 板块涨幅前十的板块
    cloneData2.sort(function (a, b) {
        return b.zdf - a.zdf
    })
    let zdf10 = cloneData2.map((ele) => ele.blockName);

    // 资金流入前十的板块
    cloneData3.sort(function (a, b) {
        return b.zjlr - a.zjlr
    })
    let zjlr10 = cloneData3.map((ele) => ele.blockName);

    // 计算4种排序的交集
    let jjArr = [];
    ztc10.slice(0, 10).forEach(ele => {
        if (
            xdl10.slice(0, 10).includes(ele)
            &&
            zdf10.slice(0, 10).includes(ele)
            &&
            zjlr10.slice(0, 10).includes(ele)

        ) jjArr.push(ele);
    })

    // 计算出今天包含热度上升趋势，但是涨停股较少的的板块
    let jjArr2 = [];
    xdl10.slice(0, 10).forEach(ele => {
        if (
            zdf10.slice(0, 10).includes(ele)
            &&
            zjlr10.slice(0, 10).includes(ele)

        ) jjArr2.push(ele);
    })

    return {
        blockResolve: [
            ["涨停池降序：", ...ztc10.slice(0, 10)],
            ["下跌率升序：", ...xdl10.slice(0, 10)],
            ["涨跌幅降序：", ...zdf10.slice(0, 10)],
            ["资金入流降序：", ...zjlr10.slice(0, 10)],

        ],
        hotBlock: ["可能的热门板块：", ...jjArr], //排列交集
        includePreHotBLOCK: ["包含预热的板块：", ...jjArr2]
    }
}

module.exports = resolverBlockData