const fs = require('fs');
const ytdl = require('ytdl-core');

const state = { items: [] };

document.querySelector('#add-url-btn').addEventListener('click', (event) => {
  const selector = document.querySelector('#url-selector');
  const url = selector.value?.trim();
  // todo: check for duped urls first
  ytdl
    .getInfo(url)
    .then((info) => {
      createEntry({
        index: state.items.length,
        videoInfo: info,
        videoDetails: info.videoDetails,
      });
    })
    .catch((err) => {
      if (err) alert(err);
    });
});

const createEntry = (item) => {
  state.items.push(item);
  const { videoDetails } = item;
  const element = document.createElement('div');
  element.innerHTML = `
  <div id="item-${item.index}" class="yt-item">
    <image src="${videoDetails.thumbnails[0]?.url}" class="yt-item-thumb">
    <div>
        <span>${videoDetails.ownerChannelName} - ${videoDetails.category}</span>
        <p>${videoDetails.title}</p>
    </div>
  </div>
  `;

  document.querySelector('#items').appendChild(element);
};

document.querySelector('#download-btn').addEventListener('click', (event) => {
  //   dialog.showOpenDialog({ properties: ['openDirectory'] }).then((response) => {
  //     const { canceled, filePaths } = response;
  //     if (canceled) return;
  //     console.log(filePaths);
  //   });
  //   electron.openDialog('showOpenDialog', {
  //     title: 'Select a path',
  //     properties: ['openDirectory'],
  //   });

  state.items?.forEach((item) => {
    ytdl
      .downloadFromInfo(item.videoInfo, { quality: 'highestaudio' })
      .pipe(fs.createWriteStream('test.mp3'));
  });
});
