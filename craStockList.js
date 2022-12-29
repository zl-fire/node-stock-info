var Crawler = require("crawler");
let { JsonDB, Config } = require('node-json-db')
var c = new Crawler({
    maxConnections: 10,
    // 这个回调每个爬取到的页面都会触发
    callback: async function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let text = res.body.replace(/^jQuery\d+_\d+\(/, "").replace(/\);$/, "")
            let stocks = JSON.parse(text)
            var db = new JsonDB(new Config("data/stocks", true, true, '/'));
            // Deleting data
            await db.delete("/");
            await db.push("/", stocks);
        }
        done();
    }
});
module.exports = async function () {
    // 爬取沪深京所有的个股数据
    await c.queue('http://48.push2.eastmoney.com/api/qt/clist/get?cb=jQuery1124011601470690732518_1671815092711&pn=1&pz=5250&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&wbp2u=|0|0|0|web&fid=f3&fs=m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23,m:0+t:81+s:2048&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152&_=1671815092803');
}
