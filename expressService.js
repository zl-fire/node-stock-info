var express = require("express");
let path=require("path")
var app = express();
app.use(express.static('public'));

app.get("/getData", function (req, res) {
    res.send({name:"tets"})
}
)
app.listen(8081, function () {
    console.log("应用实例，访问地址为 http://127.0.0.1:8081");
});