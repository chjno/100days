palette="palette.png"
filters="fps=10,scale=-1:500:flags=lanczos,setpts=$1*PTS"

ffmpeg -i cut.mov -vf "$filters,palettegen" -y $palette
ffmpeg -i cut.mov -i $palette -lavfi "$filters [x]; [x][1:v] paletteuse" -y output.gif
