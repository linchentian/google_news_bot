/***************************************************************************************************
 * Part 01：用于响应后台提起的async函数调用，每个surface都需要复制一个。
 **************************************************************************************************/
console.log("Google News Sub Category Surface开始");
chrome.runtime.onMessage.addListener(
function (request, sender, sendResponse) {
    if(request.code.includes("sub")){
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

let sub_category_prepared = false;

window.onload = async function () {
    // 利用滚动确保内容加载
    await sleep(3000);
    sub_category_prepared = true;
    category_prepared = true;
}

async function sub_category_wait4() {
    try {
        while (!sub_category_prepared) {
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
const SUB_CATEGORY_ARTICLES = "c-wiz[jsrenderer='optrU'][class='Vlf0vb'][data-n-prms][data-p][jscontroller='uzO99c'][jsdata] main > div[class='lBwEZb BL5WZb GndZbb'] > div";
const SUB_CATEGORY_SUBARTICLES = "article";
const SUB_CATEGORY_ARTICLE_SOURCE = "div[class='QmrVtf RD0gLb kybdz'] > div[class='SVJrMe'] > a";
const SUB_CATEGORY_ARTICLE_TIME = "div[class='QmrVtf RD0gLb kybdz'] > div[class='SVJrMe'] > time";
const SUB_CATEGORY_ARTICLE_TITLE = "a[href][class='DY5T1d RZIKme']";
const SUB_CATEGORY_AUTHER_TITILE = "h4";
const SUB_CATEGORY_FOLLOW = "c-wiz[jsrenderer='xz9Esf'][class='MNK4Vd'][data-n-prms][data-p][jscontroller='NM85mf'][jsdata] div[class='XCz6Hb rHXK0e cd29Sd tXqPBe iaE4d'] > div[class='boLjl'] div[role='button']";
/***************************************************************************************************
 * Part 03：surface相关的功能函数。注意，API中的每个函数都需要在这里实现一个空的，这样可以避免在后继使用通用代码时调用
 * 到无效函数产生错误。另外，surface中的函数尽量保证单一功能。
 **************************************************************************************************/
async function sub_category_jump(to) {

    return { current: cp, max: mp, err: 1 };
}

async function sub_category_more() {
    try{
        // let article_list = get_article_elements(SUB_CATEGORY_ARTICLES, SUB_CATEGORY_ARTICLES);
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

function sub_category_focus(articleIndex) {
    try{
        let article_list = get_article_elements(SUB_CATEGORY_ARTICLES, SUB_CATEGORY_ARTICLES);
        let focus_article = article_list[articleIndex];
        focus_article.scrollIntoView({
            behavior:'smooth',block:"center"
        });
        return 0;
    }catch (e){
        return 1;
    }
}

function sub_category_select(articleIndex) {
    try{
        let article_list = get_article_elements(SUB_CATEGORY_ARTICLES, SUB_CATEGORY_ARTICLES);
        let focus_article = article_list[articleIndex];
        let url = focus_article.querySelector("a").getAttribute("href");
        window.open(url);
        return 0;
    }catch (e){
        return 1;
    }
}

function sub_category_getArticleList() {
    try{
        let article_info_list = [];
        let article_list = get_article_elements(SUB_CATEGORY_ARTICLES, SUB_CATEGORY_ARTICLES);
        for(let i = 0; i < article_list.length; i++){
            let article_info = emptyArticle();
            console.log(article_list[i]);
            article_info.articleHTML = article_list[i];
            article_info.articleDevice = "pc";
            let url = article_list[i].querySelector("a[href]").getAttribute("href")
            article_info.articleURL = url.replace("./articles/","https://news.google.com/articles/");
            console.log(article_info.articleURL);
            article_info.articleID = article_info.articleURL.split("/articles/")[1].split("?hl=en")[0];
            try{
                article_info.articleAuthorName = article_list[i].querySelector(SUB_CATEGORY_ARTICLE_SOURCE).innerText;
            }catch (e){
                article_info.articleAuthorName = "null";
            }
            article_info.articleAuthorID = "null";
            article_info.articleSource = article_info.articleAuthorName;
            article_info.articlePostingTime = article_list[i].querySelector(SUB_CATEGORY_ARTICLE_TIME).getAttribute("datetime");
            article_info.articleTitle = article_list[i].querySelector(SUB_CATEGORY_ARTICLE_TITLE);
            article_info_list.push(article_info);
        }
        console.log(article_info_list);
        return article_info_list;
    }catch (e){
        return 1;
    }
}

function sub_category_comment(articleIndex, commentText) {
    return 0;
}

function sub_category_like(articleIndex, cancel) {
    return 0;
}

function sub_category_forward(articleIndex) {
    return 0;
}

function sub_category_collect(articleIndex, cancel) {
    return 0;
}

function sub_category_follow(articleIndex, cancel) {
    try{
        let follow_button = document.querySelector(SUB_CATEGORY_FOLLOW);
        let follow_flag = follow_button.getAttribute("class");
        if(!cancel && follow_flag === "U26fgb YOnsCc waNn5b ZqhUjb ztUP4e RF3lAd cd29Sd dHeVVb V3dfMc lSLCF MDgEWb M9Bg4d"){
            follow_button.click();
            return 0;
        }else if(cancel && follow_flag === "U26fgb YOnsCc waNn5b ZqhUjb ztUP4e RF3lAd cd29Sd dHeVVb V3dfMc lSLCF MDgEWb M9Bg4d KKjvXb"){
            follow_button.click();
            return 0;
        }
    }catch (e){
        return 1;
    }
}
