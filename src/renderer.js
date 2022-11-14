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
  showNotification('Settings have been set to default.', 'warning', 2000);
});

document.querySelector('#download-btn').addEventListener('click', async (event) => {
  let download_path = localStorage.getItem('download-path');
  if (!download_path) {
    const options = { title: 'Select a download folder' };
    const { canceled, filePaths } = await APP_CONTEXT.openDialog(options);
    if (!canceled) {
      download_path = filePaths[0];
      localStorage.setItem('download-path', download_path);
    }
  }

  await downloadQueuedVideos(download_path);
});

const downloadQueuedVideos = async (donwloadPath) => {
  for (const item of state.videos) {
    const title = item.videoDetails.title.replace(/(\||\,\s)/gi, '-');
    APP_CONTEXT.downloadFromInfo(item, `${donwloadPath}\\${title}.mp3`, {
      quality: 'highestaudio',
    })
      .then(() => {
        document.querySelector(`#item-${item.index}`).remove();
        state.videos.splice(item.index, 1);
        showNotification('Download completed', 'success', 2000);
      })
      .catch((err) => {
        if (err) {
          showNotification(err.message, 'danger', 2000);
        }
      });
  }
};

const showNotification = (message, notificationType, delayMs) => {
  const notificationWrapper = document.querySelector('#form-notification-wrapper');
  const flyout = notificationWrapper.querySelectorAll('div')[0];
  flyout.innerText = message;
  flyout.className = `form-notification ${notificationType}`;
  notificationWrapper.style.opacity = '1';
  notificationWrapper.style.margin = '0 auto';
  setTimeout(() => {
    notificationWrapper.style.opacity = '0';
  }, delayMs);
};
