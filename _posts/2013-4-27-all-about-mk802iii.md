---
layout: post
title: rk3306的hacking
---


###android前置知识

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

