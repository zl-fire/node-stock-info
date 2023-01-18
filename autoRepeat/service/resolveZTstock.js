
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
     * 
     *      涨跌幅,领涨股,跌率，下跌比
     * 
     *     },
     *    ”板块名2“:{
     *      板块名2,
     *      涨停股数量，
     *      最大涨连板数,
     *      所有涨停股的连板数显示，
     *      共有哪些涨停股,
     * 
     *      涨跌幅,领涨股,跌率,下跌比
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
    let getBlockInfo=require("../../base/getBlockInfo");
    let { blockTot, diff }= await getBlockInfo();
    // f14:板块名，f3: 板块涨跌幅，f104: 板块上涨家数， f105:下跌家数 ，f128:领涨股
    diff.forEach(ele=>{
        if(ele.f14=="互联网服务") ele.f14="互联网服";
        if(ele.f14=="光学光电子") ele.f14="光学光电";
        if(ele.f14=="汽车零部件") ele.f14="汽车零部";
        if(ele.f14=="房地产服务") ele.f14="房地产服";
        if(ele.f14=="房地产开发") ele.f14="房地产开";
        
        if(allObj[ele.f14]){
            allObj[ele.f14].zdf=ele.f3;//涨跌幅
            allObj[ele.f14].lzg=ele.f128;//领涨股
            allObj[ele.f14].xdl=(ele.f105/(ele.f104+ele.f105)*100).toFixed(2)+"%";//下跌率
            allObj[ele.f14].xdb=`${ele.f105}/${ele.f105+ele.f104}`;//下跌比
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

    // 按涨停股数量排序，如果一致就按照最大连板数排序
    blockArr.sort(function (a, b) {
        if (b.ztNum != a.ztNum) return b.ztNum - a.ztNum //涨停股数量排序
        if (b.ztNum == a.ztNum) return  b.maxLBN - a.maxLBN //最大连板数排序
        if (b.ztNum == a.ztNum && b.maxLBN == a.maxLBN) return  a.xdl.slice(0,-1) - b.xdl.slice(0,-1) //下跌率排序
        if (b.ztNum == a.ztNum && b.maxLBN == a.maxLBN && b.xdl == a.xdl  ) return  b.zdf - a.zdf //涨跌幅排序
    })

    return {
        tot,blockArr,date
    }

}

module.exports=resolveZTstock