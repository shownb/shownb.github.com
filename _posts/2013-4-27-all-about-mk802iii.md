---
layout: post
title: rk3066的hacking
---

###android boot.img的结构

boot.img这个分区格式是android自己定制的。它主要分成3或者4大块。  
由header,kernel,ramdisk,second stage组成  
header包含了各个段的解压出来后存放的地址，和各个段的大小等信息。其中包括cmdline 地址tags_addr (对应这Linux的PARAMS_PHYS)  
kernel和ramdisk就不用啰嗦了。详细的分析见 [定制我的Nexus系统之boot.img的前世今生]  
我个人看完的总结是:android机器 bootloader负责把boot.img的东西加载到ddr，按照的是boot-header的地址和内容。cmdline这个内核参数被复制到内存制定位置，然后kernel通过bootloader传递过来的一个指针可以获取到。  
具体就是bootloader根据boot header安排好内存地址，然后开始kernel(<--cmdline),然后......  
pc:内核参数，就是写在grub 的menu.lst里面或者通过其他地方，是传给内核的参数。由各种boot loader （grub ，lilo， pxeloader 等）负责复制到内存指定位置，然后linux内核通过boot loader传递过来的 一个指针（cmdline pointer）可以获取到。然后建立起/proc/cmdline文件，应用程序可以通过读取这个文件来得到参数。  


###android前置知识

* [工具合集] split_bootimg.pl mkbootimg 等

* android文件系统由很多个分区组成。

	在adb shell运行如下。cat /proc/mtd一般会显示各个分区的名字大小等。cat /proc/mtd or cat /proc/partitions or dmesg | grep recovery 找出recovery是哪个。  
	ls -l  /dev/block/mtd/by-name/

* boot和recovery映像的文件结构
	boot和recovery映像并不是一个完整的文件系统，它们是一种android自定义的文件格式，该格式包括了2K的文件头，后面紧跟着是用gzip压缩过的内核，再后面是一个ramdisk内存盘  
	分解

	    ./split_bootimg.pl boot.img

	解压 ramdisk

	    # mkdir ramdisk  
	    # cd ramdisk  
	    # gzip -dc ../boot.img-ramdisk.gz | cpio -i

	合体

	    mkbootimg --cmdline 'console=tty0 no_console_suspend=1 root=/dev/mmcblk0p2 rootdelay=2' --kernel boot.img-kernel --ramdisk ramdisk-new.gz -o boot-new.img

* 从[rk3066内核源代码]得到cmdline

* extract-ikconfig
	CONFIG_CMDLINE="root=/dev/mmcblk0p2 init=/sbin/init loglevel=8 rootfstype=ext4 rootwait

* 开启adb wifi

	    setprop service.adb.tcp.port 8000  
	    stop adbd  
	    start adbd

* 刷入recovery.img遇到的问题  
	正常来说，按照这个方法可以刷入recovery.img到/dev/block/mtdblock3

	    busybox dd if=/sdcard/recovery.img of=/dev/block/mtd/by-name/recovery bs=8192

	但我无论怎么刷都刷不进，包括先刷/dev/zero,生成和recovery分区一样大小的文件。  
	我是按照下列来解决的。按照刷[cwm for Rockchip]的中的from root shell方法，是使用了它里面的flash_image文件

* u-boot cmdline 等  
	uboot引导linux的参数都是写在flash上的，具体哪个地址看uboot的CFG_ENV_ADDR，具体格式uboot下有个setup.h文件  
	boot bootargs



[如何解包／编辑／打包boot.img文件]: http://www.cnblogs.com/shenhaocn/archive/2010/05/25/1743704.html
[rk3066内核源代码]: https://github.com/AndrewDB/rk3066-kernel
[工具合集]: http://code.google.com/p/zen-droid/downloads/list
[定制我的Nexus系统之boot.img的前世今生]: http://blog.csdn.net/ttxgz/article/details/7742696
[linux下的rk3066 adb]: http://www.rikomagic.co.uk/forum/viewtopic.php?f=9&t=4080
[cwm for Rockchip]: http://androtab.info/clockworkmod/rockchip/install/
