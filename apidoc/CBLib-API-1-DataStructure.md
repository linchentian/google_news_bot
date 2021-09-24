## 1\. 核心数据结构

### 1\.1\. Article类

> 社交媒体中的新闻、博文、微博、推文等等内容信息。

**结构字段**
> |字段|子字段|必须|类型|说明
> |:-|:-|:-|:-|:-|
> |articleID||√|string|文档唯一编号，可使用各平台原生编号|
> |articleTitle|||string|文档标题|
> |articleSource||√|string|文档来源的平台名称|
> |articleDevice|||string|文档来源的设备|
> |articleHTML||√|string|html格式的文档内容，包含了图片和一些格式信息|
> |articleContent||√|string|纯文本的文档内容|
> |articleCategory|||string|文档类型，可以使用平添的原生分类，也可以使用百度AI等文本分类工具获得，以冒号“:”间隔分类等级|
> |articlePostingTime||√|date|文档发布时间，格式yyyy-MM-dd HH:mm:ss|
> |articleAuthorID||√|string|文档发布者编号，可使用平台原生编号|
> |articleAuthorName||√|string|文档发布者名称|
> |articleCommentNum|||int|评论数|
> |articleForwardNum|||int|转发数|
> |articleLikeNum|||int|点赞数|
> |articleCollectNum|||int|收藏数|
> |articlePosition|||object|文档发布的关联地址经纬度|
> ||longitude||double|经度|
> ||latitude||double|纬度|
> |articlePositionName|||string|文档发布的关联地址名称|

**示例**
> ``` json
> {
>   "current": 2,
>   "max": 100,
>   "err": 0
> }
> ```

---

### 1\.2\. Opinion类

> 一个Article的评论、转发、弹幕等带有附加评论信息和回复结构的意见（观点）数据。

**结构字段**
> |字段|子字段|必须|类型|说明
> |:-|:-|:-|:-|:-|
> |articleID||√|string|观点所属的文档编号|
> |opinionID||√|string|观点唯一编号，可使用各平台原生编号|
> |opinionType||√|int|观点的类型：1:评论；2:转发；3:弹幕；...|
> |opinionDevice|||string|发表观点的设备|
> |opinionHTML||√|string|html格式的观点内容，包含了图片和一些格式信息，或者原始观点的json格式数据|
> |opinionContent||√|string|纯文本的观点内容|
> |opinionPostingTime|||date|观点发布时间，格式yyyy-MM-dd HH:mm:ss|
> |opinionUserID||√|string|观点发布用户编号，可使用平台原生编号|
> |opinionUserName||√|string|观点发布用户名称|
> |opinionReplyNum|||int|评论数|
> |opinionForwardNum|||int|转发数|
> |opinionLikeNum|||int|点赞数|
> |opinionCollectNum|||int|收藏数|
> |opinionPosition|||object|观点发布的关联地址经纬度|
> ||longitude||double|经度|
> ||latitude||double|纬度|
> |opinionPositionName|||string|观点发布的关联地址名称|
> |opinionParentID|||string|观点的父观点的ID，既回复了哪一个父观点|

**示例**
> ``` json
> {
>   "current": 2,
>   "max": 100,
>   "err": 0
> }
> ```

---

### 1\.3\. Attitude类

> 一个Article的点赞、收藏等带有倾向而无具体内容的态度数据。

**结构字段**
> |字段|子字段|必须|类型|说明
> |:-|:-|:-|:-|:-|
> |articleID||√|string|态度所属的文档编号|
> |attitudeID||√|string|态度唯一编号，可使用各平台原生编号|
> |attitudeType||√|int|态度的类型：1:点赞；2:收藏；...|
> |attitudeDevice|||string|发表态度的设备|
> |attitudeTag|||string|态度相关的一些表情等信息标签信息|
> |attitudePostingTime|||date|态度发布时间，格式yyyy-MM-dd HH:mm:ss|
> |attitudeUserID|||string|态度发布用户编号，可使用平台原生编号|
> |attitudeUserName|||string|态度发布用户名称|
> |previousAttitudeID|||string|前一个态度的编号，很多平台只保留态度发布的顺序而非时间|

**示例**
> ``` json
> {
>   "current": 2,
>   "max": 100,
>   "err": 0
> }
> ```

---

### 1\.4\. User类

> 平台用户数据结构。

**结构字段**
> |字段|子字段|必须|类型|说明
> |:-|:-|:-|:-|:-|
> |userID||√|string|用户编号|
> |userName||√|string|用户名称/昵称|
> |userSource||√|string|用户所属的平台|
> |gender|||int|性别，0:男，1:女|
> |age|||int|年龄|
> |birthday|||date|出生年月，格式yyyy-MM-dd|
> |country|||string|所属国家|
> |province|||string|所在省份|
> |city|||string|所在城市|
> |email|||string|电子邮箱|
> |employer|||string|雇主、公司|
> |industry|||string|所属行业|
> |school|||string|学校|
> |education|||string|学历学位|
> |tags|||string array|用户标签|
> |introduction|||string|用户简介|
> |followingNum|||int|关注人数|
> |followerNum|||int|粉丝人数|
> |articleNum|||int|文章数|

**示例**
> ``` json
> {
>   "userID": "abcdefg",
>   "userName": "社交机器人",
>   "userSource": "Weibo",
>   "gender": 0,
>   "age": 18,
>   "birthday": "2013-06-18",
>   "country": "中国",
>   "province": "浙江",
>   "city": "杭州",
>   "email": "x@mail.com",
>   "employer": "浙江工业大学",
>   "industry": "教育",
>   "school": "浙江大学",
>   "education": "博士研究生",
>   "tags": ["足球", "科技", "搞笑"],
>   "introduction": "这是一个机器人",
>   "followingNum": 91,
>   "followerNum": 86,
>   "articleNum": 18,
> }
> ```