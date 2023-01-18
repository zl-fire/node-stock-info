// 计算预热板块（不包含涨停）
//解析板块各种前十，然后求交集

async function getPreHot_noZT() {
    // 获取原始的板块数据
    let getBlockInfo = require("../../base/getBlockInfo");
    let { blockTot, diff } = await getBlockInfo();

    // 得到原始涨幅榜前10
    let cloneData1 = JSON.parse(JSON.stringify(diff));
    cloneData1.sort(function (a, b) {
        return b.f3 - a.f3
    })
    let zdf10 = cloneData1.map((ele) => ele.f14);

    // 得到原始下跌率升序前10
    let cloneData2 = JSON.parse(JSON.stringify(diff));
    cloneData2.sort(function (a, b) {
        let ax = a.f105 / (a.f104 + a.f105)
        let bx = b.f105 / (b.f104 + b.f105)
        return ax - bx
    })
    let xdl10 = cloneData2.map((ele) => ele.f14);

    // 得到原始资金入流降序前10
    let getMoneyInto = require("../../base/getMoneyInto");// 获取板块资金流入情况
    let { moneyIntoTot, moneyIntoDiff } = await getMoneyInto();
    // f14:板块名， f62: 资金流入金额（单位：元，需要除以 100000000，转换为以亿为单位）
    moneyIntoDiff.sort(function (a, b) {
        return b.f62 - a.f62
    })
    let lrzj10 = moneyIntoDiff.map((ele) => ele.f14);

    // 计算其交集
    let preJjArr = [];
    zdf10.slice(0, 10).forEach(ele => {
        if (
            xdl10.slice(0, 10).includes(ele)
            &&
            lrzj10.slice(0, 10).includes(ele)

        ) preJjArr.push(ele);
    })

    // 后面把异动板块(涨跌幅_降序_含有未涨停)前5，做补集并入
    preJjArr.unshift(...zdf10.slice(0, 5));
    preJjArr = [...new Set(preJjArr)]; //去重
    preJjArr=preJjArr.map(ele=>ele.slice(0,4));//截取板块名的前4个字

    // 构建返回结果
    let allRes = [
        ["涨跌幅_降序:", ...zdf10.slice(0, 10)],
        ["下跌率_升序:", ...xdl10.slice(0, 10)],
        ["资金流入_降序:", ...lrzj10.slice(0, 10)]
    ]
    return {
        allRes, preJjArr
    }
}

module.exports = getPreHot_noZT
// getPreHot_noZT()