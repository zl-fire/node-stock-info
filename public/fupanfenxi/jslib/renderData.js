
function renderData(date, element) {
    fetch("/getData?date=" + date)
        .then(d => d.json())
        .then(d => {
            if (d.info) alert(d.info);
            else {
                // 开始渲染页面
                let htmlStr = `<div>${date}-股市分析</div>`;
                for (let key in d) {
                    if(key=="股票与代码映射关系") continue;
                    let h = `<h1>【${key}】</h1>`;
                    htmlStr += h;
                    let value = d[key];
                    // 渲染数据为table（目前数组最多为二维即可）
                    let table = `<table  border="1" cellpadding="10" cellspacing="0"><tbody>`;
                    // 表示是对象数组
                    if (Object.prototype.toString.call(value[0]) === '[object Object]') {
                        let endArr = [];
                        let headArr = Object.keys(value[0]);
                        endArr.push(headArr);
                        // 获取内容数组
                        value.forEach(obj => {
                            let contentArr = Object.values(obj);
                            endArr.push(contentArr);
                        })
                        // 渲染
                        table += diguiRenderArr(endArr);
                    }
                    // 表示非对象数组
                    else {
                        table += diguiRenderArr(value);
                    }
                    table += "</tbody></table>";
                    htmlStr += table;

                }
                element.html(htmlStr)
                setTimeout(function () {
                    alert("数据获取成功");
                }, 1000)
            }
        });
}