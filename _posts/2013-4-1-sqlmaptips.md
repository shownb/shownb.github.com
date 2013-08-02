---
layout: post
title: tipsofsqlmaps
---

--current-db 当前数据库
--dbms 指定数据库 如mysql  
--tamper "unmagicquotes.py" 以“%bf%27”替换单引号，并在结尾添加注释“--”  
--data post数据  
--cookie   
--user-agent  
--level  3时候是cookie注入 4是http头注入  
--risk  共有四个风险等级，默认是1会测试大部分的测试语句，2会增加基于事件的测试语句，3会增加OR语句的SQL注入测试。
--dbs 列出数据库  
--columns,-C,-T,-D
--file-read 读文件如--file-read "/etc/passwd"  
上传文件 --file-write "本地文件" --file-dest "目标机器目录"  
--flush-session #刷新当前目标的会话文件,重新注入  
-v #详细的等级(0-6)  
0：只显示Python的回溯，错误和关键消息。  
1：显示信息和警告消息。  
2：显示调试消息。  
3：有效载荷注入。  
4：显示HTTP请求。  
5：显示HTTP响应头。  
6：显示HTTP响应页面的内容  
-p "user-agent" --user-agent "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)" #指定user-agent注入
