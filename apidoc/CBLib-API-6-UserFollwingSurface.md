### 6\.1\. jump函数

**函数功能**

> 在用户关注界面，对内容进行翻页操作。

**语法**

> page = jump(to)

**参数**

> |参数|必要|类型|默认值|说明
> |:-|:-:|:-|:-|:-|
> |to|√|int|-1|目标页码，页面范围从1开始，to=0代表下一页；to=-1代表不实际跳页，只返回当前页码和最大页码；to=-2代表去向尾页|

**返回值**
> 返回值page为一个Json对象（在Java中使用JsonObject），用户文章要成员字段如下表：
> |字段|类型|说明
> |:-|:-|:-|
> |current|int|当前页码|
> |max|int|最大页码|
> |err|int|err=0代表翻页成功；err>0代表翻页失败，具体如下表定义：|

> |错误码|意义|
> |:-|:-|
> |0|成功|
> |1|不在用户关注界面|
> |2|获取当前页码失败|
> |3|获取最大页码失败|

> 返回值page的例子如下表：
> ``` json
> {
>   "current": 2,
>   "max": 100,
>   "err": 0
> }
> ```

**调用示例**
> ```javascript
> page = jump(-1);
> ```
>
> 返回 ```page = {"current": 2, "max": 100, "err": 0}```

---

### 6\.2\. more函数

**函数功能**
> 在用户关注界面，对内容进行下滚操作，以获取更多的内容项（Item，在不同界面Item可以是Article、User或者Comment等）。

**语法**
> items = more()

**参数**
无

**返回值**
> 返回值items为一个Json对象（在Java中使用JsonObject），用户文章要成员字段如下表：
> |字段|类型|说明
> |:-|:-|:-|
> |preNum|int|执行more之前的item数量|
> |postNum|int|执行more之后的item数量|
> |prePageLength|int|执行more之前的页面长度|
> |postPageLength|int|执行more之后的页面长度|
> |err|int|err=0代表下滚获取成功；err>0代表下滚获取失败，具体如下表定义：|

> |错误码|意义|
> |:-|:-|
> |0|成功|
> |1|不在用户关注界面|
> |2|item数量未增加，或页面长度未变化|

> 返回值items的例子如下表：
> ``` json
> {
>   "preNum": 10,
>   "postNum": 15,
>   "prePageLength": 800,
>   "postPageLength": 1040,
>   "err": 0
> }
> ```

**调用示例**
> ```javascript
> items = more();
> ```
>
> 返回 ```items = {"preNum": 10, "postNum": 15, "err": 0}```

---

### 6\.3\. focus函数

**函数功能**
> 在用户文章界面，将可视区域移动到特定的item处，依据item的序列号（本页第几个item，用户关注页面中可以是第几个用户的位置、或社团位置）。

**语法**
> err = focus(itemIndex)

**参数**
> |参数|必要|类型|默认值|说明
> |:-|:-:|:-|:-|:-|
> |itemIndex|√|int|0|聚焦的item的序列号，启示序列号是0|

**返回值**
> |错误码|意义|
> |:-|:-|
> |0|聚焦成功|
> |1|页面未变化|

**调用示例**
> ```javascript
> err = focus();
> ```
>
> 返回 ```err = 0```

---
### 6\.4\. getUserList函数

**函数功能**

> 获得本页目前所包含的所有User对象的列表。

**语法**
> users = getUserList()

**参数**
无

**返回值**

> user对象的列表。如果列表为空或者null，则代表发成错误。

**调用示例**
> ```javascript
> articles = getArticleList();
> ```
>
> ``` json
> users = [
>   {"userID":"user1", ...},
>   {"userID2":"user2", ...}
> ]
> ```

---

### 6\.5\. follow函数

**函数功能**
> 关注一条在用户关注列表的用户。

**语法**
> err = follow(UserIndex)

**参数**
> |参数|必要|类型|默认值|说明
> |:-|:-:|:-|:-|:-|
> |userIndex|√|int|0|目标user的序列号，起始序列号是0|

**返回值**
> |错误码|意义|
> |:-|:-|
> |0|关注成功|
> |1|关注失败|
> |2|本平台无关注操作|

**调用示例**
> ```javascript
> err = follow(1);
> ```
>
> 返回 ```err = 0```

---