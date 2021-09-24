/***************************************************************************************************
 * Part 01：用于响应后台提起的async函数调用，每个surface都需要复制一个。
 **************************************************************************************************/
console.log("Google News Article Surface开始");
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);
        if (!!request.cmd && request.cmd === "exec") {
            console.log(request.code);
            eval("(async () => {return " + request.code + "})()")
                .then(
                    function (value) {
                        // 执行成功
                        console.log("success: " + value);
                        sendResponse(value);
                    },
                    function (value) {
                        // 执行失败
                        console.log("failure: " + value);
                        sendResponse(null);
                    });
        }
        return true;
    });

let article_prepared = false;

window.onload = async function () {
    await sleep(3000);

    article_prepared = true;
}

async function article_wait4() {
    try {
        while (!article_prepared) {
            await sleep(200);
        }
    } catch (e) {
        return 1;
    }
    return 0;
}

/***************************************************************************************************
 * Part 02：定义常量，主要是页面的操作延时基准和页面元素的定位符。常量使用全大写单词，中间以下划线间隔
 **************************************************************************************************/



/***************************************************************************************************
 * Part 03：surface相关的功能函数。注意，API中的每个函数都需要在这里实现一个空的，这样可以避免在后继使用通用代码时调用
 * 到无效函数产生错误。另外，surface中的函数尽量保证单一功能。
 **************************************************************************************************/
function article_getArticle() {
    return 0;
}

async function article_comment(commentText) {

    return 0;
}

function article_like(cancel) {

    return 0;
}

function article_forward() {
    return 0;
}

async function article_collect(cancel) {

    return 0;
}

function article_follow(cancel) {

    return 0;
}

async function article_view(time) {

    return 1;
}

function article_updateComments() {
    return 0;
}

function article_expandTopComment() {

    return 0;
}

function article_getTopComments(deletion) {

    return 0;
}

