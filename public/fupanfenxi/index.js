// 往页面中添加一个头+体，头：时间选择器+按钮，体：分析结果
function create(date) {
    // 添加头
    $(".head").append(`
    <section>
      <input type="date"/><button class="yes">确认</button>
    </section>
    `);
    // 添加体
    $(".main").append(`
    <section>
      内容${date}
    </section>
    `);
}
create(11);
create(22);
// 显示第一个标题和内容
$(".head section").eq(0).addClass("active-head");
$(".main section").eq(0).addClass("active-main");

// 添加tab
$(".add").click(function () {
    create();
})

// 事件委托
$("body").click(function () {
    let current = event.target;
    // 点击了确认按钮
    if ($(current).hasClass("yes")) {
        // 对标题进行显示和隐藏
        $(".head section").removeClass("active-head");
        $(current).parent().addClass("active-head");
        // 对内容进行显示和隐藏
        let index = $(current).parent().index();
        $(".main section").removeClass("active-main");
        $(".main section").eq(index - 1).addClass("active-main");
    }
})