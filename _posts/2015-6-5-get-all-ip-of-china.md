from http://www.jslink.org/linux/apnic-ip.html

#!/bin/sh
FILE=ip_apnic 
rm -f $FILE 
rm -f cn.net 
wget http://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest -O $FILE 
grep 'apnic|CN|ipv4|' $FILE | cut -f 4,5 -d'|'|sed -e 's/|/ /g' | while read ip cnt
do 
    pow=32;
    x=$cnt; 
    while [ $x -gt 1 ]; do
        x=$((x/2));
        pow=$((pow-1))
    done
    mask=$pow
    echo $ip/$mask 
    echo $ip/$mask>> cn.net
done
