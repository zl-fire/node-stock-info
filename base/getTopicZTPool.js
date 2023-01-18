//=========得到涨停股池===========
// 如果需要知道具体参数含义，可在此页面上去一一对照：http://quote.eastmoney.com/ztb/detail#type=ztgc

const fetch = require('node-fetch');

async function getTopicZTPool(date) {
    if (!date) {
        // 构建日期参数
        let d = new Date();
        // 如果当前是周六周日，则获取周五的数据
        let weekDay = d.getDay();
        if (weekDay > 5) d = new Date(d.getTime() - (weekDay - 5) * (24 * 60 * 60 * 1000))
        // 如果当前时间是早上九点半之前，则获取前一天的数据
        let hour = d.getHours();
        let minute = d.getMinutes();
        if (hour < 9 || (hour == 9 && minute <= 30)) {
            d = new Date(d.getTime() - 1 * (24 * 60 * 60 * 1000))
        }
        // 获取年月日参数
        d = d.toLocaleDateString();
        let dateArr = d.split("/");
        let day = dateArr[1];
        day = day.length == 1 ? "0" + day : day;
        date = dateArr[0] + day + dateArr[2];
    }

    // 请求数据
    let url = 'http://push2ex.eastmoney.com/getTopicZTPool?cb=callbackdata1783941&ut=7eea3edcaed734bea9cbfc24409ed989&dpt=wz.ztzt&Pageindex=0&pagesize=170&sort=fbt%3Aasc&date=' + date + '&_=1673969152674'
    let res = await fetch(url)
    let text = await res.text();
    let jsonText = text.replace(/^callbackdata\d+\(/, "").replace(/\);$/, "")
    let obj = JSON.parse(jsonText)

    // 得到总数和最终数据
    let tot = obj.data.tc;
    let poll = obj.data.pool;

    return { tot, poll, date }
}

module.exports = getTopicZTPool;
