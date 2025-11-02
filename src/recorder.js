const { desktopCapturer, ipcRenderer } = require('electron');

let mediaRecorder;

async function selectScreenSource() {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });
  // İlk ekranı seç
  return sources[0];
}

async function start() {
  try {
    const source = await selectScreenSource();
    const constraints = {
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop',
        }
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          maxFrameRate: 30,
        }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    const options = { mimeType: 'video/webm; codecs=vp8' };
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = async (e) => {
      if (e.data && e.data.size > 0) {
        const ab = await e.data.arrayBuffer();
        ipcRenderer.send('recorder-chunk', Buffer.from(ab));
      }
    };

    mediaRecorder.onstop = () => {
      ipcRenderer.send('recorder-stopped');
      stream.getTracks().forEach(t => t.stop());
    };

    mediaRecorder.start(500); // her 500ms parça gönder
  } catch (err) {
    console.error(err);
    ipcRenderer.send('recorder-stopped');
  }
}

ipcRenderer.on('start-recording', (_e, opts) => startWithOptions(opts));

ipcRenderer.on('stop-recording', () => {
  try { mediaRecorder && mediaRecorder.state !== 'inactive' && mediaRecorder.stop(); } catch {}
});

async function startWithOptions(opts){
  const frameRate = (opts && opts.frameRate) || 30;
  const audioOn = !opts ? true : !!opts.audio;
  try {
    const source = await selectScreenSource();
    const constraints = {
      audio: audioOn ? { mandatory: { chromeMediaSource: 'desktop' } } : false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          maxFrameRate: frameRate,
        }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    const options = { mimeType: 'video/webm; codecs=vp8' };
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = async (e) => {
      if (e.data && e.data.size > 0) {
        const ab = await e.data.arrayBuffer();
        ipcRenderer.send('recorder-chunk', Buffer.from(ab));
      }
    };

    mediaRecorder.onstop = () => {
      ipcRenderer.send('recorder-stopped');
      stream.getTracks().forEach(t => t.stop());
    };

    mediaRecorder.start(500); // her 500ms parça gönder
  } catch (err) {
    console.error(err);
    ipcRenderer.send('recorder-stopped');
  }
}
