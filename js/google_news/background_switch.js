async function switch2Blank(tabID) {
    await call(tabID, "location.href='https://news.google.com/';");
    await sleep(PAGE_LOADING_DELAY);
    return 0;
}

async function switchBack(tabID) {
    chrome.tabs.goBack(tabID);
    await sleep(PAGE_LOADING_DELAY); // 等待对应的surface文件加载
    return 0;
}

async function switch2Home(tabID) {
    await call(tabID, "location.href='https://news.google.com/foryou?hl=en-US&gl=US&ceid=US%3Aen';");
    // 等待页面加载和预处理完成
    await sleep(PAGE_LOADING_DELAY); // 等待对应的surface文件加载
    return await callAsync(tabID, "await home_wait4();");
}

async function switch2User(tabID, userID) {
    await call(tabID, "location.href='https://news.google.com/topics/" + userID + "https://news.google.com/topics/';");
    // 等待页面加载和预处理完成
    await sleep(PAGE_LOADING_DELAY); // 必须等待页面加载
    return await callAsync(tabID, "await user_wait4();");
}

async function switch2UserArticle(tabID, userID) {
    await call(tabID, "location.href='https://news.google.com/publications/" + userID + "?hl=en-US&gl=US&ceid=US%3Aen';");
    // 等待页面加载和预处理完成
    await sleep(PAGE_LOADING_DELAY); // 必须等待页面加载
    return await callAsync(tabID, "await user_article_wait4();");
}

async function switch2ArticleSearch(tabID, keywords) {
    let url = "https://news.google.com/search?q="+keywords+"&hl=en-US&gl=US&ceid=US%3Aen";
    await call(tabID, "location.href='" + url + "';");
    // 等待页面加载和预处理完成
    await sleep(PAGE_LOADING_DELAY); // 必须等待页面加载
    return await callAsync(tabID, "await article_search_wait4();");
}

async function switch2Category(tabID, categoryName) {
    // console.log(tabID);
    // console.log(categoryName);
    for (let i = 0; i < CATEGORIES.length; i++) {
        // console.log(CATEGORIES[i].name);
        if (categoryName === CATEGORIES[i].name) {
            // console.log(CATEGORIES[i].url)
            await call(tabID, "window.location.href='" + CATEGORIES[i].url + "';");
            // 等待页面加载和预处理完成
            await sleep(PAGE_LOADING_DELAY); // 必须等待页面加载
            return await callAsync(tabID, "await category_wait4();");
        }
    }
    return 1;
}

async function switch2SubCategory(tabID, categoryName, subCategoryName) {
    for (let i = 0; i < CATEGORIES.length; i++) {
        if (categoryName === CATEGORIES[i].name) {
            for (let j = 0; j < CATEGORIES[i].subCategories.length; j++) {
                if (CATEGORIES[i].subCategories[j].name.indexOf(subCategoryName) >= 0) {
                    await call(tabID, "location.href='" + CATEGORIES[i].subCategories[j].url + "';");
                    // 等待页面加载和预处理完成
                    await sleep(PAGE_LOADING_DELAY); // 必须等待页面加载
                    return await callAsync(tabID, "await sub_category_wait4();");
                }
            }
        }
    }
    return 1;
}

async function switchByArticleSelection(tabID, surface, articleIndex) {
    await callAsync(tabID, surface.toLowerCase() + "_select(" + articleIndex + ")");
    await sleep(PAGE_LOADING_DELAY);
    let r = 0;
    if (r === 0) {
        return 0;
    } else {
        return -1;
    }
}
