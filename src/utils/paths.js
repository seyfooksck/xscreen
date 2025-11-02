const fs = require('fs');
const os = require('os');
const path = require('path');

const APP_DIR = 'xScreen';
const PHOTOS_DIR = 'Photos';
const VIDEOS_DIR = 'Videos';

function getDocumentsDir() {
  // Windows'ta genelde C:\Users\<user>\Documents
  // Yerelleştirilmiş olsa bile çoğunlukla 'Documents' yoludur.
  // Gerekirse burada Win32 Known Folders API kullanımı eklenebilir.
  return path.join(os.homedir(), 'Documents');
}

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function ensureMediaDirs(baseDirOverride) {
  const docs = getDocumentsDir();
  const base = baseDirOverride ? baseDirOverride : path.join(docs, APP_DIR);
  const photos = path.join(base, PHOTOS_DIR);
  const videos = path.join(base, VIDEOS_DIR);
  ensureDir(base);
  ensureDir(photos);
  ensureDir(videos);
  return { docs, base, photos, videos };
}

function timestampName(prefix, ext) {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const name = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  return `${prefix}_${name}.${ext}`;
}

module.exports = {
  ensureMediaDirs,
  timestampName,
};
