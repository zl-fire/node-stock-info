


// http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=SH600965
// http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=SH688141
// http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=BJ831039
// http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=SZ002659
// http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=SZ300359





// // http://quote.eastmoney.com/kcb/688141.html
// // http://quote.eastmoney.com/sz300359.html
// // http://quote.eastmoney.com/sz002659.html
// // http://quote.eastmoney.com/sh600965.html


// // http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sh688141
// // http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sz300359
// // http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sz002659
// // http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sh600965
// // http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=BJ831039

// // 流程：
// // 1. 先读取stocks.json文件
// // 2. 循环每个股票，先取出要的字段，然后获取公司概况信息在取出要的字段，
// // 3. 将最后的数据写入到jsonDB中保存

// var Crawler = require("crawler");
// let { JsonDB, Config } = require('node-json-db')
// var c = new Crawler({
//     maxConnections: 10,
//     // 这个回调每个爬取到的页面都会触发
//     callback: async function (error, res, done) {
//         if (error) {
//             console.log(error);
//         } else {

//             console.log(" res.body  ", res.body)
//             // var $ = res.$;
//             // $默认使用Cheerio
//             // 这是为服务端设计的轻量级jQuery核心实现
//             // let name = $("#hq_1").text()
//             // let code = $("#hq_1").parents('b').next().text()
//             // let companyName = $("#templateDiv").html()//公司名称

//             // let companyName = $("#templateDiv #Table0 td:eq(0)").text()
//             // console.info(companyName)

//             // let englishName = $("#templateDiv #Table0 td").eq(1).text();//英文名称
//             // let stockCode = $("#templateDiv #Table0 td").eq(2).text();//股票代码
//             // let shorterName = $("#templateDiv #Table0 td").eq(3).text();//A股简称
//             // let beforeName = $("#templateDiv #Table0 td").eq(5).text();//曾用名
//             // let securitiesCategory = $("#templateDiv #Table0 td").eq(10).text();//证券类别
//             // let dongcaiIndustry = $("#templateDiv #Table0 td").eq(11).text();//所属东财行业
//             // let listedExchange = $("#templateDiv #Table0 td").eq(12).text();//上市交易所
//             // let csrcIndustry = $("#templateDiv #Table0 td").eq(13).text();//所属证监会行业
//             // let generalManager = $("#templateDiv #Table0 td").eq(14).text();//总经理
//             // let legalRepresentative = $("#templateDiv #Table0 td").eq(15).text();//法人代表
//             // let boardSecretary = $("#templateDiv #Table0 td").eq(16).text();//董秘
//             // let chairman = $("#templateDiv #Table0 td").eq(17).text();//董事长
//             // let securitiesAffairsRepresentative = $("#templateDiv #Table0 td").eq(18).text();//证券事务代表
//             // let independentDirector = $("#templateDiv #Table0 td").eq(19).text();//独立董事
//             // let contactNumber = $("#templateDiv #Table0 td").eq(20).text();//联系电话
//             // let email = $("#templateDiv #Table0 td").eq(21).text();//电子信箱
//             // let fax = $("#templateDiv #Table0 td").eq(22).text();//传真
//             // let website = $("#templateDiv #Table0 td").eq(23).text();//公司网址
//             // let officeAddress = $("#templateDiv #Table0 td").eq(24).text();//办公地址
//             // let registeredAddress = $("#templateDiv #Table0 td").eq(25).text();//注册地址
//             // let region = $("#templateDiv #Table0 td").eq(26).text();//区域
//             // let postalCode = $("#templateDiv #Table0 td").eq(27).text();//邮政编码
//             // let registeredCapital = $("#templateDiv #Table0 td").eq(28).text();//注册资本(元)
//             // let industrialCommercialRegistration = $("#templateDiv #Table0 td").eq(29).text();//工商登记
//             // let employeesNumber = $("#templateDiv #Table0 td").eq(30).text();//雇员人数
//             // let managementPersonnelNumber = $("#templateDiv #Table0 td").eq(31).text();//管理人员人数
//             // let lawFirm = $("#templateDiv #Table0 td").eq(32).text();//律师事务所
//             // let accountingFirm = $("#templateDiv #Table0 td").eq(33).text();//会计师事务所
//             // let companyProfile = $("#templateDiv #Table0 td").eq(34).text();//公司简介
//             // let businessNature = $("#templateDiv #Table0 td").eq(35).text();//经营范围
//             // let issueRelated = $("#fxxg").parents("div").eq(0).text();//发行相关


//             // var db = new JsonDB(new Config("data/stockList", true, true, '/'));
//             // await db.push("/", {
//             //     companyName, englishName, stockCode, shorterName, beforeName, securitiesCategory, dongcaiIndustry, listedExchange,
//             //     csrcIndustry, generalManager, legalRepresentative, boardSecretary, chairman, securitiesAffairsRepresentative, independentDirector,
//             //     contactNumber, email, fax, website, officeAddress, registeredAddress, region, postalCode, registeredCapital, industrialCommercialRegistration,
//             //     employeesNumber, managementPersonnelNumber, lawFirm, accountingFirm, companyProfile, businessNature, issueRelated
//             // });
//         }
//         done();
//     }
// });
// // module.exports=function(){
// // // 爬取沪深京所有的个股数据
// // c.queue('http://48.push2.eastmoney.com/api/qt/clist/get?cb=jQuery1124011601470690732518_1671815092711&pn=1&pz=5250&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&wbp2u=|0|0|0|web&fid=f3&fs=m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23,m:0+t:81+s:2048&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152&_=1671815092803');
// // }

// (async function(){
// await c.queue('http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/PageAjax?code=SH600965');

// })()

// // await c.queue('http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sh688141');
// // c.queue('http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sz300359');
// // c.queue('http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sz002659');
// // c.queue('http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sh600965');
// // c.queue('http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=BJ831039');

// // http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sh688141
// // http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sz300359
// // http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sz002659
// // http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=sh600965
// // http://emweb.securities.eastmoney.com/PC_HSF10/CompanySurvey/Index?type=web&code=BJ831039