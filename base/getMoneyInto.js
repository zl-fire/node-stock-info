// 

// 获取板块资金流入问题信息
// 网页：https://data.eastmoney.com/bkzj/hy.html （可对比参数含义）
// 接口：https://push2.eastmoney.com/api/qt/clist/get?cb=jQuery11230042368503993895246_1674038459890&fid=f62&po=1&pz=50&pn=1&np=1&fltt=2&invt=2&ut=b2884a393a59ad64002292a3e90d46a5&fs=m%3A90+t%3A2&fields=f12%2Cf14%2Cf2%2Cf3%2Cf62%2Cf184%2Cf66%2Cf69%2Cf72%2Cf75%2Cf78%2Cf81%2Cf84%2Cf87%2Cf204%2Cf205%2Cf124%2Cf1%2Cf13


const fetch = require('node-fetch');

async function getMoneyInto() {
    // 请求数据
    let url = 'https://push2.eastmoney.com/api/qt/clist/get?cb=jQuery11230042368503993895246_1674038459890&fid=f62&po=1&pz=500&pn=1&np=1&fltt=2&invt=2&ut=b2884a393a59ad64002292a3e90d46a5&fs=m%3A90+t%3A2&fields=f12%2Cf14%2Cf2%2Cf3%2Cf62%2Cf184%2Cf66%2Cf69%2Cf72%2Cf75%2Cf78%2Cf81%2Cf84%2Cf87%2Cf204%2Cf205%2Cf124%2Cf1%2Cf13';
    let res = await fetch(url)
    let text = await res.text();
    let jsonText = text.replace(/^jQuery\d+?_\d+?\(/, "").replace(/\);$/, "")
    let obj = JSON.parse(jsonText)

    // 得到总数和最终数据
    let moneyIntoTot = obj.data.total;
    let moneyIntoDiff = obj.data.diff;

    return { moneyIntoTot, moneyIntoDiff }
}

module.exports = getMoneyInto;
