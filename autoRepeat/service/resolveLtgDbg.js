// 计算推荐龙头股 和 一进二打板股
async function resolveLtgDbg(blockArr, blockResolveRes) {
    let tjLTG = [];//推荐龙头股
    let daBan = [];//推荐一进二打板
    let allStocks = {};//热点板块所有的股票

    blockArr.forEach(ele => {
        if (blockResolveRes[3].slice(1).includes(ele.blockName)) {
            tjLTG.push(ele.lzg);
            ele.ztStocks.forEach(ele2 => {
                for (let key in ele2) {
                    allStocks[key] = ele2[key];
                }
            })
        }
    })

    // 如果推荐股里面含有一板票，那么移入到一进二打板（提高确定性）
    tjLTG = tjLTG.filter(ele => {
        if (allStocks[ele] !== 1) return true;
    })
    // 计算出所有需要一进二打板的股票
    daBan = Object.keys(allStocks).filter(ele => !tjLTG.includes(ele));

    return { tjLTG, daBan }
}

module.exports = resolveLtgDbg