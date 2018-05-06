# 填坑记录
* electron-vue使用scss的问题，它没有自带scss，需要自己安装
* electron访问外部接口，跨域问题
  从[segmentfault](https://segmentfault.com/a/1190000012030202)找到一个安全性配置，直接在`new BrowserWindow`的配置里边增加一句`webPreferences: {webSecurity: false}`
