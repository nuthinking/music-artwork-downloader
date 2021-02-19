chrome.runtime.onInstalled.addListener(() => {
  console.log('Music Artwork Downloader installed');
});

chrome.action.onClicked.addListener((tab) => {
  const songTitle = tab.title.split('-')[0].trim().replace("'", '');
  console.log(`song title: "${songTitle}"`);
  chrome.tabs.executeScript(tab.id, {
    code: `console.log('start artwork downloader');
const picture = document.querySelector('picture');
if(!picture){
  console.log('could not find any picture');
}else{
  const jpgSource = picture.querySelectorAll('source')[1];
  const urls = jpgSource.srcset.split(' ');
  urls.pop();
  const largestUrl = urls.pop();
  console.log(largestUrl);
  const re = new RegExp('\/([0-9]*x[0-9]*)');
  var match = re.exec(largestUrl);
  if(match.length>1){
    match = match[1];
    const highResUrl = largestUrl.replace(match, '3000x3000');
    console.log(highResUrl);
    fetch(highResUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '${songTitle}.jpg';
        const clickHandler = () => {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            this.removeEventListener('click', clickHandler);
          }, 150);
        };
      a.addEventListener('click', clickHandler, false);
      a.click();
    });
  }
}`
  });
});
