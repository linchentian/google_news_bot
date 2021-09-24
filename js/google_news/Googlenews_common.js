const PAGE_LOADING_DELAY = 3000;
const CONTENT_LOADING_DELAY = 1500;
const LONG_DELAY = 5000;
const ACTION_DELAY = 500;

function get_article_elements(selector, sub_selector){
    let article_div_list = document.querySelectorAll(selector);
    let article_list = [];
    for(let i = 0; i < article_div_list.length; i++){
        let article = article_div_list[i];
        if(article.getAttribute("class") === "NiLAwe mi8Lec  gAl5If jVwmLb Oc0wGc R7GTQ keNKEd j7vNaf nID9nc"){//可展开新闻
            let sub_articles = article.querySelectorAll("article[jsmodel][jslog]");
            for(let j = 0; j < sub_articles.length; j++){
                let sub_article = sub_articles[j];
                article_list.push(sub_article);
            }
        }
        else if(article.getAttribute("class") === "NiLAwe y6IFtc R7GTQ keNKEd j7vNaf nID9nc"){//不可展开新闻
            article_list.push(article);
        }
        else if(article.getAttribute("class") === "NiLAwe mi8Lec  jzZQmc Oc0wGc R7GTQ keNKEd j7vNaf" && i !== 0){
            let sub_articles = article.querySelectorAll(sub_selector);
            for(let j = 0; j < sub_articles.length; j++){
                let sub_article = sub_articles[j];
                article_list.push(sub_article);
            }
        }
    }
    return article_list;
}