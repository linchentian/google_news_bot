/***************************************************************************************************
 * Part 01：用于响应后台提起的async函数调用，每个surface都需要复制一个。
 **************************************************************************************************/
console.log("Google News User Surface开始");
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

let user_prepared = false;

window.onload = async function () {
    await sleep(PAGE_LOADING_DELAY);
    user_prepared = true;
}

async function user_wait4() {
    try {
        while (!user_prepared) {
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
async function user_follow(cancel) {
    return 1;
}