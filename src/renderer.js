const APP_CONTEXT = window.electron;
const state = { videos: [] };

document.querySelector('#add-url-btn').addEventListener('click', (event) => {
  const selector = document.querySelector('#url-selector');
  const url = selector.value?.trim();

  if (state.videos.map((item) => item.itemUrl).includes(url)) {
    return;
  }

  APP_CONTEXT.fetchInfoFromUrl(url).then((info) => {
    const item = { ...info, index: state.videos.length, itemUrl: url };
    state.videos.push(item);
    const { videoDetails } = info;
    const element = document.createElement('div');
    element.id = `item-${item.index}`;
    element.className = 'yt-item';
    element.innerHTML = `
      <img src="${videoDetails.thumbnails[0]?.url}" class="yt-item-thumb">
      <div class="yt-item-description">
          <span>${videoDetails.ownerChannelName} - ${videoDetails.category}</span>
          <p>${videoDetails.title}</p>
      </div>
      <button class="yt-item-remove-btn" id="btn-remove-${item.index}">
        <span class="material-icons-outlined">delete</span>
      </button>
    `;
    document.querySelector('#app-body').appendChild(element);
    document.querySelector(`#btn-remove-${item.index}`).addEventListener('click', (e) => {
      document.querySelector(`#item-${item.index}`).remove();
      state.videos.splice(item.index, 1);
    });
    selector.value = '';
  });
});

document.querySelector('#clear-cache-btn').addEventListener('click', (event) => {
  localStorage.clear();
});

document.querySelector('#download-btn').addEventListener('click', (event) => {
  let download_path = localStorage.getItem('download-path');
  if (!download_path) {
    APP_CONTEXT.openDialog({ title: 'Select a download folder' }).then((openDialogResult) => {
      const { canceled, filePaths } = openDialogResult;
      if (!canceled) {
        download_path = filePaths[0];
        localStorage.setItem('download-path', download_path);
      }
    });
  }

  downloadQueuedVideos(download_path);
});

const downloadQueuedVideos = (donwloadPath) => {
  for (const item of state.videos) {
    const title = item.videoDetails.title.replace(/(\||\,\s)/gi, '-');
    APP_CONTEXT.downloadFromInfo(item, `${donwloadPath}\\${title}.mp3`, {
      quality: 'highestaudio',
    }).then(() => {
      console.log('download completed.');
      document.querySelector(`#item-${item.index}`).remove();
      state.videos.splice(item.index, 1);
    });
  }
};
