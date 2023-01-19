function showAndHide(current) {
    // 对标题进行显示和隐藏
    $(".head section").removeClass("active-head");
    $(current).parent().addClass("active-head");
    // 对内容进行显示和隐藏
    let index = $(current).parent().index();
    $(".main section").removeClass("active-main");
    $(".main section").eq(index - 1).addClass("active-main");
}