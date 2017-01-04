palette="palette.png"
filters="fps=10,scale=-1:500:flags=lanczos,setpts=$3*PTS"

ffmpeg -i $1 -vf "$filters,palettegen" -y $palette
ffmpeg -i $1 -i $palette -lavfi "$filters [x]; [x][1:v] paletteuse" -y $2.gif
rm $palette

