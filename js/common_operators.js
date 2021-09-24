/**
 * 这里存放大家都需要用到的js的操作，比如点击、上滚、获取文本，所有操作使用css selector，以及数据结构
 */

/***************************************************************************************************
 * 通用函数
 **************************************************************************************************/
 function emptyArticle() {
    let article = {
        articleID: "",                                  //新闻ID
        articleTitle: "",                               //新闻标题
        articleSource: "",                              //新闻来源平台
        articleURL: "",
        articleDevice: "",
        articleHTML: "",                                //新闻HTML元素
        articleContent: "",                             //新闻内容
        articleCategory: "",                            //新闻类型
        articlePostingTime: "1970-01-01 00:00:00",      //新闻发布时间
        articleAuthorID: "",
        articleAuthorName: "",                          //新闻作者名字
        articleViewNum: 0,
        articleCommentNum: "",                          //新闻评论数
        articleLikeNum: 0,                              //新闻喜欢数
        articleCollectNum: 0,
        articlePosition: {
            longitude: 0.0,
            latitude: 0.0
        },
        articlePositionName: ""
    };
    return article;
}

// 这里的sleep是负责共计给content js的，background需要独立的sleep
async function sleep(time) {
    return new Promise(function(resolve, reject) {
        window.setTimeout(function () {
            resolve();
        }, time);
    });
}

/***************************************************************************************************
 * 目前只能做到将指定的文本送到剪切板中，现在common中新增该功能函数
 * text即使需要传到剪切板的文本
 * 需要在manifest里的permission新增：
 *     "clipboardWrite",
 *     "clipboardRead"
 * 两个字段
 **************************************************************************************************/
function copyText(text){ // text: 要复制的内容
    var tag = document.createElement('input');
    tag.setAttribute('id', 'cp_hgz_input');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('cp_hgz_input').select();
    document.execCommand('copy');
    document.getElementById('cp_hgz_input').remove();
}
