## 林晨天-Weibo

* 7月19日
    1.完成主页面功能的编写，部分还未完全符合接口文档(函数单独测试过了)
    2.文章界面的js文件，之前改页面实现，部分函数需要拆开，例如点赞和获取点赞列表

* 7月20日
    往杭州赶（20号真的没时间）

* 计划
    1. 21日整理home和article两个surface的代码
        1.1. 7月21日完成主页面和文章界面的所有函数接口规范
        1.2. background调用框架在老版本的界面测试通过了，但没来的及在新页面测试，21日做完了有时间就跟进，不然22日写
    2. operator文档快速编写
    3. home_surface和article_surface中的selector移入operato.js中

* 方案问题
    用户界面细分为三个界面：关注、粉丝、文章界面，文件结构是否需要细分：
        user_article_surface
        user_follower_surfeac
        user_following_surface
    或者只在一个文件里分不同函数名：
        user_article_more
        ......
