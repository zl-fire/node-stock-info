const fetch = require('node-fetch');

// (async function () {
//     let res = await fetch('http://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&beg=0&end=20500101&ut=fa5fd1943c7b386f172d6893dbfba10b&rtntype=6&secid=' + '0.002820' + '&klt=101&fqt=1&cb=jsonp1672300934214')
//     let text = await res.text();
//     let jsonText = text.replace(/^jsonp\d+\(/, "").replace(/\);$/, "")
//     let obj = JSON.parse(jsonText)
//     let klineObj={
//         code:obj.data.code,
//         name:obj.data.name,
//         klines:obj.data.klines
//     }
//     console.log(klineObj);
// }())

(async function () {
    let res = await fetch('http://quote.eastmoney.com/sz002560.html')
    let text = await res.text();
   
    console.log(text);
}())




    // var db = new JsonDB(new Config("data/stocks", true, true, '/'));
    // // Deleting data
    // await db.delete("/");
    // await db.push("/", stocks);