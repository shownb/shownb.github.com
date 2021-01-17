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

* [工具合集] split_bootimg.pl mkbootimg 等 带base显示的下载地址 https://gist.github.com/oldhu/1832541/raw/80c6fdb425a1c1357a25d7ebe1987863c6f4cf81/split_bootimg.pl

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

	打包ramdisk

	    find . | cpio -o -H newc | gzip > ../new.cpio.gz

	或者用mkbootfs ramdisk |gzip >ramdisk-new.gz

	合体

	    mkbootimg --cmdline 'console=tty0 no_console_suspend=1 root=/dev/mmcblk0p2 rootdelay=2' --kernel boot.img-kernel --ramdisk ramdisk-new.gz --base 0x60087f00 -o boot-new.img

	其中base地址的确认方法为kernel_addr - 0x00008000,因为物理地址的形式如下：

	    hdr.kernel_addr =  base + 0x00008000;
	    hdr.ramdisk_addr = base + 0x01000000;
	    hdr.second_addr =  base + 0x00F00000;
	    hdr.tags_addr =    base + 0x00000100;


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

* urat 

	图片在 http://dl.19cn.com/u/144135671/images/IMG_13441.jpg

	* Green = Ground  
	* Blue = Serial TxD  
	* Red = Serial RxD  
	* White = No signal  
	* Yellow = 3.3V  
	* Magenta = 2.5V   

* mount ext4的移动硬盘或sd卡

	cat /proc/partitions  
	mount -t ext4 /dev/block/vold/179:1 /mnt/usbhdd

* kernel代码另一位改造者

	[olegk0的内核] 还有相关资源下载 https://docs.google.com/folder/d/0B6QRwjacGTzCX0UyOXNGSU5iMGc/edit?pli=1
	

[如何解包／编辑／打包boot.img文件]: http://www.cnblogs.com/shenhaocn/archive/2010/05/25/1743704.html
[rk3066内核源代码]: https://github.com/AndrewDB/rk3066-kernel
[工具合集]: http://code.google.com/p/zen-droid/downloads/list
[定制我的Nexus系统之boot.img的前世今生]: http://blog.csdn.net/ttxgz/article/details/7742696
[linux下的rk3066 adb]: http://www.rikomagic.co.uk/forum/viewtopic.php?f=9&t=4080
[cwm for Rockchip]: http://androtab.info/clockworkmod/rockchip/install/
[olegk0的内核]: https://github.com/olegk0/rk3066-kernel

旧机nook simple touch重新用
```bash
die() {
 # rm -rf /tmp/ramdisk

  echo -e $@
  exit 1
}

PROP_PATCHED=0
INIT_PATCHED=0

[ -f /nook/boot/uRamdisk ] || die "Cannot find uRamdisk"

mkdir -p /tmp/ramdisk
dd if=/nook/boot/uRamdisk of=/tmp/ramdisk/ramdisk.gz bs=64 skip=1

cd /tmp/ramdisk
zcat ramdisk.gz | cpio -id
rm ramdisk.gz

[ -f /tmp/ramdisk/default.prop.orig ] || cp /tmp/ramdisk/default.prop /tmp/ramdisk/default.prop.orig

sed -i \
  -e's/^ro.secure=1/ro.secure=0/' \
  -e's/^persist.service.adb.enable=0/persist.service.adb.enable=1/' \
  /tmp/ramdisk/default.prop

# Verify that the patched lines exist in default.prop
grep -q '^ro.secure=0' /tmp/ramdisk/default.prop && \
  grep -q '^persist.service.adb.enable=1' /tmp/ramdisk/default.prop && \
  PROP_PATCHED=1

[ -f /tmp/ramdisk/init.rc.orig ] || cp /tmp/ramdisk/default.prop /tmp/ramdisk/init.rc.orig

# Comment out the "   disabled" line after "service adb" 
# Comment out the "on property:persist.service.adb*" blocks entirely
sed -i \
  -e '/^service adbd/{ N s/\(service adbd.*\n\) /\1#MOD# / }' \
  -e '/^on property:persist.service.adb.enable/{ N s/^\(.*\)\n \(.*\)/#MOD#\1\n#MOD# \2/}' \
  /tmp/ramdisk/init.rc

# Verify that the patched lines exist in init.rc
grep -q '#MOD#on property:persist' /tmp/ramdisk/init.rc && \
  grep -q '#MOD#    disabled' /tmp/ramdisk/init.rc && \
  INIT_PATCHED=1

[ "$PROP_PATCHED" -eq "1" -a "$INIT_PATCHED" -eq "1" ] || die "Failed patching uRamdisk"

find . | cpio -o -H newc > /tmp/ramdisk.cpio
gzip -9 -c /tmp/ramdisk.cpio > /tmp/ramdisk.cpio.gz

mkimage -A arm -O linux -T ramdisk -C gzip -a 0 -e 0 -d /tmp/ramdisk.cpio.gz /tmp/uRamdisk > /dev/null
[ "$?" -eq "0" ] || die "Could not build uRamdisk"


if [ ! -f /nook/boot/uRamdisk.orig ]; then
  mv /nook/boot/uRamdisk /nook/boot/uRamdisk.orig
fi

mv /tmp/uRamdisk /nook/boot
rm -rf /tmp/ramdisk

echo "uRamdisk patched"
```

sudo apt-get install u-boot-tools

/data/data/com.android.providers.settings/databases/databases/settings.db

sqlite3 settings.db "select * from system where name='wifi_static_ip'"

sqlite3 settings.db "update system set value=0 where name='wifi_use_static_ip'"

dropbear
```bash
# Creating a home-dir for DropBear
mkdir /data/dropbear
chmod 755 /data/dropbear
mkdir /data/dropbear/.ssh
chmod 700 /data/dropbear/.ssh
# Copy over our files
mv /sdcard/authorized_keys /data/dropbear/.ssh/
chown root: /data/dropbear/.ssh/authorized_keys
chmod 600 /data/dropbear/.ssh/authorized_keys
# Generate a hostkey, so we can use DropBear
dropbearkey -t rsa -f /data/dropbear/dropbear_rsa_host_key
dropbearkey -t dss -f /data/dropbear/dropbear_dss_host_key
```
编辑/boot/uRamdisk 里面的init.rc 重新打包
```
service sshd /system/xbin/dropbear -s
   user  root
   group root
   oneshot
```
