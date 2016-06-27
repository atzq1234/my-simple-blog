toastr.options = {
    "positionClass": "toast-bottom-right"
};

/**
 * 调用浏览器滚动事件的闭包
 * @param func  浏览器滚动事件的handler
 * @param wait  触发handler的等待时间
 * @returns {Function}  handler函数
 */
function windowScroll (func, wait) {
    var timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(func, wait);
    }
}
/**
 * 浏览器滚动后触发效果的handler函数
 */
function scrollHandler () {
    var navbar = $('#navbar'),
        btnToTop = $('#btnToTop'),
        scrollTop = $(window).scrollTop();
    if (scrollTop > 60 && !navbar.hasClass('f-navbar-fixed')) {
        $('body').css('margin-top', navbar.height() + parseInt(navbar.css('margin-bottom')) + 2);
        navbar.addClass('f-navbar-fixed');
    } else if (scrollTop <= 60) {
        $('body').css('margin-top', 0);
        navbar.removeClass('f-navbar-fixed');
    }
    if (scrollTop > 250 && !btnToTop.hasClass('showed')) {
        btnToTop.addClass('showed');
    } else if (scrollTop <= 250) {
        btnToTop.removeClass('showed');
    }
}
/**
 * 只允许出现一次的toastr提示
 * @param method    toastr的方法名
 * @param options   toastr的options属性
 * @param message   toastr的信息
 * @param title     toastr的标题
 */
function myToastr(method, options, message, title){
    toastr.remove();
    title ? toastr[method](title, message, options) : toastr[method](message, options);
}