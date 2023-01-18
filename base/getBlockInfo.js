// 获取板块信息
// 网页：http://quote.eastmoney.com/center/boardlist.html#industry_board （可对比参数含义）
// 接口：http://64.push2.eastmoney.com/api/qt/clist/get?cb=jQuery112405982495475506511_1674011942557&pn=1&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&wbp2u=|0|0|0|web&fid=f3&fs=m:90+t:2+f:!50&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f26,f22,f33,f11,f62,f128,f136,f115,f152,f124,f107,f104,f105,f140,f141,f207,f208,f209,f222&_=1674011942572


const fetch = require('node-fetch');

async function getBlockInfo() {
    // 请求数据
    let url = 'http://64.push2.eastmoney.com/api/qt/clist/get?cb=jQuery112405982495475506511_1674011942557&pn=1&pz=200&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&wbp2u=|0|0|0|web&fid=f3&fs=m:90+t:2+f:!50&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f26,f22,f33,f11,f62,f128,f136,f115,f152,f124,f107,f104,f105,f140,f141,f207,f208,f209,f222&_=1674011942572'
    let res = await fetch(url)
    let text = await res.text();
    let jsonText = text.replace(/^jQuery\d+?_\d+?\(/, "").replace(/\);$/, "")
    let obj = JSON.parse(jsonText)

    // 得到总数和最终数据
    let blockTot = obj.data.total;
    let diff = obj.data.diff;

    return { blockTot, diff }
}

module.exports = getBlockInfo;
