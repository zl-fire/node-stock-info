const dip = require("dipiper");
let zl_nodefs = require("zl-nodefs");
let {
    writeFile, //创建/写入文件
    deleteFile,//删除文件夹/文件
    copycutFiledir,//复制或剪切文件/文件夹
    readFileList,//读取目录树tree
    readFileContent,//读取文件内容
    addFileContent //追加文件内容
} = zl_nodefs;

/**
 * 获取所有的A股股票的前半个月股价变化
 * @param {*} stocks  a股所有股票列表
 * @param {*} index  从具体哪个股票开始爬取数据,默认为0
 * @param {*} year  爬取哪一年的数据,默认为'22'
 * @param {*} dayNum  最近n天的股票,默认为15
 */
async function getAStockHistoryData(stocks, index = 0, year = "22", dayNum = 15) {
    if (!stocks) {
        stocks = require('./AStocks_data.json')
    }
    let currentDate = new Date().toLocaleDateString()
    for (let i = index; i < stocks.length; i++) {
        let stock = stocks[i];
        let { symbol, name } = stock
        let market = symbol.slice(0, 2);
        if (market != 'sh' && market != 'sz') continue //表示只爬取上海和深圳的股票
        if (stock.fetchDate == currentDate && stock.historyData) continue //表示已经爬取过数据
        // if (symbol != "sh603280") continue
        console.log(`\n\n${i + 1}/${stocks.length}`);
        console.log(`${name}(${symbol})--股票数据开始获取-start`);
       return  await new Promise(function (resolve, reject) {
            dip.stock.trading.getDailyHis(year, symbol).then((data) => {
                // 截取数组最近15天数据
                stock.historyData = data.slice(-dayNum);
                stock.fetchDate = new Date().toLocaleDateString() //爬取时间
                console.log(`${name}(${symbol})--股票数据获取完成-end`);
                global.fetchNumber ? global.fetchNumber++ : global.fetchNumber = 1; //记录爬取数量
                console.log(`共爬取股票数量:${global.fetchNumber}`);
                // 每爬取20条数据就写入一次
                if (global.fetchNumber % 20 == 0) {
                    writeStocks(stocks)
                }
                resolve(true)
            }).catch(function (error) {
                if (!global.skipStocks) global.skipStocks = { [symbol]: 1 } //{code:次数}
                else {
                    let times = global.skipStocks[symbol];
                    times ? global.skipStocks[symbol] = times + 1 : global.skipStocks[symbol] = 1
                }
                if (global.skipStocks[symbol] > 3) {
                    console.log(`-----------【【 ${name}(${symbol})--股票数据获取连续三次出错，永久跳过】】--------\n\n`);
                    getAStockHistoryData(stocks, i + 1, year, dayNum)
                }
                else {
                    console.log(`${name}(${symbol})--股票数据获取出错--次数:${global.skipStocks[symbol]}--跳过----------`);
                    getAStockHistoryData(stocks, i, year, dayNum)
                }
            });
        })
    }
    console.log(`----------- A股所有股票数据爬取完成-----------------------`);
    writeStocks(stocks)

    function writeStocks(stocks) {
        let content = JSON.stringify(stocks, null, 4)
        writeFile({ path: "./AStocks_data.json", content: content })
    }
}

getAStockHistoryData()