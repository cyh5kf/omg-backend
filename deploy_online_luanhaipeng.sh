#!/bin/sh
rsync -rave 'ssh -o ProxyCommand="/usr/bin/nc -X 5 -x 127.0.0.1:10087 %h %p" -p 58022 -i  /Users/luanhaipeng/.ssh/luan' --progress dist/  luanhaipeng@10.134.192.78:/tmp/backrestli
