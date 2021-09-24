/***************************************************************************************************
 * Part 01：用于响应后台提起的async函数调用，每个surface都需要复制一个。
 **************************************************************************************************/
console.log("GoogleNews User Article Surface开始");
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

let user_article_prepared = false;

window.onload = async function () {
    // 转为列表模式
    await sleep(PAGE_LOADING_DELAY);
    user_article_prepared = true;
}

async function user_article_wait4() {
    try {
        while (!user_article_prepared) {
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
const USER_ARTICLE_ARTICLES = "c-wiz[jsrenderer='optrU'][class='Vlf0vb'][data-n-prms][data-p][jscontroller='uzO99c'][jsdata] main > div[class='lBwEZb BL5WZb GndZbb'] > div";
const USER_ARTICLE_SOURCE = "c-wiz[jsrenderer='xz9Esf'][class='MNK4Vd'][data-n-prms][data-p][jscontroller='NM85mf'][jsdata] div[class='xMjzl'] > h2";
const USER_ARTICLE_TIME = "div[class='QmrVtf RD0gLb kybdz'] > div[class='SVJrMe'] > time";
const USER_ARTICLE_TITLE = "a[href][class='DY5T1d RZIKme']";
const USER_ARTICLE_SUBARTICLES = "article";
const USER_ARTICLE_FOLLOW = "c-wiz[jsrenderer='xz9Esf'][class='MNK4Vd'][data-n-prms][data-p][jscontroller='NM85mf'][jsdata] div[class='MSFRuc RVtn3c'] div[role='button']";
/***************************************************************************************************
 * Part 03：surface相关的功能函数。注意，API中的每个函数都需要在这里实现一个空的，这样可以避免在后继使用通用代码时调用
 * 到无效函数产生错误。另外，surface中的函数尽量保证单一功能。
 **************************************************************************************************/
//TODO 翻页后采集到的还是之前的curr页面
async function user_article_jump(to) { // 只能逐个翻页
    return 0;
}

async function user_article_more() {
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

function user_article_focus(articleIndex) {
    try{
        let article_list = get_article_elements(USER_ARTICLE_ARTICLES, USER_ARTICLE_SUBARTICLES);
        let focus_article = article_list[articleIndex];
        focus_article.scrollIntoView({
            behavior:'smooth',block:"center"
        });
        return 0;
    }catch (e){
        return 1;
    }
}

function user_article_select(articleIndex) {
    try{
        let article_list = get_article_elements(USER_ARTICLE_ARTICLES, USER_ARTICLE_SUBARTICLES);
        let focus_article = article_list[articleIndex];
        let url = focus_article.querySelector("a").getAttribute("href");
        window.open(url);
        return 0;
    }catch (e){
        return 1;
    }
}

function user_article_getArticleList() {
    try{
        let article_info_list = [];
        let article_list = get_article_elements(USER_ARTICLE_ARTICLES, USER_ARTICLE_SUBARTICLES);
        for(let i = 0; i < article_list.length; i++){
            let article_info = emptyArticle();
            console.log(article_list[i]);
            article_info.articleHTML = article_list[i];
            article_info.articleDevice = "pc";
            let url = article_list[i].querySelector("a[href]").getAttribute("href");
            article_info.articleURL = url.replace("./articles/","https://news.google.com/articles/");
            console.log(article_info.articleURL);
            article_info.articleID = article_info.articleURL.split("/articles/")[1].split("?hl=en")[0];
            article_info.articleAuthorName = document.querySelector(USER_ARTICLE_SOURCE).innerText;
            article_info.articleSource = article_info.articleAuthorName;
            article_info.articlePostingTime = article_list[i].querySelector(USER_ARTICLE_TIME).getAttribute("datetime");
            article_info.articleTitle = article_list[i].querySelector(USER_ARTICLE_TITLE);
            article_info_list.push(article_info);
        }
        console.log(article_info_list);
        return article_info_list;
    }catch (e){
        return 1;
    }
}

function user_article_comment(articleIndex, commentText) {
    return 0;
}

function user_article_like(articleIndex, cancel) {
    return 0;
}

function user_article_forward(articleIndex) {
    return 0;
}

function user_article_collect(articleIndex, cancel) {
    return 0;
}

function user_article_follow(articleIndex, cancel) {
    try{
        let follow_button = document.querySelector(USER_ARTICLE_FOLLOW);
        let follow_flag = follow_button.getAttribute("class");
        if(!cancel && follow_flag === "U26fgb YOnsCc waNn5b ZqhUjb ztUP4e RF3lAd cd29Sd dHeVVb V3dfMc lSLCF MDgEWb M9Bg4d"){
            follow_button.click();
            return 0;
        }else if(cancel && follow_flag === "U26fgb YOnsCc waNn5b ZqhUjb ztUP4e RF3lAd cd29Sd dHeVVb V3dfMc lSLCF MDgEWb M9Bg4d KKjvXb"){
            follow_button.click();
            return 0;
        }
        return 0;
    }catch (e){
        return 1;
    }
}