const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const DEFAULTS = {
  baseDir: null, // null => Documents\\xScreen
  frameRate: 30, // 15 | 30 | 60
  audio: true,   // sistem sesi kaydı (desktop)
  audioDevice: null, // dshow cihaz adı (örn: Stereo Mix ... veya virtual-audio-capturer)
  recorderEngine: 'ffmpeg', // 'ffmpeg' | 'media'
  autoLaunch: true,
  shortcuts: {
    enableScreenshot: true, // Ctrl+Alt+S
    enableRecord: true      // Ctrl+Alt+R
  }
};

function getConfigPath() {
  const dir = app.getPath('userData');
  return path.join(dir, 'config.json');
}

function loadConfig() {
  try {
    const p = getConfigPath();
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      const data = JSON.parse(raw);
      return { ...DEFAULTS, ...data, shortcuts: { ...DEFAULTS.shortcuts, ...(data.shortcuts||{}) } };
    }
  } catch (e) {
    // ignore
  }
  return { ...DEFAULTS };
}

function saveConfig(cfg) {
  const merged = { ...DEFAULTS, ...cfg, shortcuts: { ...DEFAULTS.shortcuts, ...(cfg.shortcuts||{}) } };
  const p = getConfigPath();
  try {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(merged, null, 2), 'utf8');
  } catch (e) {
    // ignore
  }
  return merged;
}

module.exports = { loadConfig, saveConfig, DEFAULTS };
