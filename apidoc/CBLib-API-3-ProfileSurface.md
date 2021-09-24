## 3\. ProfileSurface界面相关函数

### 3\.1\. setProfle函数

**函数功能**
> 在用户配置界面，设置账号的相关属性和信息。

**语法**
> err = setProfile(profile)

**参数**
> 参数profile为一个User对象。

**返回值**
> 返回值为整数错误码。err=0代表设置成功；err>0代表设置失败，err的值代表错误码，具体如下表定义：
> |错误码|意义|
> |:-|:-|
> |0|成功|
> |1|不在设置界面|

**调用示例**
> ```javascript
> err = setProfile(profile);
> ```
> 
> 返回 ```err = 0```

---