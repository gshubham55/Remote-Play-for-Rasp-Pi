# sleep 8
# rm *.mp3 # change dir to ./songs if you ever really wnna clear the songs list
youtube-dl http://www.youtube.com/watch?v=$1 -f flv --max-filesize 20m --id
# rm ./songs/$1.mp3
ffmpeg -i $1.flv -f mp3 -vn -acodec copy ./songs/$1.mp3
rm *.flv
rm *.flv.part
# echo $@.mp3
killall vlc
cvlc ./songs/$1.mp3
# cvlc ./videos/$1.flv