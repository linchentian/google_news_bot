/***************************************************************************************************
 * Part 01：用于响应后台提起的async函数调用，每个surface都需要复制一个。
 **************************************************************************************************/
console.log("Google News Article Search Surface开始");
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

let article_search_prepared = false;

window.onload = async function () {
    await sleep(3000);
    article_search_prepared = true;
}

async function article_search_wait4() {
    try {
        while (!article_search_prepared) {
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
const ARTICLE_SEARCH_ARTICLES = "c-wiz[jsrenderer='vBVNjc'][class='FffXzd'][data-n-q][data-p][jscontroller='o2EnYc'][jsdata] > div[class='lBwEZb BL5WZb xP6mwf'] > div";
const ARTICLE_SEARCH_SOURCE = "div[class='QmrVtf RD0gLb kybdz'] > div[class='SVJrMe'] > a";
const ARTICLE_SEARCH_TIME = "div[class='QmrVtf RD0gLb kybdz'] > div[class='SVJrMe'] > time";
const ARTICLE_SEARCH_TITLE = "a[href][class='DY5T1d RZIKme']";
const ARTICLE_SEARCH_SUBARTICLE = "article";

/***************************************************************************************************
 * Part 03：surface相关的功能函数。注意，API中的每个函数都需要在这里实现一个空的，这样可以避免在后继使用通用代码时调用
 * 到无效函数产生错误。另外，surface中的函数尽量保证单一功能。
 **************************************************************************************************/

async function article_search_jump(to) { 
    return 0;
}

async function article_search_more() {
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

function article_search_focus(articleIndex) {
    try {
        let article_list = get_article_elements(ARTICLE_SEARCH_ARTICLES, ARTICLE_SEARCH_SUBARTICLE);
        let focus_article = article_list[articleIndex];
        focus_article.scrollIntoView({
            behavior: 'smooth', block: "center"
        });
        return 0;
    }catch (e){
        return 1;
    }
}

function article_search_select(articleIndex) {
    try{
        let article_list = get_article_elements(ARTICLE_SEARCH_ARTICLES, ARTICLE_SEARCH_SUBARTICLE);
        let focus_article = article_list[articleIndex];
        let url = focus_article.querySelector("a").getAttribute("href");
        window.open(url);
        return 0;
    }catch (e){
        return 1;
    }
}

function article_search_getArticleList() {
    try{
        let article_info_list = [];
        let article_list = get_article_elements(ARTICLE_SEARCH_ARTICLES, ARTICLE_SEARCH_SUBARTICLE);
        for(let i = 0; i < article_list.length; i++){
            let article_info = emptyArticle();
            console.log(article_list[i]);
            article_info.articleHTML = article_list[i];
            article_info.articleDevice = "pc";
            let url = article_list[i].querySelector("a[href]").getAttribute("href");
            article_info.articleURL = url.replace("./articles/","https://news.google.com/articles/");
            console.log(article_info.articleURL);
            article_info.articleID = article_info.articleURL.split("/articles/")[1].split("?hl=en")[0];
            article_info.articleAuthorName = article_list[i].querySelector(ARTICLE_SEARCH_SOURCE).innerText;
            article_info.articleSource = article_info.articleAuthorName;
            article_info.articlePostingTime = article_list[i].querySelector(ARTICLE_SEARCH_TIME).getAttribute("datetime");
            article_info.articleTitle = article_list[i].querySelector(ARTICLE_SEARCH_TITLE);
            article_info_list.push(article_info);
        }
        console.log(article_info_list);
        return article_info_list;
    }catch (e){
        return 1;
    }

}

function article_search_comment(articleIndex, commentText) {
    return 0;
}

function article_search_like(articleIndex, cancel) {
    return 0;
}

function article_search_forward(articleIndex) {
    return 0;
}

function article_search_collect(articleIndex, cancel) {
    return 0;
}

function article_search_follow(articleIndex, cancel) {
    return 0;
}
