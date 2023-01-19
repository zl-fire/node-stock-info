// 计算预热板块（不包含涨停）
//解析板块各种前十，然后求交集

async function getPreHot_noZT() {
    // 获取原始的板块数据
    let getBlockInfo = require("../../base/getBlockInfo");
    let { blockTot, diff } = await getBlockInfo();

    // 为了后面把预热板块的各项指标(涨跌幅，下跌率，资金流入)打印出来，所以这里需要做个所有板块所有指标的统计，后面好从中取出
    let allBlockInfo = {}

    // 得到原始涨幅榜前10
    let cloneData1 = JSON.parse(JSON.stringify(diff));
    cloneData1.sort(function (a, b) {
        return b.f3 - a.f3
    })
    let zdf10 = cloneData1.map((ele) => ele.f14);
    // 记录所有板的涨跌幅
    cloneData1.forEach(ele => {
        let blocName = ele.f14.slice(0, 4);
        if (!allBlockInfo[blocName]) {
            allBlockInfo[blocName] = { blocName }
        }
        allBlockInfo[blocName].zdf = ele.f3;
    })

    // 得到原始下跌率升序前10
    let cloneData2 = JSON.parse(JSON.stringify(diff));
    cloneData2.sort(function (a, b) {
        let ax = a.f105 / (a.f104 + a.f105)
        let bx = b.f105 / (b.f104 + b.f105)
        return ax - bx
    })
    let xdl10 = cloneData2.map((ele) => ele.f14);
    // 记录所有板的下跌率
    cloneData2.forEach(ele => {
        let blocName = ele.f14.slice(0, 4);
        allBlockInfo[blocName].xdl = (ele.f105 / (ele.f104 + ele.f105) * 100).toFixed(2) + `% (${ele.f105}/${ele.f104 + ele.f105})`
    })

    // 得到原始资金入流降序前10
    let getMoneyInto = require("../../base/getMoneyInto");// 获取板块资金流入情况
    let { moneyIntoTot, moneyIntoDiff } = await getMoneyInto();
    // f14:板块名， f62: 资金流入金额（单位：元，需要除以 100000000，转换为以亿为单位）
    moneyIntoDiff.sort(function (a, b) {
        return b.f62 - a.f62
    })
    let lrzj10 = moneyIntoDiff.map((ele) => ele.f14);
    // 记录所有板的资金流入
    moneyIntoDiff.forEach(ele => {
        let blocName = ele.f14.slice(0, 4);
        allBlockInfo[blocName].lrzj = (ele.f62 / 100000000).toFixed(2) + "亿";
    })

    // 计算其交集
    let preJjArr = [];
    zdf10.slice(0, 10).forEach(ele => {
        if (
            xdl10.slice(0, 10).includes(ele)
            &&
            lrzj10.slice(0, 10).includes(ele)

        ) preJjArr.push(ele);
    })

    // 后面把异动板块(涨跌幅_降序_含有未涨停)前10，做补集并入
    preJjArr.unshift(...zdf10.slice(0, 10));
    preJjArr = [...new Set(preJjArr)]; //去重
    preJjArr = preJjArr.map(ele => ele.slice(0, 4));//截取板块名的前4个字

    // 构建返回结果
    let allRes = [
        ["涨跌幅_降序:", ...zdf10.slice(0, 10)],
        ["下跌率_升序:", ...xdl10.slice(0, 10)],
        ["资金流入_降序:", ...lrzj10.slice(0, 10)]
    ]


    // console.log("allBlockInfo",allBlockInfo)

    return {
        allRes, preJjArr, allBlockInfo
    }
}

module.exports = getPreHot_noZT
// getPreHot_noZT()