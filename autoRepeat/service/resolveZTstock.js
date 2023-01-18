
// 解析涨停股数据
async function resolveZTstock(ztData) {
    let { tot, poll, date } = ztData;
    // 开始分析数据
    /**
     * 1. 需要构造的数据结构如下
     *  {
     *   ”板块名1“:{
     *      板块名1,
     *      涨停股数量，
     *      最大涨连板数,
     *      所有涨停股的连板数显示，
     *      共有哪些涨停股
     * 
     *      涨跌幅,领涨股,跌率，下跌比，资金流入
     * 
     *     },
     *    ”板块名2“:{
     *      板块名2,
     *      涨停股数量，
     *      最大涨连板数,
     *      所有涨停股的连板数显示，
     *      共有哪些涨停股,
     * 
     *      涨跌幅,领涨股,跌率,下跌比，资金流入
     * 
     *     }
     *  }
     * }
     *  2. 将这个写板块的值构建成数组，然后按照涨停股数量+最大连板数排序，由高到底
     */
    let allObj = {}
    poll.forEach(ele => {
        // 得到板块名字
        if (!allObj[ele.hybk]) {
            allObj[ele.hybk] = {
                blockName: ele.hybk,
                ztNum: 1, //涨停股数量初始为1
                maxLBN: 1,//最大连板数初始为1(最后计算)
                lbnArr: [],//连板数集合
                stockArr: [],//涨停股集合
                ztStocks: [{
                    [ele.n]: ele.lbc
                }],//具体的涨停股
            }
        } else {
            allObj[ele.hybk].ztNum++;
            allObj[ele.hybk].ztStocks.push({
                [ele.n]: ele.lbc
            });
        }
    });

    // 计算板块涨跌幅和板块下跌比例，最后单独打印前20的涨幅板块
    let getBlockInfo = require("../../base/getBlockInfo");
    let { blockTot, diff } = await getBlockInfo();
    // f14:板块名，f3: 板块涨跌幅，f104: 板块上涨家数， f105:下跌家数 ，f128:领涨股
    diff.forEach(ele => {

        // 如果板块名大于4个字就取前四个字，为了和涨停次板块名一致
        if (ele.f14.length > 4) ele.f14 = ele.f14.slice(0, 4);

        if (allObj[ele.f14]) {
            allObj[ele.f14].zdf = ele.f3;//涨跌幅
            allObj[ele.f14].lzg = ele.f128;//领涨股
            allObj[ele.f14].xdl = (ele.f105 / (ele.f104 + ele.f105) * 100).toFixed(2) + "%";//下跌率
            allObj[ele.f14].xdb = `${ele.f105}/${ele.f105 + ele.f104}`;//下跌比
        }
    })

    // 获取板块资金流入情况
    let getMoneyInto = require("../../base/getMoneyInto");
    let { moneyIntoTot, moneyIntoDiff } = await getMoneyInto();
    // f14:板块名， f62: 资金流入金额（单位：元，需要除以 100000000，转换为以亿为单位）
    moneyIntoDiff.forEach(ele => {
        // 如果板块名大于4个字就取前四个字，为了和涨停次板块名一致
        if (ele.f14.length > 4) ele.f14 = ele.f14.slice(0, 4);
        if (allObj[ele.f14]) {
            allObj[ele.f14].zjlr = (ele.f62/100000000).toFixed(2);//资金流入
        }
    })


    // 计算最大连板数，连板数集合，排序
    let blockArr = Object.values(allObj);
    blockArr.forEach(ele => {
        // 根据连板数排序
        let ztStocks = ele.ztStocks;
        ztStocks.sort(function (a, b) {
            return a.lbc - b.lbc;
        })
        // 得到连板数集合  和 涨停股集合
        ztStocks.forEach(ele2 => {
            ele.lbnArr.push(...Object.values(ele2))
            ele.stockArr.push(...Object.keys(ele2))
        })
        // 获取最大连板数
        ele.maxLBN = Math.max(...ele.lbnArr)
    })

    // 计算热门板块的排序方式依次为：板块涨幅 ,板块下跌率 ，流入资金 ，，（...涨停股数量，最大连板数）
    blockArr.sort(function (a, b) {
        if (b.zdf != a.zdf ) return b.zdf - a.zdf //涨跌幅排序
        if (b.zdf == a.zdf) return a.xdl.slice(0, -1) - b.xdl.slice(0, -1) //下跌率排序
        if (b.zdf == a.zdf && b.xdl == a.xdl ) return b.zjlr - a.zjlr
        
        // if (b.ztNum != a.ztNum) return b.ztNum - a.ztNum //涨停股数量排序
        // if (b.ztNum == a.ztNum) return b.maxLBN - a.maxLBN //最大连板数排序
        // if (b.ztNum == a.ztNum && b.maxLBN == a.maxLBN) return a.xdl.slice(0, -1) - b.xdl.slice(0, -1) //下跌率排序
        // if (b.ztNum == a.ztNum && b.maxLBN == a.maxLBN && b.xdl == a.xdl) return b.zdf - a.zdf //涨跌幅排序
    })

    return {
        tot, blockArr, date
    }

}

module.exports = resolveZTstock