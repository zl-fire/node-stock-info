function buildDate() {
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
    let date = dateArr[0] + day + dateArr[2];
    return date
}
module.exports=buildDate;