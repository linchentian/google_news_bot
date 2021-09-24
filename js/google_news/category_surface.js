/***************************************************************************************************
 * Part 01：用于响应后台提起的async函数调用，每个surface都需要复制一个。
 **************************************************************************************************/
console.log("Google News Category Surface开始");
chrome.runtime.onMessage.addListener(
function (request, sender, sendResponse) {
    if(!request.code.includes("sub")){
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
    }
});

let category_prepared = false;

window.onload = async function () {
    await sleep(3000);
    category_prepared = true;
    sub_category_prepared = true;
}

async function category_wait4() {
    try {
        while (!category_prepared) {
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
const CATEGORY_ARTICLES = "c-wiz[jsrenderer='optrU'][class='Vlf0vb'][data-n-prms][data-p][jscontroller='uzO99c'][jsdata] main > div[class='lBwEZb BL5WZb GndZbb'] > div";
const CATEGORY_SUBARTICLES = "article";
const CATEGORY_ARTICLE_SOURCE = "div[class='QmrVtf RD0gLb kybdz'] > div[class='SVJrMe'] > a";
const CATEGORY_ARTICLE_TIME = "div[class='QmrVtf RD0gLb kybdz'] > div[class='SVJrMe'] > time";
const CATEGORY_ARTICLE_TITLE = "a[href][class='DY5T1d RZIKme']";
const CATEGORY_AUTHER_TITILE = "h4";
/***************************************************************************************************
 * Part 03：surface相关的功能函数。注意，API中的每个函数都需要在这里实现一个空的，这样可以避免在后继使用通用代码时调用
 * 到无效函数产生错误。另外，surface中的函数尽量保证单一功能。
 **************************************************************************************************/
function category_jump(to) {
    return 0;
}

async function category_more() {
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

function category_focus(articleIndex) {
    try{
        let article_list = get_article_elements(CATEGORY_ARTICLES, CATEGORY_SUBARTICLES);
        let focus_article = article_list[articleIndex];
        focus_article.scrollIntoView({
            behavior:'smooth',block:"center"
        });
        return 0;
    }catch (e){
        return 1;
    }
}

function category_getArticleList() {
    try{
        let article_info_list = [];
        let article_list = get_article_elements(CATEGORY_ARTICLES, CATEGORY_SUBARTICLES);
        for(let i = 0; i < article_list.length; i++){
            let article_info = emptyArticle();
            console.log(article_list[i]);
            article_info.articleHTML = article_list[i];
            article_info.articleDevice = "pc";
            let url = article_list[i].querySelector("a[href]").getAttribute("href")
            article_info.articleURL = url.replace("./articles/","https://news.google.com/articles/");
            console.log(article_info.articleURL);
            article_info.articleID = article_info.articleURL.split("/articles/")[1].split("?hl=en")[0];
            article_info.articleAuthorName = article_list[i].querySelector(CATEGORY_ARTICLE_SOURCE).innerText;
            article_info.articleSource = article_info.articleAuthorName;
            article_info.articlePostingTime = article_list[i].querySelector(CATEGORY_ARTICLE_TIME).getAttribute("datetime");
            article_info.articleTitle = article_list[i].querySelector(CATEGORY_ARTICLE_TITLE);
            if(article_info.articleTitle === undefined){
                article_info.articleTitle = article_list[i].querySelector(CATEGORY_AUTHER_TITILE);
            }
            article_info_list.push(article_info);
        }
        return article_info_list;
    }catch (e){
        return 1;
    }
}

function category_select(articleIndex) {
    try{
        let article_list = get_article_elements(CATEGORY_ARTICLES, CATEGORY_SUBARTICLES);
        let focus_article = article_list[articleIndex];
        let url = focus_article.querySelector("a").getAttribute("href");
        window.open(url);
        return 0;
    }catch (e){
        return 1;
    }
}







