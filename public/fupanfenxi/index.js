// 往页面中添加一个头+体，头：时间选择器+按钮，体：分析结果
function create(date) {
  // 添加头
  $(".head").append(`
    <section>
      <input type="date" value="${date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6)}"/>
      <button class="yes">确认</button>
      <button class="show">显示</button>
    </section>
    `);
  // 添加体
  $(".main").append(`
    <section>
      内容${date}
    </section>
    `);
}
create(buildDate());
// 显示第一个标题和内容
$(".head section").eq(0).addClass("active-head");
$(".main section").eq(0).addClass("active-main");

// 添加tab
$(".add").click(function () {
  create(buildDate());
})

// 事件委托
$("body").click(function () {
  let current = event.target;
  // 点击了确认按钮
  if ($(current).hasClass("yes")) {
    // 获取当前选择的日期
    let date = $(current).parent().find("input").val();
    if (date == "") {
      alert("请选择日期！");
      return;
    }
    date = date.replaceAll("-", "");
    // 开始调用接口获取分析数据
    let index = $(current).parent().index();
    let element = $(".main section").eq(index - 1);
    renderData(date, element);
    // 对内容进行显示和隐藏,对标题进行显示和隐藏
    showAndHide(current);
  }
  // 点击了显示按钮
  if ($(current).hasClass("show")) {
    // 对内容进行显示和隐藏,对标题进行显示和隐藏
    showAndHide(current);
  }
})