(async function () {
    // 爬取沪深京所有的个股
    let CrawlerStocks = require("./base/craStockList")
    await CrawlerStocks();
    setTimeout(async function () {
        // 爬取沪深京所有的个股信息
        let CrawlerStocksInfo = require("./craStockInfo")
        await CrawlerStocksInfo();
        // 开始创建excel表格
        let createTable = require("./createTable")
        await createTable();
    }, 3000)
}())


