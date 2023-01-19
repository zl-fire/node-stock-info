function diguiRenderArr(par) {
    if (!par[0]) {
        console.error("数组为空！");
        return;
    }
    // 如果是一维数组
    if (!(par[0] instanceof Array)) {
        let tr = "<tr>"
        par.forEach(v => {
            tr += `<td>${v}</td>`;
        })
        tr += "</tr>";
        return tr;
    }
    // 如果是二维数组
    let str='';
    for(let i=0;i<par.length;i++){
        str+=diguiRenderArr(par[i]);
    }
    return str
}