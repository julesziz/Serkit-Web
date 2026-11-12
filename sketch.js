////////  VIDEO FOLDERS  ///////

let folders = [
  {
    label: "Serkit",
    videos: [
      "06-Serkit/2-Bodies-1.mp4",
      "06-Serkit/Chica-SidetoSide-2.mp4",
      "06-Serkit/Fella-Closeup-3.mp4",
      "06-Serkit/Fella-Headbob-4.mp4",
      "06-Serkit/Fella-SidetoSide-5.mp4"
    ]
  },
  {
    label: "Alarico",
    videos: [
      "01-Alarico/Alarico-1.mp4",
      "01-Alarico/Alarico-2.mp4",
      "01-Alarico/Alarico-3.mp4",
      "01-Alarico/Alarico-4.mp4",
      "01-Alarico/Alarico-5.mp4"
    ]
  },
  {
    label: "Alberto Tolo",
    videos: [
      "02-AlbertoTolo/AlbertoTolo-1.mp4",
      "02-AlbertoTolo/AlbertoTolo-2.mp4",
      "02-AlbertoTolo/AlbertoTolo-3.mp4",
      "02-AlbertoTolo/AlbertoTolo-4.mp4",
      "02-AlbertoTolo/AlbertoTolo-5.mp4"
    ]
  },
  {
    label: "Chlar",
    videos: [
      "03-Chlar/Chlar-1.mp4",
      "03-Chlar/Chlar-2.mp4",
      "03-Chlar/Chlar-3.mp4",
      "03-Chlar/Chlar-4.mp4",
      "03-Chlar/Chlar-5.mp4"
    ]
  },
  {
    label: "Future 666",
    videos: [
      "04-Future666/Future666-1.mp4",
      "04-Future666/Future666-2.mp4",
      "04-Future666/Rave-Future666-01.mp4",
      "04-Future666/Rave-Future666-02.mp4",
      "04-Future666/Rave-Future666-03.mp4"
    ]
  },
  {
    label: "Stef Mendesidis",
    videos: [
      "05-StefMendesidis/StefMendesidis-1.mp4",
      "05-StefMendesidis/StefMendesidis-2.mp4",
      "05-StefMendesidis/StefMendesidis-3.mp4",
      "05-StefMendesidis/StefMendesidis-4.mp4",
      "05-StefMendesidis/StefMendesidis-5.mp4"
    ]
  }
];

let video;
let currentFolder     = 0;
let currentVideoIndex = 0;

////////  PNG LAYERS  ///////

let animFiles = [
  "Type/serkittpe.png",
  "Type/LosAngeles.png",
  "Type/August21,2027.png",
  "Type/Alarico.png",
  "Type/AlbertoTolo.png",
  "Type/Chlar.png",
  "Type/Future666.png",
  "Type/StefMendesidis.png"
];

let animNames = [
  "Serkit Type",
  "Los Angeles",
  "Aug 21 2027",
  "Alarico",
  "Alberto Tolo",
  "Chlar",
  "Future 666",
  "Stef Mendesidis"
];

let layers = [];

function makeLayer(index) {
  return {
    index:      index,
    name:       animNames[index],
    img:        null,
    active:     false,
    frozen:     false,
    mode:       "scroll",
    size:       120,
    speed:      30,
    opacity:    255,
    posX:       0,
    posY:       0,
    scrollY:    0,
    scrollX:    0,
    flashAlpha: 0,
    flashTimer: 0,
    rotAngle:   0,
    sprites:    [],
    spawnTimer: 0
  };
}

////////  VISUAL CONTROLS  ///////

let params = {
  THRESHOLD:      127,
  OPACITY:        255,
  TRAIL_FADE:     24,
  PIXEL_SIZE:     40,
  SAMPLE_STEP:    5,
  WAVE_AMOUNT:    2,
  WAVE_FREQUENCY: 8,
  WAVE_SPEED:     0.065
};


////////  COLORS  ///////

let palettes = [
  {name:"SERKIT",          cold:[233,54,21],  mid:[228,0,230],  hot:[18,27,10]},
  {name:"Alarico",         cold:[131,70,134], mid:[228,0,230],  hot:[18,27,10]},
  {name:"Alberto Tolo",    cold:[233,54,21],  mid:[123,187,91], hot:[18,27,10]},
  {name:"Chlar",           cold:[84,83,159],  mid:[228,0,230],  hot:[18,27,10]},
  {name:"Future 666",      cold:[233,54,21],  mid:[81,101,68],  hot:[18,27,10]},
  {name:"Stef Mendesidis", cold:[233,209,73], mid:[228,0,230],  hot:[18,27,10]}
];

let currentPalette = 0;

////////  AUDIO TRACKS  ///////

let tracks = [
  { src: "tracks/Alarico - 27th District (Matrixxman Remix).mp4",
    title: "27th District (Matrixxman Remix)",
    artist: "Alarico"         },
  { src: "tracks/LadyViolence-AlbertoTolo.mp4",
    title: "Lady Violence",
    artist: "Alberto Tolo"    },
  { src: "tracks/PopulismIsMoney-Chlar.mp4",
    title: "Populism is Money",
    artist: "Chlär"           },
  { src: "tracks/TripleSixClub-Future666.mp4",
    title: "Triple Six Club",
    artist: "Future 666"      },
  { src: "tracks/Minore-Stef.mp4",
    title: "Minore",
    artist: "Stef Mendesidis" }
];


let trackAudio;
let currentTrack = 0;

////////  TRAILS ///////

let trailLayer;
let t = 0;

////////  MIRROR ///////

let mirrorMode = "horizontal";

////////  CAMERA ///////

let cam;

////////  SELECTED LAYER ///////

let selectedLayerIndex = 0;

////////  SETUP ///////

function setup() {
  createCanvas(750, 1050).parent('stage');
  setupVideo(folders[0].videos[0]);

  trailLayer = createGraphics(width, height);

  for (let i = 0; i < animFiles.length; i++) {
    let L = makeLayer(i);
    L.scrollY = height;
    L.scrollX = width;
    layers.push(L);
    loadImage(animFiles[i], img => { layers[i].img = img; });
  }

  createDJUI();

  // backup for browsers that still block autoplay: any click starts the video
  document.addEventListener('pointerdown', () => {
    if (video && video.elt.paused) video.loop();
  });
}

////////  VIDEO ///////

function setupVideo(src) {
  if (video) video.remove();
  video = createVideo([src], () => {
    video.loop();
  });
  // browsers only autoplay muted video; volume(0) alone doesn't count
  video.elt.muted = true;
  video.elt.setAttribute('playsinline', '');
  video.size(320, 240);
  video.hide();
}

////////  CAMERA ///////

function setupCamera() {
  if (video) { video.remove(); video = null; }
  if (cam) cam.remove();
  cam = createCapture(VIDEO);
  cam.size(320, 240);
  cam.hide();
}

////////  DJ CONTROLLER UI ///////

function createDJUI() {

  const $ = id => document.getElementById(id);

  function makeBtn(text, extraClass) {
    const b = document.createElement('button');
    b.className = 'btn' + (extraClass ? ' ' + extraClass : '');
    b.textContent = text;
    return b;
  }

  // only one button in a group lights up
  function setActive(container, activeEl, cls = 'active') {
    container.querySelectorAll('.btn').forEach(b => b.classList.toggle(cls, b === activeEl));
  }

  // ── Knob factory: drag up/down, double-click resets ──
  function makeKnob(parent, { label, value, min, max, step, onChange }) {
    const wrap = document.createElement('div'); wrap.className = 'knob-wrap';
    const k    = document.createElement('div'); k.className    = 'knob';
    const lbl  = document.createElement('div'); lbl.className  = 'knob-label'; lbl.textContent = label;
    const val  = document.createElement('div'); val.className  = 'knob-val';
    const decimals = step < 1 ? String(step).split('.')[1].length : 0;
    const initial  = value;
    let current    = value;

    function set(v) {
      v = Math.round(v / step) * step;
      current = Math.max(min, Math.min(max, v));
      val.textContent = current.toFixed(decimals);
      k.style.transform = `rotate(${-135 + (current - min) / (max - min) * 270}deg)`;
      onChange(current);
    }
    set(current);

    let sy = 0, sv = 0;
    k.addEventListener('pointerdown', e => {
      sy = e.clientY; sv = current;
      k.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    k.addEventListener('pointermove', e => {
      if (k.hasPointerCapture(e.pointerId)) set(sv + (sy - e.clientY) * (max - min) / 200);
    });
    k.addEventListener('dblclick', () => set(initial));

    wrap.append(k, lbl, val);
    parent.appendChild(wrap);
    return { set };
  }

  // ── Tabs ──
  const tabs   = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.toggle('active', t === tab));
    panels.forEach(p => p.classList.toggle('active', p.dataset.panel === tab.dataset.tab));
  }));

  // ── Video: folders + clips ──
  const folderEl = $('dj-folders');
  const vidEl    = $('dj-vids');
  const camBtn   = $('dj-live');

  function buildVidBtns(fi) {
    vidEl.innerHTML = '';
    folders[fi].videos.forEach((v, i) => {
      const btn = makeBtn(i + 1, 'btn-clip' + (i === 0 ? ' active' : ''));
      btn.title = v;
      btn.addEventListener('click', () => {
        if (cam) { cam.remove(); cam = null; }
        camBtn.classList.remove('active');
        currentVideoIndex = i;
        setupVideo(folders[fi].videos[i]);
        setActive(vidEl, btn);
      });
      vidEl.appendChild(btn);
    });
  }

  folders.forEach((f, i) => {
    const btn = makeBtn(f.label, i === 0 ? 'active' : '');
    btn.addEventListener('click', () => {
      if (cam) { cam.remove(); cam = null; }
      camBtn.classList.remove('active');
      currentFolder = i; currentVideoIndex = 0;
      setActive(folderEl, btn);
      buildVidBtns(i);
      setupVideo(folders[i].videos[0]);
    });
    folderEl.appendChild(btn);
  });
  buildVidBtns(0);

  camBtn.addEventListener('click', () => {
    setupCamera();
    camBtn.classList.add('active');
    setActive(folderEl, null);
    setActive(vidEl, null);
  });

  // ── Colors ──
  const palEl = $('dj-palettes');
  palettes.forEach((p, i) => {
    const btn = makeBtn(p.name, i === 0 ? 'active' : '');
    const sw  = document.createElement('div'); sw.className = 'swatch';
    [p.cold, p.mid, p.hot].forEach(c => {
      const s = document.createElement('span');
      s.style.background = `rgb(${c.join(',')})`;
      sw.appendChild(s);
    });
    btn.appendChild(sw);
    btn.addEventListener('click', () => {
      currentPalette = i;
      setActive(palEl, btn);
    });
    palEl.appendChild(btn);
  });

  // ── FX knobs ──
  const fxEl = $('dj-fx-knobs');
  [
    ['Threshold',  'THRESHOLD',      0, 255, 1    ],
    ['Opacity',    'OPACITY',        0, 255, 1    ],
    ['Dot Size',   'PIXEL_SIZE',     1,  80, 1    ],
    ['Sample',     'SAMPLE_STEP',    1,  20, 1    ],
    ['Wave Amt',   'WAVE_AMOUNT',    0,  50, 1    ],
    ['Wave Freq',  'WAVE_FREQUENCY', 0,  20, 1    ],
    ['Wave Speed', 'WAVE_SPEED',     0, 0.2, 0.005],
    ['Trail',      'TRAIL_FADE',     1,  50, 1    ]
  ].forEach(([label, key, min, max, step]) => {
    makeKnob(fxEl, { label, value: params[key], min, max, step, onChange: v => { params[key] = v; } });
  });

  // ── Type: layer pads ──
  const layerPadsEl = $('dj-layer-pads');
  const editingEl   = $('dj-editing');
  const modePadsEl  = $('dj-mode-pads');
  const modeNames   = ["scroll", "sideways", "flash", "random", "rotate"];
  const layerKnobsEl = $('dj-layer-knobs');

  const sizeKnob  = makeKnob(layerKnobsEl, { label: 'Size',    value: layers[0].size,    min: 10, max: 600, step: 1,
    onChange: v => { layers[selectedLayerIndex].size    = v; } });
  const speedKnob = makeKnob(layerKnobsEl, { label: 'Speed',   value: layers[0].speed,   min: 1,  max: 100, step: 1,
    onChange: v => { layers[selectedLayerIndex].speed   = v; } });
  const opKnob    = makeKnob(layerKnobsEl, { label: 'Opacity', value: layers[0].opacity, min: 0,  max: 255, step: 1,
    onChange: v => { layers[selectedLayerIndex].opacity = v; } });

  function refreshLayerDetail() {
    const L = layers[selectedLayerIndex];
    editingEl.innerHTML = `Editing <strong>${L.name}</strong> · ${L.active ? 'on' : 'off'} — tap it again to turn ${L.active ? 'off' : 'on'}`;
    $('dj-posx').value = L.posX; $('dj-posx-val').textContent = L.posX;
    $('dj-posy').value = L.posY; $('dj-posy-val').textContent = L.posY;
    sizeKnob.set(L.size); speedKnob.set(L.speed); opKnob.set(L.opacity);
    modePadsEl.querySelectorAll('.btn').forEach((p, i) => p.classList.toggle('active', modeNames[i] === L.mode));
    layerPadsEl.querySelectorAll('.btn').forEach((p, i) => p.classList.toggle('selected', i === selectedLayerIndex));
  }

  // tap a new pad = select it and turn it on; tap the selected pad = toggle on/off
  layers.forEach((L, i) => {
    const pad = makeBtn(L.name);
    pad.addEventListener('click', () => {
      if (selectedLayerIndex === i) L.active = !L.active;
      else { selectedLayerIndex = i; L.active = true; }
      pad.classList.toggle('active', L.active);
      refreshLayerDetail();
    });
    layerPadsEl.appendChild(pad);
  });

  modeNames.forEach(m => {
    const pad = makeBtn(m.charAt(0).toUpperCase() + m.slice(1));
    pad.addEventListener('click', () => {
      setActive(modePadsEl, pad);
      const L = layers[selectedLayerIndex];
      L.mode = m;
      L.scrollY = height; L.scrollX = width;
      L.flashAlpha = 0; L.flashTimer = 0;
      L.rotAngle = 0; L.sprites = []; L.spawnTimer = 0;
    });
    modePadsEl.appendChild(pad);
  });

  $('dj-posx').addEventListener('input', e => {
    layers[selectedLayerIndex].posX = parseInt(e.target.value);
    $('dj-posx-val').textContent = e.target.value;
  });
  $('dj-posy').addEventListener('input', e => {
    layers[selectedLayerIndex].posY = parseInt(e.target.value);
    $('dj-posy-val').textContent = e.target.value;
  });

  refreshLayerDetail();

  // ── Mirror ──
  const mirrorEl = $('dj-mirror');
  ["none", "horizontal", "vertical", "triple", "quad"].forEach(m => {
    const pad = makeBtn(m.charAt(0).toUpperCase() + m.slice(1), m === mirrorMode ? 'active' : '');
    pad.addEventListener('click', () => {
      setActive(mirrorEl, pad);
      mirrorMode = m;
    });
    mirrorEl.appendChild(pad);
  });

  // ── Track player ──
  const playBtn  = $('dj-play');
  const trackSel = $('dj-track');
  const volEl    = $('dj-vol');

  tracks.forEach((tr, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${tr.artist} — ${tr.title}`;
    trackSel.appendChild(opt);
  });

  trackAudio = new Audio(tracks[0].src);
  trackAudio.preload = 'none'; // only download when play is pressed
  trackAudio.volume  = 0.8;

  function showPlaying(on) {
    playBtn.textContent = on ? '❚❚' : '▶';
    playBtn.classList.toggle('playing', on);
  }

  function playTrack() {
    trackAudio.play().then(() => showPlaying(true)).catch(err => console.warn('Audio error:', err));
  }

  playBtn.addEventListener('click', () => {
    if (trackAudio.paused) playTrack();
    else { trackAudio.pause(); showPlaying(false); }
  });

  trackSel.addEventListener('change', () => {
    const wasPlaying = !trackAudio.paused;
    trackAudio.pause();
    currentTrack = parseInt(trackSel.value);
    trackAudio.src = tracks[currentTrack].src;
    showPlaying(false);
    if (wasPlaying) playTrack();
  });

  trackAudio.addEventListener('ended', () => showPlaying(false));
  volEl.addEventListener('input', () => { trackAudio.volume = parseInt(volEl.value) / 100; });

  // ── Save ──
  $('dj-save').addEventListener('click', () => saveCanvas('frame', 'png'));
}

////////  DRAW ///////

function draw() {
  background(0);

  t += params.WAVE_SPEED;

  if (video) video.loadPixels();
  if (cam)   cam.loadPixels();

  trailLayer.noStroke();
  trailLayer.fill(0, params.TRAIL_FADE);
  trailLayer.rect(0, 0, width, height);

  let p = palettes[currentPalette];
  let w = video ? video.width  : cam ? cam.width  : 320;
  let h = video ? video.height : cam ? cam.height : 240;

  let pixArr = video ? video.pixels : cam ? cam.pixels : [];
  let cold = p.cold, mid = p.mid, hot = p.hot;
  let step = max(1, round(params.SAMPLE_STEP)); // whole pixels only, or lookups miss

  for (let x = 0; x < w; x += step) {
    for (let y = 0; y < h; y += step) {

      let idx    = (x + y * w) * 4;
      let bright = pixArr.length
        ? (pixArr[idx] + pixArr[idx+1] + pixArr[idx+2]) / 3
        : 255;

      if (bright >= params.THRESHOLD) continue;

      let px = map(x, 0, w, width, 0);
      let py = map(y, 0, h, 0, height);

      let dx = sin(py * params.WAVE_FREQUENCY + t) * params.WAVE_AMOUNT;
      let dy = cos(px * params.WAVE_FREQUENCY + t) * params.WAVE_AMOUNT;

      let heat = map(bright, params.THRESHOLD, 0, 0, 1, true);
      // blend the palette with plain numbers instead of making p5 color objects per pixel
      let a = heat < 0.5 ? cold : mid;
      let b = heat < 0.5 ? mid  : hot;
      let f = heat < 0.5 ? heat * 2 : (heat - 0.5) * 2;

      trailLayer.fill(
        a[0] + (b[0] - a[0]) * f,
        a[1] + (b[1] - a[1]) * f,
        a[2] + (b[2] - a[2]) * f,
        params.OPACITY
      );

      drawMirrors(px + dx, py + dy, params.PIXEL_SIZE);
    }
  }

  image(trailLayer, 0, 0);

  for (let L of layers) {
    if (L.active && L.img) drawLayer(L);
  }
}
////////  DRAW SINGLE LAYER ///////

function drawLayer(L) {
  let ar   = L.img.width / L.img.height;
  let imgW = L.size * ar;
  let imgH = L.size;
  let cx   = width  / 2 + L.posX;
  let cy   = height / 2 + L.posY;
  let op   = L.opacity;
  let spd  = L.speed;

  if (L.frozen) {
    tint(255, op);
    image(L.img, cx - imgW / 2, cy - imgH / 2, imgW, imgH);
    noTint();
    return;
  }

  if (L.mode === "scroll") {
    L.scrollY -= spd;
    if (L.scrollY + imgH < 0) L.scrollY = height;
    tint(255, op);
    image(L.img, cx - imgW / 2, L.scrollY + L.posY, imgW, imgH);
    noTint();

  } else if (L.mode === "sideways") {
    L.scrollX -= spd;
    if (L.scrollX + imgW < 0) L.scrollX = width;
    tint(255, op);
    image(L.img, L.scrollX + L.posX, cy - imgH / 2, imgW, imgH);
    noTint();

  } else if (L.mode === "flash") {
    L.flashTimer++;
    let cycle = floor(map(spd, 1, 100, 120, 4));
    if      (L.flashTimer < cycle * 0.25) L.flashAlpha = map(L.flashTimer, 0,            cycle * 0.25, 0,  op);
    else if (L.flashTimer < cycle * 0.55) L.flashAlpha = op;
    else if (L.flashTimer < cycle)        L.flashAlpha = map(L.flashTimer, cycle * 0.55, cycle,        op,  0);
    else { L.flashTimer = 0; L.flashAlpha = 0; }
    if (L.flashAlpha > 0) {
      tint(255, L.flashAlpha);
      image(L.img, cx - imgW / 2, cy - imgH / 2, imgW, imgH);
      noTint();
    }

  } else if (L.mode === "random") {
    L.spawnTimer++;
    let spawnEvery = floor(map(spd, 1, 100, 90, 1));
    if (L.spawnTimer >= spawnEvery) {
      L.spawnTimer = 0;
      let sc = random(0.3, 3);
      L.sprites.push({
        x: random(imgW * sc / 2, width  - imgW * sc / 2),
        y: random(imgH * sc / 2, height - imgH * sc / 2),
        alpha: op,
        scale: sc
      });
    }
    for (let i = L.sprites.length - 1; i >= 0; i--) {
      let sp = L.sprites[i];
      let sw = imgW * sp.scale;
      let sh = imgH * sp.scale;
      tint(255, sp.alpha);
      image(L.img, sp.x - sw / 2, sp.y - sh / 2, sw, sh);
      sp.alpha -= 3;
      if (sp.alpha <= 0) L.sprites.splice(i, 1);
    }
    noTint();

  } else if (L.mode === "rotate") {
    L.rotAngle += map(spd, 1, 100, 0.005, 0.25);
    push();
    translate(cx, cy);
    rotate(L.rotAngle);
    tint(255, op);
    image(L.img, -imgW / 2, -imgH / 2, imgW, imgH);
    noTint();
    pop();
  }
}

////////  MIRROR ///////

function drawMirrors(x, y, s) {
  if (mirrorMode === "none")       { trailLayer.circle(x, y, s); return; }
  if (mirrorMode === "horizontal" || mirrorMode === "quad") trailLayer.circle(width - x, y, s);
  if (mirrorMode === "vertical"   || mirrorMode === "quad") trailLayer.circle(x, height - y, s);
  if (mirrorMode === "triple"     || mirrorMode === "quad") trailLayer.circle(width - x, height - y, s);
  trailLayer.circle(x, y, s);
}