import sys
import json
import yt_dlp

def fetch_info(url):
    with yt_dlp.YoutubeDL({ 'quiet': True, 'no_warnings': True }) as ytdl:
        info = ytdl.extract_info(url, download=False)
        return info
    
def download(url, output):
    opts = { 
        "outtmpl": output, 
        "format": "bestaudio/best", 
        "quiet": True,       # silencia logs normales
        "no_warnings": True, # silencia warnings
        "noprogress": True   # desactiva la barra de progreso
        }
    with yt_dlp.YoutubeDL(opts) as ytdl:
        ytdl.download([url])

if __name__ == '__main__':
    arg = sys.argv[1]

    if arg == '-i':
        url = sys.argv[2]
        info = fetch_info(url)
        print(json.dumps(info))

    if arg == '-d':
        try:
            url = sys.argv[2]
            fileName = sys.argv[3]
            download(url, fileName)
            print('done')
        except Exception as e:
            print(str(e))

sys.exit(0)