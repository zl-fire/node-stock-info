const axios = require("axios");
let zl_nodefs = require("zl-nodefs");
let {
    writeFile, //创建/写入文件
    deleteFile,//删除文件夹/文件
    copycutFiledir,//复制或剪切文件/文件夹
    readFileList,//读取目录树tree
    readFileContent,//读取文件内容
    addFileContent //追加文件内容
} = zl_nodefs;



axios.get('https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sz003005&scale=240&ma=5&datalen=15')
    .then(function (response) {
        // console.log(response.data);
        let res = response.data
        console.log(res);
    })
    .catch(function (error) {
        // 处理错误情况
        console.log(error);
    })