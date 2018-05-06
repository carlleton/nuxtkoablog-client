## 填坑记录
* electron-vue使用scss的问题，它没有自带scss，需要自己安装
* electron访问外部接口，跨域问题
  从[segmentfault](https://segmentfault.com/a/1190000012030202)找到一个安全性配置，直接在`new BrowserWindow`的配置里边增加一句`webPreferences: {webSecurity: false}`

## 参考资料
* [推荐使用高性能数据库leveldb](https://cnodejs.org/topic/56fb48588a612c5559d16a13)
* [leveldb高性能nosql数据库在node.js环境下如何使用及实例介绍](https://cnodejs.org/topic/548fe4f04823a0234c9e16e4)