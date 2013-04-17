---
layout: default
title: "Linux基础汇总"
---

## Linux基础汇总


* suid/guid

	suid意味着如果A用户对属于他自己的shell脚本文件设置了这种权限，那么其他用户在执行这个脚本的时候就拥有了A用户的权限。所以，如果 root用户对某一脚本设置了这一权限的话则其他用户执行该脚本的时候则拥有了root用户权限。同理，guid意味着执行相应脚本的用户则拥有了该文件所属用户组中用户的权限。

	给文件加suid和sgid的命令如下：

	    chmod u+s filename 设置suid位
	    chmod u-s filename 去掉suid设置
	    chmod g+s filename 设置sgid位
	    chmod g-s filename 去掉sgid设置

* find / -type f -perm /u+s -ls

	-perm #按执行权限来查找

	-type b/d/c/p/l/f #查是块设备、目录、字符设备、管道、符号链接、普通文件

