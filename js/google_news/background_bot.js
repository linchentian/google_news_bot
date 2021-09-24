startBot().then(r => console.log(r + "Bot Ended!"));

const params = {
    feeding_date : ["26/08/2021", "27/08/2021", "28/08/2021", "29/08/2021", "30/08/2021", "31/08/2021", "22/9/2021","2021/9/22"],
    attacking_date : ["26/08/2021", "27/08/2021", "28/08/2021", "29/08/2021", "30/08/2021", "31/08/2021", "22/9/2021","2021/9/22"],
    active_time : [9,10,11,12,13,14,15,18,19,20,21,22,23],
    pausing_mean : 50,
    pausing_std : 10,
    pausing_threshold : 20,
    pausing_threshold : 20,
    working_mean : 30,
    working_std : 5,
    repeating_mean: 5,
    repeating_std: 3,
    s0 : 100,
    s1 : 10,
    s2 : 20,
    s3 : 30,
    s4 : 50,
    attack_rate : 0.5,
    following_list : [{userID:"CAAqKQgKIiNDQklTRkFnTWFoQUtEbUppWXk1amJ5NTFheTl1WlhkektBQVAB",userName:"BBC News"},{userID: "CAAqBwgKMKHL9QowkqbaAg",userName: "CNN"}],
    category_list : [{name:"Business",subname:"Economy"}, {name:"Technology",subname:"Mobile"}],
    category_weights : [5, 5],
    keywords_list : ["transformer", "Biden"],
    search_words_list : ["transformer", "Biden"],
    attack_target_list : [{userID:"CAAqBwgKMLyGggsw58X-Ag",userName:"NBC News"}]
};

let homeTabId;

async function viewArticle(articleTab) {
    try{
        // 获取视频长度
        console.log("开始观看");
        let returned = false;
        // 浏览视频，最多85%的时间
        // await chrome.tabs.query({}, tabs => console.log(tabs));
        let aimedUrl = ""
        while(!returned){
            await sleep(60000);
            await chrome.tabs.query({}, tabs => {
                // console.log(tabs);
                for(let i = 0; i < tabs.length; i++){
                    if (!tabs[i].url.includes("news.google") && tabs[i].url !== "chrome://extensions/"){
                        aimedUrl = tabs[i].url.toString();
                        // console.log(aimedUrl);
                        new Promise(resolve => {
                            let articleId = getTabId(aimedUrl);
                            console.log(articleId);
                            sleep(2000);
                            resolve(articleId);
                        }).then(async articleId => {
                            // console.log(articleId);
                            await sleep(5 * 60 * 1000);
                            await call(articleId, "window.close();");
                            returned = true;
                        })
                        break;
                    }
                }
            });
        }
        return 0;
    }catch (e){
        return 1;
    }

}


async function randomSleep() {
    await sleep ((randNormPosInt(4, 2) + 3) * 1000);
}

async function startBot() {
    /****** [S00] 打开数据库，并将候选关注用户加入到数据库 ******/
    console.log("创建数据库");
    openDB("GOOGLENEWS_EXPERIMENT_BOT_TEST");
    await sleep(2000);
    await addUsers(params.following_list);
    await sleep(LONG_DELAY);
    console.log("确认关注者已经添加：" + await hasUser(params.following_list[0].userName));
    /****** [E00] 打开数据库，并将候选关注用户加入到数据库 ******/

    /****** [S00] 等待出现首页，启动机器人，并记录homeTabId ******/
    while (!(homeTabId = await getTabId(PAGE_HOME))) {
        console.log("无主页");
        await sleep(SHORT_DELAY);
    }
    console.log("10秒后启动机器人");
    await sleep(2000);
    /****** [E00] 等待出现首页，启动机器人，并记录homeTabId ******/

    // 加载要关注的对象
    let candidate = JSON.parse(localStorage.getItem("googlenews_candidates"));
    console.log(candidate);
    if(candidate === null || candidate.length === 0) {
        console.log(params.following_list);
        candidate = JSON.parse(JSON.stringify(params.following_list));
        localStorage.setItem("googlenews_candidates", JSON.stringify(params.following_list));
    }
    console.log("关注候选者剩余" + candidate.length);

    // 机器人启动主循环
    while(true) {
        // 功能必须放在try-catch里，否则主线出现异常机器人就会停止
        try {
            /****** [S01] 判断是否处于实验日，如不在则循环等待 ******/
            while (!params.feeding_date.includes(new Date().toLocaleDateString())) {
                await sleep(1000 * 60 * 60); // 每小时判断一次就够了
                console.log("实验日判断");
            }
            /****** [E01] 判断是否处于实验日，如不在则循环等待 ******/

            /****** [S02] 判断是否在平台操作的活跃时间，如不在则循环等待 ******/
            while (!params.active_time.includes(new Date().getHours())) {
                await sleep(1000 * 60); // 每分钟判断一次
                console.log("活跃时间判断");
            }
            /****** [E02] 判断是否在平台操作的活跃时间，如不在则循环等待 ******/

            // 开始活跃，进入活跃中的暂定周期
            /****** [S03] 暂停周期 ******/
            let pausingTime = randNormPosInt(params.pausing_mean, params.pausing_std);
            if (pausingTime >= params.pausing_threshold) {
                // 长时间等待，关闭网站
                console.log("长暂停，离开网站");
                pausingTime = 1; // TODO for debug
                // await switch2Blank(homeTabId); // TODO 这里如何去向了未加载surface的页面，将无法进行通讯，所以暂时不离开
            }
            // 等待
            console.log("暂停，休息" + pausingTime + "分钟 FROM " + new Date().toLocaleString());
            await sleep(0.1 * 60 * 1000); // TODO 暂时不暂停
            /****** [E03] 暂停周期 ******/

                // 产生工作时长
            let workingStart = Date.now();
            let workingTime = randNormPosInt(params.working_mean, params.working_std) * 60 * 1000;
            console.log("工作时长" + workingTime/1000/60 + "分钟 FROM" + new Date().toLocaleString());
            do {
                // 判断操作类型
                let op = randDiscrete([(candidate.length===0)?0:params.s0, params.s1, params.s2, params.s3, params.s4]);
                // op = 3; // TODO for debug
                console.log("选择的操作为 S" + op);

                // 开始连续相同操作
                try {
                    /****** [S04] 关注一个列表中的用户 ******/
                    if (op === 0 && candidate.length > 0) {
                        // 前往用户页面
                        console.log("前往用户页面");
                        await switch2UserArticle(homeTabId, candidate[0].userID);
                        await randomSleep();
                        // 关注
                        console.log("关注用户");
                        await callAsync(homeTabId, "await user_article_follow(false);");
                        await randomSleep();
                        // 删除已关注
                        candidate.shift();
                        localStorage.setItem("googlenews_candidates", JSON.stringify(candidate));
                    }
                    /****** [E04] 关注一个列表中的用户 ******/

                        // 获得连续相同操作的次数量
                    let repeatingNum = randNormPosInt(params.repeating_mean, params.repeating_std);

                    /****** [S05] 首页推荐阅读 ******/
                    if (op === 1) {
                        console.log("S1推荐阅读" + repeatingNum + "次");
                        await switch2Home(homeTabId);
                        await sleep(LONG_DELAY);
                        while (repeatingNum-- > 0) {
                            console.log("重复次数剩余" + repeatingNum);
                            for (let i = 0; i < 5; i++) { // 如果刷新了5次还没有找到可看视频，则算完成一次
                                await callAsync(homeTabId, "await home_more();");
                                console.log("获取当前推荐内容");
                                let articles = await call(homeTabId, "home_getArticleList();");
                                console.log(articles);
                                await logArticle(articles, 0);
                                let viewed = false;
                                for (let j = 0; j < articles.length; j++) {
                                    if (true) {//await hasUser(articles[j].articleAuthorName)
                                        console.log("找到可看用户：");
                                        // 切换到视频页面
                                        let articleTab = await switchByArticleSelection(homeTabId, "home", j);
                                        await randomSleep();
                                        await logArticle([articles[j]], 1);
                                        await viewArticle(articleTab);
                                        viewed = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    /****** [E05] 首页推荐阅读 ******/

                    /****** [S06] 分类阅读 ******/
                    if (op === 2) {
                        console.log("S2子分类阅读" + repeatingNum + "次");
                        // 选择一个子分类
                        let cid = randDiscrete(params.category_weights);
                        console.log("选择子分类：" + JSON.stringify(params.category_list[cid]));
                        // 前往子分类页面
                        console.log("观看"+params.category_list[cid].name+"分类");
                        await switch2SubCategory(homeTabId, params.category_list[cid].name, params.category_list[cid].subname);
                        await randomSleep();
                        while (repeatingNum-- > 0) {
                            console.log("重复次数剩余" + repeatingNum);
                            // 随机翻0~3页
                            let m = 0 | (Math.random() * 4);
                            let cArticles;
                            while (m-- > 0) {
                                console.log("记录看到的视频作者，翻页次数剩余" + m);
                                cArticles = await call(homeTabId, "sub_category_getArticleList();");
                                let users = [];
                                for (let i = 0; i < cArticles.length; i++) {
                                    users.push({userName:cArticles[i].articleAuthorName, userID:cArticles.articleAuthorID});
                                }
                                await addUsers(users);
                                await callAsync(homeTabId, "await" +
                                    " sub_category_more();");
                                console.log("翻页");
                                await randomSleep();
                            }
                            // 前往观看一个视频
                            if (cArticles) {
                                let k = 0 | (Math.random() * cArticles.length);
                                console.log("观看一个视频" + k);
                                let articleRead = await switchByArticleSelection(homeTabId, "category", k);
                                await randomSleep();
                                await logArticle([cArticles[k]], 1);
                                if(!articleRead){
                                    await viewArticle(articleRead);
                                }
                            }
                        }
                    }
                    /****** [E06] 分类阅读 ******/

                    /****** [S07] 搜索阅读 ******/
                    if (op === 3) {
                        console.log("S3搜索阅读" + repeatingNum + "次");
                        // 选择一个关键词
                        let keyword = params.search_words_list[0 | (Math.random() * params.search_words_list.length)];
                        console.log("搜索关键词：" + keyword);
                        // 前往搜索页面
                        await switch2ArticleSearch(homeTabId, [keyword]);
                        await sleep(LONG_DELAY);
                        while (repeatingNum-- > 0) {
                            console.log("重复次数剩余" + repeatingNum);
                            // 随机翻0~3页
                            let m = 0 | (Math.random() * 4);
                            while (m-- > 0) {
                                await callAsync(homeTabId, "await article_search_more();");
                                console.log("翻页，剩余次数" + m);
                                await randomSleep();
                            }
                            let searchArticles = await call(homeTabId, "article_search_getArticleList();");
                            // 前往观看一个视频
                            if (searchArticles) {
                                console.log("观看一个视频");
                                let k = 0 | (Math.random() * searchArticles.length);
                                let articleRead = await switchByArticleSelection(homeTabId, "article_search", k);
                                console.log(articleRead);
                                await randomSleep();
                                await logArticle([searchArticles[k]], 1);
                                if(!articleRead){
                                    await viewArticle(articleRead);
                                }
                            }
                        }
                    }
                    /****** [E07] 搜索阅读 ******/

                    /****** [S08] 关注者阅读 ******/
                    if (op === 4) {
                        console.log("S4关注者阅读" + repeatingNum + "次");
                        // 选择一个关注者
                        let fn = params.following_list[0 | (Math.random() * params.following_list.length)];
                        console.log("选择关注者：" + JSON.stringify(fn));
                        // 前往用户文章页面
                        await switch2UserArticle(homeTabId, fn.userID);
                        await randomSleep();
                        while (repeatingNum-- > 0) {
                            console.log("重复次数剩余" + repeatingNum);
                            // 是否翻页
                            if (Math.random() < 0.3) {
                                await callAsync(homeTabId, "await" +
                                    " user_article_more();");
                                console.log("翻页");
                                await randomSleep();
                            }
                            // 获取内容
                            let userArticles = await call(homeTabId, "user_article_getArticleList();");
                            // 前往观看一个视频
                            console.log("观看一个文章");
                            let k = 0 | (Math.random() * userArticles.length);
                            let articleRead = await switchByArticleSelection(homeTabId, "user_article", k);
                            console.log(articleRead);
                            await randomSleep();
                            if(!articleRead){
                                await viewArticle(articleRead);
                            }
                        }
                    }
                    /****** [E08] 搜索阅读 ******/

                    /****** [S09] 攻击 ******/
                    if (params.attacking_date.includes(new Date().toLocaleDateString()) && Math.random() < params.attack_rate) {
                        console.log("执行攻击" + repeatingNum + "次");
                        // 选择一个关键词
                        let an = params.attack_target_list[0 | (Math.random() * params.attack_target_list.length)];
                        console.log("选择目标：" + JSON.stringify(an));
                        // 前往用户文章页面
                        await switch2UserArticle(homeTabId, an.userID);
                        await randomSleep();
                        while (repeatingNum-- > 0) {
                            console.log("攻击重复次数剩余" + repeatingNum);
                            // 是否翻页
                            if (Math.random() < 0.3) {
                                await callAsync(homeTabId, "await" +
                                    " user_article_more();");
                                console.log("翻页");
                                await randomSleep();
                            }
                            // 获取内容
                            let userArticles = await call(homeTabId, "user_article_getArticleList();");
                            // 前往观看一个视频
                            console.log("观看一个视频");
                            let k = 0 | (Math.random() * userArticles.length);
                            let articleRead = await switchByArticleSelection(homeTabId, "user_article", k);
                            console.log(articleRead);
                            await randomSleep();
                            if(!articleRead){
                                await viewArticle(articleTab);
                            }
                        }
                    } else {
                        console.log("不执行攻击");
                    }
                    /****** [S09] 攻击 ******/
                } catch (e) {
                    console.log("ERROR-1" + JSON.stringify(e));
                    // await sleep(10 * 60 * 1000);
                }
                await sleep(LONG_DELAY);
            } while (Date.now() < (workingStart + workingTime));
        } catch (e) {
            console.log("ERROR-0" + JSON.stringify(e));
        }
    }
}

/**
 * 基础功能测试函数
 */
async function functionalTest() {
    let homeTabId;

    // 等待出现首页
    while (!(homeTabId = await getTabId(PAGE_HOME))) {
        console.log("无主页");
        await sleep(SHORT_DELAY);
    }

    console.log(homeTabId);
    console.log("10秒后启动机器人");
    await sleep(10000);

    //--------------------------------------------------------------------------------------------//
    ////////////////////////////////////// 测试各个Surface功能 ///////////////////////////////////////
    //--------------------------------------------------------------------------------------------//

    //------------------------------------HomeSurface----------------------------------------//
    console.log("测试more");
    let result = await callAsync(homeTabId, "home_more();");
    console.log("测试getArticle");
    let articles = await callAsync(homeTabId, "home_getArticleList();");
    console.log(articles);
    await sleep(2000);
    let focus_number = parseInt(Math.random() * articles.length);
    console.log("测试focus");
    await callAsync(homeTabId, "home_focus(" + String(focus_number) + ");");
    await sleep(2000);
    console.log("测试select");
    await call(homeTabId, "home_select(" + String(focus_number) + ");")
    await sleep(2000);
    await getTabId(PAGE_HOME);
    //------------------------------------ArticleSurface----------------------------------------//

    //无article界面

    //------------------------------------CategorySurface----------------------------------------//
    // await switch2Category(homeTabId, "Business");
    // let categoryID = await getTabId(PAGE_CATEGORY);
    // if(categoryID !== homeTabId){
    //     console.log("页面已跳转至：" + String(categoryID));
    // }
    // await sleep(2000);
    // console.log("测试more");
    // let articles = await callAsync(categoryID, "category_more();");
    // console.log(articles);
    // let focus_number = parseInt(Math.random() * articles.postNum);
    // console.log("测试focus:" + String(focus_number));
    // await callAsync(categoryID, "category_focus(" + String(focus_number) + ")");
    // await sleep(2000);
    // console.log("测试select");
    // await callAsync(categoryID, "category_select(" + String(focus_number) + ");");
    // await sleep(2000);
    // console.log("测试getArticle");
    // await call(categoryID, "category_getArticleList();");
    //-----------------------------------UserArticleSurface--------------------------------------//
    // 前往用户视频页面
    // console.log("前往用户页面");
    // await switch2UserArticle(homeTabId,'CAAqKQgKIiNDQklTRkFnTWFoQUtEbUppWXk1amJ5NTFheTl1WlhkektBQVAB');
    // await sleep(1000);
    // let userTabId = await getTabId(PAGE_USER);
    // console.log("到达用户页面");
    // let user_articles = await callAsync(userTabId, "user_article_more()");
    // await sleep(2000);
    // let focus_number = parseInt(Math.random() * user_articles.postNum);
    // console.log("测试focus");
    // await call(userTabId, "user_article_focus(" + String(focus_number)  + ");");
    // await sleep(2000);
    // console.log("测试select");
    // await call(userTabId, "user_article_select(" + String(focus_number) + ");");
    // await sleep(2000);
    // console.log("测试getArticle");
    // await call(userTabId, "user_article_getArticleList();");
    // console.log("测试follow");
    // await call(userTabId, "user_article_follow(0, false);");

    //-----------------------------------ArticleSearchSurface------------------------------------//
    // console.log("前往搜索页面");
    // await switch2ArticleSearch(homeTabId,'transformer');
    // await sleep(1000);
    // let searchTabId = await getTabId(PAGE_SEARCH);
    // console.log("到达搜索页面");
    // let user_articles = await callAsync(searchTabId, "article_search_more()");
    // await sleep(2000);
    // let focus_number = parseInt(Math.random() * user_articles.postNum);
    // console.log("测试focus");
    // await callAsync(searchTabId, "article_search_focus(" + String(focus_number)  + ");");
    // await sleep(2000);
    // console.log("测试select");
    // await callAsync(searchTabId, "article_search_select(" + String(focus_number) + ");");
    // await sleep(2000);
    // console.log("测试getArticle");
    // await callAsync(searchTabId, "article_search_getArticleList();");
    //-----------------------------------UserSurface------------------------------------//



    //-----------------------------------SubCategorySurface------------------------------------//
    // await switch2SubCategory(homeTabId, "Technology","Mobile");
    // let categoryID = await getTabId(PAGE_CATEGORY);
    // if(categoryID !== homeTabId){
    //     console.log("页面已跳转至：" + String(categoryID));
    // }
    // await sleep(2000);
    // console.log("测试more");
    // let articles = await callAsync(categoryID, "sub_category_more();");
    // console.log(articles);
    // let focus_number = parseInt(Math.random() * articles.postNum);
    // console.log("测试focus:" + String(focus_number));
    // await callAsync(categoryID, "sub_category_focus(" + String(focus_number) + ")");
    // await sleep(2000);
    // console.log("测试select");
    // await callAsync(categoryID, "sub_category_select(" + String(focus_number) + ");");
    // await sleep(2000);
    // console.log("测试getArticle");
    // await call(categoryID, "sub_category_getArticleList();");
    // await sleep(2000);
    // console.log("测试follow");
    // await call(categoryID, "sub_category_follow(0, false);");

    //-----------------------------------数据库测试------------------------------------//
    // console.log("创建数据库");
    // openDB("TEST-DB");
    // await sleep(10000);
    //
    // console.log("插入一组用户");
    // let r = await addUsers([
    //     {userName: "123", nick: "张三"},
    //     {userName: "124", nick: "李四"},
    //     {userName: "125", nick: "王五"},
    //     {userName: "126", nick: "赵六"},
    //     {userName: "127", nick: "刘七"},
    // ]);
    // console.log(r);
    // await sleep(10000);
    //
    // console.log("查找用户数据");
    // let q1 = await getData("User", "125");
    // if (q1) {
    //     console.log("找到-存在的数据：" + JSON.stringify(q1));
    // } else {
    //     console.log("未找到-存在的数据：" + q1);
    // }
    // await sleep(2000);
    // let q2 = await getData("User", "128");
    // if (q2) {
    //     console.log("找到-不存在的数据：" + JSON.stringify(q2));
    // } else {
    //     console.log("未找到-不存在的数据：" + q2);
    // }
    //
    // console.log("插入一组含有重复用户");
    // let r4 = await addUsers([
    //     {userName: "123", nick: "张三"},
    //     {userName: "128", nick: "钱八"}
    // ]);
    // console.log(r4);
    // await sleep(10000);
    //
    // console.log("插入一组文章日志");
    // let r2 = await logArticle([
    //     {articleID: "67", text: "文章内容1"},
    //     {articleID: "68", text: "文章内容2"},
    //     {articleID: "69", text: "文章内容3"},
    //     {articleID: "70", text: "文章内容4"},
    //     {articleID: "71", text: "文章内容5"},
    // ], 1);
    // console.log(r2);
    // await sleep(10000);
    //
    // console.log("再插入部分相同文章日志");
    // let r3 = await logArticle([
    //     {articleID: "67", text: "文章内容1"},
    //     {articleID: "68", text: "文章内容2"},
    // ], 1);
    // console.log(r3);
    // await sleep(10000);
}