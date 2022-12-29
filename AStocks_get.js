const dip = require("dipiper");
let zl_nodefs = require("zl-nodefs");
let {
    writeFile, //创建/写入文件
    deleteFile,//删除文件夹/文件
    copycutFiledir,//复制或剪切文件/文件夹
    readFileList,//读取目录树tree
    readFileContent,//读取文件内容
    addFileContent //追加文件内容
} = zl_nodefs;

async function getStockList() {
    return await new Promise(function (resolve, reject) {
        dip.stock.symbols.getStockList().then((data) => {
            //数据存储、处理逻辑，请自行实现
            let content = JSON.stringify(data, null, 4)
            writeFile({ path: "./AStocks.json", content: content })
            console.log("成功获取所有的A股股票数据");
            resolve(true)
        });
    })
}

getStockList()