---
layout: post
title: rk3066的hacking
---

###android前置知识

* [工具合集]

* android文件系统由很多个分区组成。

	在adb shell运行如下。cat /proc/mtd一般会显示各个分区的名字大小等。cat /proc/mtd or cat /proc/partitions or dmesg | grep recovery 找出recovery是哪个。  
	ls -l  /dev/block/mtd/by-name/

* cat k03.img > /dev/block/mtdblock3

* boot和recovery映像的文件结构
	boot和recovery映像并不是一个完整的文件系统，它们是一种android自定义的文件格式，该格式包括了2K的文件头，后面紧跟着是用gzip压缩过的内核，再后面是一个ramdisk内存盘  
	分解  
	    ./split_bootimg.pl boot.img  
	解压 ramdisk  
	    # mkdir ramdisk  
	    # cd ramdisk  
	    # gzip -dc ../boot.img-ramdisk.gz | cpio -i


* 从[rk3066内核源代码]得到cmdline

* extract-ikconfig
	CONFIG_CMDLINE="root=/dev/mmcblk0p2 init=/sbin/init loglevel=8 rootfstype=ext4 rootwait

[如何解包／编辑／打包boot.img文件]: http://www.cnblogs.com/shenhaocn/archive/2010/05/25/1743704.html
[rk3066内核源代码]: https://github.com/AndrewDB/rk3066-kernel
[工具集合]: http://code.google.com/p/zen-droid/downloads/list
