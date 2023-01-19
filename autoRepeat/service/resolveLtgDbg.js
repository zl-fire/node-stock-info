// 计算推荐龙头股 和 一进二打板股
// async function resolveLtgDbg(blockArr, hotBlock, preHot) {
async function resolveLtgDbg(blockArr, hotBlock) {
    let tjLTG = [];//推荐龙头股
    let daBan = [];//推荐一进二打板
    let allStocks = {};//热点板块所有的股票
    let cloneBlockArr = JSON.parse(JSON.stringify(blockArr));

    cloneBlockArr.forEach(ele => {
        if (hotBlock.slice(1).includes(ele.blockName)) {
            //领涨股可能是首版，只是由于上涨率最大（比如10%，9.97等都称为涨停），所以才领涨，这种算法不太科学
            // 需要计算此板块涨停股中，连板数最多的作为龙头股，如果连板数最多的有多个，那么就都设置为龙头股
            // tjLTG.push(ele.lzg); 
            // 计算真正的龙头股
            ele.ztStocks.sort(function (a, b) {
                // 获取连板数
                let vala = Object.values(a)[0]
                let valb = Object.values(b)[0]
                return valb - vala
            })
            // 将真正的龙头股放入到到数组中(涨停股数量大于1的逻辑如下)
            for (let i = 0; i < ele.ztStocks.length - 1; i++) {
                let stock1 = ele.ztStocks[i];
                let stock2 = ele.ztStocks[i + 1];

                let val1 = Object.values(stock1)[0]
                let val2 = Object.values(stock2)[0]

                let name1 = Object.keys(stock1)[0]
                let name2 = Object.keys(stock2)[0]

                // 第一个直接放入数组，后面的需要比较连板数是否一致，如果一致，那么也放入到数组中
                if (i == 0) tjLTG.push(name1);

                if (val1 == val2) tjLTG.push(name2);
                else break;
            }
            // 将真正的龙头股放入到到数组中(涨停股数量等于1的逻辑如下)
            if (ele.ztStocks.length == 1) tjLTG.push(Object.keys(ele.ztStocks[0])[0]);

            // 记录所有的涨停股
            ele.ztStocks.forEach(ele2 => {
                for (let key in ele2) {
                    allStocks[key] = ele2[key];
                }
            })
        }
    })

    // console.log("领涨股", tjLTG)

    // 如果推荐股里面含有一板票，那么移入到一进二打板（提高确定性）
    tjLTG = tjLTG.filter(ele => {
        if (allStocks[ele] !== 1) return true;
    })

    // // 往allStocks加入所有预热板块的打板票
    // blockArr.forEach(ele => {
    //     if (preHot.includes(ele.blockName)) {
    //         ele.ztStocks.forEach(ele2 => {
    //             for (let key in ele2) {
    //                 allStocks[key] = ele2[key];
    //             }
    //         })
    //     }
    // })

    // 计算出所有需要一进二打板的股票
    daBan = Object.keys(allStocks).filter(ele => {
        return !tjLTG.includes(ele) && allStocks[ele] == 1;
    });

    return { tjLTG, daBan }
}

module.exports = resolveLtgDbg