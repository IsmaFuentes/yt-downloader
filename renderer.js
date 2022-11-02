const APP_CONTEXT = window.electron;
const state = { items: [] };

document.querySelector('#add-url-btn').addEventListener('click', (event) => {
  const selector = document.querySelector('#url-selector');
  const url = selector.value?.trim();
  APP_CONTEXT.fetchInfoFromUrl(url).then((info) => {
    createEntry(info);
  });
});

const createEntry = (item) => {
  state.items.push(item);
  const { videoDetails } = item;
  const element = document.createElement('div');
  element.innerHTML = `
  <div id="item-${item.index}" class="yt-item">
    <img src="${videoDetails.thumbnails[0]?.url}" class="yt-item-thumb">
    <div>
        <span>${videoDetails.ownerChannelName} - ${videoDetails.category}</span>
        <p>${videoDetails.title}</p>
    </div>
  </div>
  `;

  document.querySelector('#items').appendChild(element);
};

document.querySelector('#download-btn').addEventListener('click', (event) => {
  APP_CONTEXT.openDialog().then((openDialogResult) => {
    const { canceled, filePaths } = openDialogResult;
    if (canceled) return;
    state.items?.forEach((item) => {
      APP_CONTEXT.downloadFromInfo(item, `${filePaths[0]}\\${item.videoDetails.title}.mp3`, {
        quality: 'highestaudio',
      });
    });
  });
});
