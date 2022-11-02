const APP_CONTEXT = window.electron;
const state = { videos: [] };

document.querySelector('#add-url-btn').addEventListener('click', (event) => {
  const selector = document.querySelector('#url-selector');
  const url = selector.value?.trim();

  if (state.videos.map((item) => item.itemUrl).includes(url)) {
    alert('Duplicated url.');
    return;
  }

  APP_CONTEXT.fetchInfoFromUrl(url).then((info) => {
    const item = { ...info, index: state.videos.length, itemUrl: url };
    state.videos.push(item);
    const { videoDetails } = info;
    const element = document.createElement('div');
    element.innerHTML = `
    <div id="item-${item.index}" class="yt-item">
      <img src="${videoDetails.thumbnails[0]?.url}" class="yt-item-thumb">
      <div class="yt-item-description">
          <span>${videoDetails.ownerChannelName} - ${videoDetails.category}</span>
          <p>${videoDetails.title}</p>
      </div>
      <button class="yt-item-remove-btn">remove</button>
    </div>
    `;

    document.querySelector('#items').appendChild(element);
  });
});

document.querySelector('#download-btn').addEventListener('click', (event) => {
  APP_CONTEXT.openDialog().then((openDialogResult) => {
    const { canceled, filePaths } = openDialogResult;
    if (!canceled) {
      for (const item of state.videos) {
        APP_CONTEXT.downloadFromInfo(item, `${filePaths[0]}\\${item.videoDetails.title}.mp3`, {
          quality: 'highestaudio',
        }).then(() => {
          document.querySelector(`#item-${item.index}`).style.background = '#72B951';
        });
      }
    }
  });
});

// const renderData = (parent, max) => {
//   for (let i = 0; i < max; i++) {
//     const el = document.createElement('div');
//     el.innerHTML = renderVideoDetails({
//       index: i,
//       url: '',
//       ownerChannelName: 'test',
//       category: 'music',
//       title: 'test',
//     });
//     parent.appendChild(el);
//   }
// };

// const renderVideoDetails = (videoDetails) => {
//   return `
//     <div id="item-${videoDetails.index}" class="yt-item">
//         <img src="${videoDetails.url}" class="yt-item-thumb">
//         <div class="yt-item-description">
//             <span>${videoDetails.ownerChannelName} - ${videoDetails.category}</span>
//             <p>${videoDetails.title}</p>
//         </div>
//     </div>
//     `;
// };

// renderData(document.querySelector('#items'), 15);
