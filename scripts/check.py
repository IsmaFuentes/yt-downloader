import sys
import importlib.util

def check_package():
  return importlib.util.find_spec("yt_dlp") is None

if __name__ == "__main__":
  arg = sys.argv[1]

  if arg == '-v':
    print(check_package())