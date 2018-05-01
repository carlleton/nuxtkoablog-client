# 开发记录

## 本项目的目的
为[nuxtkoablog](https://github.com/carlleton/nuxtkoablog)这个项目做一个客户端
暂时只是做一个单人的，先满足个人需要

## 数据库
客户端来说，关系数据库的话采用sqlite3
nosql使用nedb，因为扒了下leanote的客户端，发现他用的也是这个数据库。网络上说这个库最大256M，先记录一下，稍后对比其他的。
对于笔记来说，很轻易的就能达到几百兆，但上边俩都是单文件，数据量大时扩展来说不容易。
暂时用leveldb，使用linvodb3和level-js来实现看看