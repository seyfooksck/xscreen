const { ipcRenderer } = require('electron');

let selected = null; // { type: 'image'|'video', path }

function $(q){ return document.querySelector(q); }
function $all(q){ return Array.from(document.querySelectorAll(q)); }

function setActiveTab(name){
  $all('.tab').forEach(b=>b.classList.toggle('active', b.dataset.tab===name));
  $all('.tabpage').forEach(p=>p.classList.toggle('active', p.id===`tab-${name}`));
}

async function loadGallery(){
  const data = await ipcRenderer.invoke('get-media-list');
  const imgList = $('#image-list');
  const vidList = $('#video-list');
  imgList.innerHTML = '';
  vidList.innerHTML = '';

  const makeItem = (entry, type) => {
    const li = document.createElement('li');
    li.className = 'file-item';
    const title = document.createElement('div');
    title.textContent = entry.name;
    const meta = document.createElement('div');
    meta.className = 'meta';
    const d = new Date(entry.mtime);
    meta.textContent = `${d.toLocaleString()} • ${(entry.size/1024).toFixed(1)} KB`;
    const wrap = document.createElement('div');
    wrap.style.display='flex';wrap.style.flexDirection='column';
    wrap.appendChild(title);wrap.appendChild(meta);
    li.appendChild(wrap);
    li.addEventListener('click', ()=>selectFile(type, entry.path));
    return li;
  };

  // images grid with thumbnails
  data.images.forEach(e=>{
    const li = document.createElement('li');
    li.className = 'thumb';
    const img = document.createElement('img');
    img.loading='lazy';
    img.src = `file://${e.path.replace(/\\/g,'/')}`;
    const cap = document.createElement('div');
    cap.className='cap';
    cap.textContent = e.name;
    li.appendChild(img); li.appendChild(cap);
    li.addEventListener('click', ()=>selectFile('image', e.path));
    imgList.appendChild(li);
  });
  data.videos.forEach(e=>vidList.appendChild(makeItem(e, 'video')));
}

function selectFile(type, path){
  selected = { type, path };
  $('#empty-preview').style.display = 'none';
  const img = $('#img-preview');
  const vid = $('#vid-preview');
  img.style.display = 'none';
  vid.style.display = 'none';

  if(type==='image'){
    img.src = `file://${path.replace(/\\/g,'/')}`;
    img.style.display = 'block';
  } else {
    vid.src = `file://${path.replace(/\\/g,'/')}`;
    vid.style.display = 'block';
  }
  updateActions();
}

function updateActions(){
  const has = !!selected;
  $('#open-btn').disabled = !has;
  $('#folder-btn').disabled = !has;
  $('#delete-btn').disabled = !has;
}

async function openSelected(){ if(selected) await ipcRenderer.invoke('open-file', selected.path); }
async function showInFolder(){ if(selected) await ipcRenderer.invoke('open-in-folder', selected.path); }
async function deleteSelected(){
  if(!selected) return;
  if(confirm('Silmek istediğine emin misin?')){
    const ok = await ipcRenderer.invoke('delete-file', selected.path);
    if(ok){ selected=null; updateActions(); await loadGallery(); $('#img-preview').style.display='none'; $('#vid-preview').style.display='none'; $('#empty-preview').style.display='flex'; }
  }
}

async function loadSettings(){
  const cfg = await ipcRenderer.invoke('get-config');
  $('#autoLaunch').checked = !!cfg.autoLaunch;
  $('#audio').checked = !!cfg.audio;
  $('#frameRate').value = String(cfg.frameRate||30);
  $('#baseDir').value = cfg.baseDir || '';
  $('#scShot').checked = !!cfg?.shortcuts?.enableScreenshot;
  $('#scRec').checked = !!cfg?.shortcuts?.enableRecord;
}

async function saveSettings(ev){
  ev.preventDefault();
  const cfg = {
    autoLaunch: $('#autoLaunch').checked,
    audio: $('#audio').checked,
    frameRate: Number($('#frameRate').value)||30,
    baseDir: ($('#baseDir').value||'').trim() || null,
    shortcuts: {
      enableScreenshot: $('#scShot').checked,
      enableRecord: $('#scRec').checked
    }
  };
  await ipcRenderer.invoke('save-config', cfg);
  alert('Ayarlar kaydedildi');
}

function initTabs(){
  $all('.tab').forEach(b=>{
    b.addEventListener('click', ()=>{
      setActiveTab(b.dataset.tab);
      if(b.dataset.tab==='gallery') loadGallery();
      if(b.dataset.tab==='settings') loadSettings();
    });
  });
}

function initActions(){
  $('#open-btn').addEventListener('click', openSelected);
  $('#folder-btn').addEventListener('click', showInFolder);
  $('#delete-btn').addEventListener('click', deleteSelected);
  $('#settings-form').addEventListener('submit', saveSettings);
  $('#shot-btn').addEventListener('click', async ()=>{
    await ipcRenderer.invoke('ui-take-screenshot');
    await loadGallery();
  });
  $('#rec-btn').addEventListener('click', async ()=>{
    const res = await ipcRenderer.invoke('ui-toggle-recording');
    updateRecIndicator(res.isRecording);
    // kayıt başladıysa galeriye sonra düşeceği için şimdilik bir şey yapmıyoruz
  });
}

function updateRecIndicator(on){
  const b = $('#rec-indicator');
  const r = $('#rec-btn');
  b.hidden = !on;
  r.textContent = on ? '⏹️ Kaydı Durdur' : '⏺️ Kaydı Başlat';
}

window.addEventListener('DOMContentLoaded', async ()=>{
  initTabs();
  initActions();
  await loadGallery();
  const st = await ipcRenderer.invoke('get-status');
  updateRecIndicator(!!st.isRecording);
});

ipcRenderer.on('recording-changed', (_e, on)=>{
  updateRecIndicator(!!on);
});
