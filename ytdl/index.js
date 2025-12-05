const { PythonShell } = require('python-shell');

// https://github.com/yt-dlp/yt-dlp
PythonShell.run('./scripts/check.py', { args: ['-v'] }).then((out) => {
  if (out[0] == 'True') {
    console.log('missing critical package, installing yt-dlp...');
    const { spawn } = require('child_process');
    const pip = spawn('pip', ['install', 'yt-dlp']);

    pip.stdout.on('data', (data) => console.log(data.toString()));
    pip.stderr.on('data', (data) => console.log(data.toString()));
    pip.on('close', (code) => console.log(`pip finished with code: ${code}`));
  }
});

const ytdl_python = (action = '', args = []) => {
  return new Promise((resolve, reject) => {
    PythonShell.run('./scripts/yt-dlp.py', {
      args: [action, ...args],
    })
      .then((output) => resolve(output))
      .catch(reject);
  });
};

// TODO: convert to typescript
const YouTubeDownloader = {
  /**
   * Fetches youtube video information
   * @param {String} url
   * @returns { videoDetails: { title: '', ownerChannelName: '', category: '', thumbnails: [], video_url: '', lengthSeconds: 0} }
   */
  fetchInfoFromUrl: async (url) => {
    const data = await ytdl_python('-i', [url]);
    const json = data.join('');
    if (process.env.ENVIRONMENT === 'dev') {
      console.log(json);
    }

    const info = JSON.parse(json);
    return {
      ...info,
      videoDetails: {
        title: info.title,
        ownerChannelName: info.uploader,
        category: info.categories?.[0] ?? '',
        thumbnails: info.thumbnails ?? [],
        video_url: info.webpage_url,
        lengthSeconds: info.duration,
      },
    };
  },

  /**
   * Downloads from video information
   * @param {Object} info
   * @param {String} fileName
   * @param {String} options
   */
  downloadFromInfo: async (info, fileName, options = {}) => {
    const url = info.itemUrl ?? info.videoDetails.video_url;
    const out = await ytdl_python('-d', [url, fileName]);
    if (out[0] !== 'done') {
      console.log(out[0]);
      throw new Error(`download failed: ${fileName}`);
    }
  },
};

// const YouTubeDownloader = {
//   /**
//    * Fetches youtube video information
//    * @param {String} url
//    * @returns {Promise<ytdl.videoInfo>}
//    */
//   fetchInfoFromUrl: async (url) => ytdl.getInfo(url),
//   /**
//    * Downloads from video information
//    * @param {ytdl.videoInfo} info
//    * @param {String} fileName
//    * @param {ytdl.downloadOptions} options
//    * @returns {Promise<void>}
//    */
//   downloadFromInfo: async (info, fileName, options = {}) => {
//     return new Promise((resolve, reject) => {
//       if (process.env.ENVIRONMENT === 'dev') {
//         console.log(`downloading ${info.videoDetails.title}`);
//       }
//       const stream = ytdl.downloadFromInfo(info, options).pipe(fs.createWriteStream(fileName));
//       stream.on('close', () => resolve());
//       stream.on('error', (e) => reject(e));
//     });
//   },
// };

module.exports = { YouTubeDownloader };
