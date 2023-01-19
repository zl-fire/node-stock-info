var express = require("express");
let path = require("path")
var app = express();

app.use(express.static('public'));

app.get("/", async function (req, res) {
    res.send("666")
})

app.get("/getData", async function (req, res) {
    // 获取时间参数
    let date = req.query.date;
    console.log("===date====",date)
    // 每次都要重新执行下，因为可能每天不同时刻分析的
    let autoRepeat = require("./autoRepeat/main");
    await autoRepeat(false);//执行函数生成分析结果，会自动写入文件,false表示不显示日志
    // 从文件中读取
    let allRes = require("./autoRepeat/data/historicalAnalysisResults.json")
    let data=allRes[date] || {info:"无此日期对应得数据!",code:1}
    res.send(data)
})

app.listen(8082, function () {
    console.log("应用实例，访问地址为 http://127.0.0.1:8082");
});