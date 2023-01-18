
// 解析涨停股数据
async function resolveZTstock(ztData){
    let {tot,poll,date} = ztData;
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
     *     },
     *    ”板块名2“:{
     *      板块名2,
     *      涨停股数量，
     *      最大涨连板数,
     *      所有涨停股的连板数显示，
     *      共有哪些涨停股
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

    // 按涨停股数量排序，如果一致就按照最大连板数排序
    blockArr.sort(function (a, b) {
        if (b.ztNum != a.ztNum) return b.ztNum - a.ztNum
        else return b.maxLBN - a.maxLBN
    })

    return {
        tot,blockArr,date
    }

}

module.exports=resolveZTstock