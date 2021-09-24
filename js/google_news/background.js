/***************************************************************************************************
 * Part 01：定义常量
 **************************************************************************************************/
const PAGE_HOME = "https://news.google.com/foryou?hl=en-US&*";
const PAGE_CATEGORY = "https://news.google.com/topics/*";
const PAGE_USER = "https://news.google.com/publications/*";
const PAGE_SEARCH = "https://news.google.com/search?*";
const PAGE_LOADING_DELAY = 3000;
const CONTENT_LOADING_DELAY = 1500;
const LONG_DELAY = 5000;
const SHORT_DELAY = 200;
const ACTION_DELAY = 500;

const CATEGORIES = [
    {
        "url":"https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen",
        "name":"Business",
        "subCategories":[
            {
                "url":"https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB/sections/CAQiSENCQVNNQW9JTDIwdk1EbHpNV1lTQW1WdUdnSlZVeUlQQ0FRYUN3b0pMMjB2TUdkbWNITXpLZ3NTQ1M5dEx6Qm5abkJ6TXlnQSoqCAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVABUAE?hl=en-US&gl=US&ceid=US%3Aen",
                "name":"Economy"
            }
        ]
    },
    {
        "url":"https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen",
        "name":"Technology",
        "subCategories":[
            {
                "url":"https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB/sections/CAQiYkNCQVNRd29JTDIwdk1EZGpNWFlTQW1WdUdnSlZVeUlPQ0FRYUNnb0lMMjB2TURVd2F6Z3FId29kQ2hsTlQwSkpURVZmVUVoUFRrVmZVMFZEVkVsUFRsOU9RVTFGSUFFb0FBKioIAComCAoiIENCQVNFZ29JTDIwdk1EZGpNWFlTQW1WdUdnSlZVeWdBUAFQAQ?hl=en-US&gl=US&ceid=US%3Aen",
                "name":"Mobile"
            }
        ]
    }
]

/***************************************************************************************************
 * Part 02：每个background都依赖的函数，只能每个background都复制一份。
 **************************************************************************************************/
async function getTabId(url) {
    let returned = false;
    let id = null;
    await chrome.tabs.query({url: url},
        function (tabs) {
            if (tabs.length > 0) {
                id = tabs[0].id;
            }
            returned = true;
        });
    while (!returned) {
        await sleep(100);
    }
    return id;
}

// 这里存放大家都需要用到的js的操作，比如点击、上滚、获取文本，所有操作使用css selector
async function sleep(time) {
    return new Promise(function(resolve, reject) {
        window.setTimeout(function () {
            resolve();
        }, time);
    });
}

function randNorm(mean, std) {
    let u = 0.0, v = 0.0, w = 0.0, c;
    do {
        u = Math.random() * 2 - 1.0;
        v = Math.random() * 2 - 1.0;
        w = u * u + v * v;
    } while(w === 0.0 || w >= 1.0);
    c = Math.sqrt((-2 * Math.log(w)) / w);
    let a = u * c;
    return mean + (a * std);
}

function randNormPosInt(mean, std) {
    let r;
    do {
        r = parseInt(randNorm(mean, std));
    } while (r <= 0);
    return r;
}

function randDiscrete(weights) {
    let s = 0.0;
    weights.forEach(w => {s += w});
    let x = Math.random();
    for (let i = 0, c = 0.0; i < weights.length; i++) {
        c += weights[i];
        if (x <= c/s) {
            return i;
        }
    }
    return weights.length - 1;
}

// 异步跨域代码执行
async function callAsync(id, code) {
    let result = null;
    let finished = false;
    chrome.tabs.sendMessage(
        id,
        {cmd: 'exec', code: code},
        function (response) {
            console.log("已返回: " + response);
            result = response;
            finished = true;
        });
    while (!finished) {
        await sleep(250);
    }
    return result;
}

// 同步跨域代码执行，这里的code不能包含await和async
async function call(id, code) {
    let result = null;
    let finished = false;
    chrome.tabs.executeScript(
        id,
        {code: code},
        function (r) {
            console.log("正常返回: " + r); // Example
            if (r) {
                result = r[0];
            }
            finished = true;
        });
    while (!finished) {
        await sleep(250);
    }
    return result;
}


