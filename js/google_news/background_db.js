let db = null;

function openDB(dbName) {
    const request = window.indexedDB.open(dbName);

    request.onerror = function (event) {
        console.log("Problem opening DB.");
    }

    // 创建表格必须放在这个地方
    request.onupgradeneeded = function(event) {
        db = event.target.result;
        // 创建用户表，用于存放偏好用户信息
        console.log(JSON.stringify(db.objectStoreNames));
        if (!db.objectStoreNames.contains('User')) {
            let userStore = db.createObjectStore("User", {keyPath: "userName"});
            userStore.transaction.oncomplete = function (event) {
                console.log("User Table Created.");
            }
        }
        // 创建Article表，用于记录曝光和阅读的Article
        if (!db.objectStoreNames.contains('Article')) {
            let articleStore = db.createObjectStore("Article", {keyPath: "logID", autoIncrement: true});
            articleStore.transaction.oncomplete = function (event) {
                console.log("Article Table Created.");
            }
        }
    }

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("DB OPENED.");
        db.onerror = function (event) {
            // console.log("FAILED TO OPEN DB.")
        }
    }
}

function insertData(tableName, records) {
    if (db) {
        const insert_transaction = db.transaction(tableName, "readwrite");
        const objectStore = insert_transaction.objectStore(tableName);

        return new Promise((resolve, reject) => {
            insert_transaction.oncomplete = function () {
                // console.log("ALL INSERT TRANSACTIONS COMPLETE.");
                resolve(true);
            }

            insert_transaction.onerror = function () {
                // console.log("PROBLEM INSERTING RECORDS.")
                resolve(false);
            }

            records.forEach(person => {
                let request = objectStore.add(person);

                request.onsuccess = function () {
                    // console.log("Added: ", person);
                }
            });
        });
    }
}

function getData(tableName, key) {
    if (db) {
        const get_transaction = db.transaction(tableName, "readonly");
        const objectStore = get_transaction.objectStore(tableName);

        return new Promise((resolve, reject) => {
            get_transaction.oncomplete = function () {
                // console.log("ALL GET TRANSACTIONS COMPLETE.");
            }

            get_transaction.onerror = function () {
                // console.log("PROBLEM GETTING RECORDS.")
            }

            let request = objectStore.get(key);

            request.onsuccess = function (event) {
                resolve(event.target.result);
            }
        });
    }
}

async function logArticle(articles, eov) {
    let curr = new Date().getTime();
    for (let i = 0; i < articles.length; i++) {
        articles[i].recordDate = curr;
        articles[i].exposedOrViewed = eov;
    }
    return insertData("Article", articles);
}

async function hasUser(userName) {
    let c = await getData("User", userName);
    return !!c;
}

async function addUsers(users) {
    let candidate = [];
    for (let i = 0; i < users.length; i++) {
        if (!await hasUser(users[i].userName)) {
            candidate.push(users[i]);
        }
    }
    return insertData("User", candidate);
}



