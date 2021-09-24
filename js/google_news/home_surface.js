/***************************************************************************************************
 * Part 01：（1）修改后，无需主页主动向background提起机器人运行，bg自己会搜索是否出现主页而开始运行；（2）现在，这部分
 * 是用于响应后台提起的async函数调用；（3）每个surface都需要复制一个
 * 每个surface添加了一个xxx_prepared变量，以及相关的xxx_wait4()函数，该变量和函数与window.onload事件组合，完成该
 * 平台进入该surface时，需要进行的必要的预处理。具体参考各个switch函数和select函数。
 **************************************************************************************************/
console.log("Google News Home Surface开始");
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

let home_prepared = false;

window.onload = async function () {
    await sleep(1000);
    home_prepared = true;
}

async function home_wait4() {
    try {
        while (!home_prepared) {
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
const HOME_ARTICLES = "c-wiz[jsrenderer='OIIjLd'][class='Q9AUHb'][data-n-prms][data-p][jscontroller='o8u3Cf'][jsdata] > div[class][jsname][jsmodel='dPwZPd hT8rr'][jsdata] > div";
const HOME_SUBARTICLES = "article";
const HOME_ARTICLE_SOURCE = "div[class='QmrVtf RD0gLb kybdz'] > div[class='SVJrMe'] > a";
const HOME_ARTICLE_TIME = "div[class='QmrVtf RD0gLb kybdz'] > div[class='SVJrMe'] > time";
const HOME_ARTICLE_TITLE = "a[href][class='DY5T1d RZIKme']";
const HOME_AUTHER_TITILE = "h4";
/***************************************************************************************************
 * Part 03：surface相关的功能函数。注意，API中的每个函数都需要在这里实现一个空的，这样可以避免在后继使用通用代码时调用
 * 到无效函数产生错误。另外，surface中的函数尽量保证单一功能。
 **************************************************************************************************/
async function home_jump(to) { // 一个无效函数，B站没有翻页操作，但需要按照给定的返回值，返回必要的结果。
    return { current: 1, max: 1, err: 0 };
}

async function home_more() {
    try{
        let Top_height = document.body.scrollHeight;
        window.scrollTo({
            top: Top_height,
            behavior: "smooth"
        });
        await sleep(2000);
        return 0;
    }catch (e){
        return 1;
    }
}

function home_focus(articleIndex) {
    try{
        let article_list = get_article_elements(HOME_ARTICLES, HOME_SUBARTICLES);
        let focus_article = article_list[articleIndex];
        focus_article.scrollIntoView({
            behavior:'smooth',block:"center"
        });
        return 0;
    }catch (e){
        return 1;
    }
}

function home_select(articleIndex) {
    try{
        let article_list = get_article_elements(HOME_ARTICLES, HOME_SUBARTICLES);
        let focus_article = article_list[articleIndex];
        let url = focus_article.querySelector("a").getAttribute("href");
        window.open(url);
        return 0;
    }catch (e){
        return 1;
    }
}

function home_getArticleList() {
    // try{
    let article_info_list = [];
    let article_list = get_article_elements(HOME_ARTICLES, HOME_SUBARTICLES);
    for(let i = 0; i < article_list.length; i++){
        let article_info = emptyArticle();
        // console.log(article_list[i]);
        article_info.articleHTML = article_list[i];
        article_info.articleDevice = "pc";
        let url = article_list[i].querySelector("a[href]").getAttribute("href")
        article_info.articleURL = url.replace("./articles/","https://news.google.com/articles/");
        // console.log(article_info.articleURL);
        article_info.articleID = article_info.articleURL.split("/articles/")[1].split("?hl=en")[0];
        // article_info.articleAuthorName = article_list[i].querySelector(HOME_ARTICLE_SOURCE).innerText;
        article_info.articleSource = article_info.articleAuthorName;
        article_info.articlePostingTime = article_list[i].querySelector(HOME_ARTICLE_TIME).getAttribute("datetime");
        article_info.articleTitle = article_list[i].querySelector(HOME_ARTICLE_TITLE).innerText;
        if(article_info.articleTitle === undefined){
            article_info.articleTitle = article_list[i].querySelector(HOME_AUTHER_TITILE);
        }
        article_info_list.push(article_info);
    }
    console.log(article_info_list);
    return article_info_list;
    // }catch (e){
    //     return 1;
    // }
}

function home_comment(articleIndex, commentText) {
    return 0;
}

function home_like(articleIndex, cancel) {
    return 0;
}

function home_forward(articleIndex) {
    return 0;
}

function home_collect(articleIndex, cancel) {
    return 0;
}

function home_follow(articleIndex, cancel) {
    return 0;
}

