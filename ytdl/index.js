const fs = require('fs');
const ytdl = require('ytdl-core');

const YouTubeDownloader = {
  /**
   * Fetches youtube video information
   * @param {String} url
   * @returns {Promise<ytdl.videoInfo>}
   */
  fetchInfoFromUrl: async (url) => ytdl.getInfo(url),
  /**
   * Downloads from video information
   * @param {ytdl.videoInfo} info
   * @param {String} fileName
   * @param {ytdl.downloadOptions} options
   * @returns {Promise<void>}
   */
  downloadFromInfo: async (info, fileName, options = {}) => {
    return new Promise((resolve, reject) => {
      const stream = ytdl.downloadFromInfo(info, options).pipe(fs.createWriteStream(fileName));
      stream.on('close', () => resolve());
      stream.on('error', (e) => reject(e));
    });
  },
};

module.exports = { YouTubeDownloader };
