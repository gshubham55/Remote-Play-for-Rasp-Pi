#!/bin/bash
rm ./*.flv
rm ./*.flv.part
file="./songs/$1.mp3"
if [ -f "$file" ]
then
	killall vlc
	cvlc $file --repeat
	# echo "$file found."
else
	# echo "Downloading..."
	youtube-dl http://www.youtube.com/watch?v=$1 -f flv --max-filesize 20m --id
	avconv -i $1.flv -f mp3 -vn -acodec copy ./songs/$1.mp3
	killall vlc
	cvlc $file --repeat
fi
