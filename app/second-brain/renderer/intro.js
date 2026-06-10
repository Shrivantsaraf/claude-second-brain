import * as THREE from '../node_modules/three/build/three.module.js';
import { Terminal } from '../node_modules/@xterm/xterm/lib/xterm.mjs';
import { FitAddon } from '../node_modules/@xterm/addon-fit/lib/addon-fit.mjs';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const win = document.getElementById('win');
const bg = document.getElementById('bg');
const statusEl = document.getElementById('status');

let scene, camera, renderer, raf = null, t = 0, t0 = performance.now();
let threeInited = false, termStarted = false, introTimer = null;
let termInstance = null, fitAddon = null;
let lastW = 0, lastH = 0;

/* orb handles + state */
let orb, orbCore, orbWire, orbHalo, orbRing, orbU;
let camZ = 5.2;
let thinking = false, ampTarget = 0.12;
let idleTimer = null, lastUserInput = 0;

/* ── soft radial glow sprite (shared by halo + ring) ─────────────── */
function glowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, inner); grd.addColorStop(0.4, inner); grd.addColorStop(1, outer);
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/* ── 3D simplex noise for the liquid displacement ────────────────── */
const SNOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

/* ── the Liquid Glass Orb (local GPU = $0 tokens) ────────────────── */
function buildOrb() {
  orbU = {
    uTime: { value: 0 },
    uAmp:  { value: 0.12 },                       // displacement: idle vs thinking
    uColA: { value: new THREE.Color(0x2a3344) },  // deep core
    uColB: { value: new THREE.Color(0xaecbff) },  // glass rim
  };

  const mat = new THREE.ShaderMaterial({
    uniforms: orbU, transparent: true,
    vertexShader: `
      ${SNOISE}
      uniform float uTime; uniform float uAmp;
      varying vec3 vN; varying vec3 vView; varying float vD;
      void main(){
        float n  = snoise(normal*1.6 + uTime*0.45);
        float n2 = snoise(normal*3.2 - uTime*0.30);
        vD = n*0.7 + n2*0.3;
        vec3 pos = position + normal * vD * uAmp;
        vec4 mv = modelViewMatrix * vec4(pos,1.0);
        vN = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColA; uniform vec3 uColB;
      varying vec3 vN; varying vec3 vView; varying float vD;
      void main(){
        float fres = pow(1.0 - max(dot(vN, vView), 0.0), 2.4);
        vec3 col = mix(uColA, uColB, fres);
        col += vec3(0.10,0.16,0.28) * smoothstep(0.2,1.0,vD);   // inner light veins
        float alpha = 0.42 + fres*0.55;
        gl_FragColor = vec4(col, alpha);
      }`,
  });
  orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 6), mat);
  scene.add(orb);

  orbCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55, 3),
    new THREE.MeshBasicMaterial({ color: 0xdfeaff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }),
  );
  scene.add(orbCore);

  orbWire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.32, 3)),
    new THREE.LineBasicMaterial({ color: 0x8fb0e6, transparent: true, opacity: 0.14 }),
  );
  scene.add(orbWire);

  orbHalo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture('rgba(150,190,255,0.5)', 'rgba(150,190,255,0)'),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  orbHalo.scale.setScalar(5); orbHalo.position.z = -1; scene.add(orbHalo);

  const R = 480, rp = new Float32Array(R * 3);
  for (let i = 0; i < R; i++) {
    const a = Math.random() * Math.PI * 2, rad = 1.6 + Math.random() * 1.4;
    rp[i*3] = Math.cos(a) * rad; rp[i*3+1] = (Math.random()*2-1) * 1.5; rp[i*3+2] = Math.sin(a) * rad;
  }
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3));
  orbRing = new THREE.Points(rg, new THREE.PointsMaterial({
    map: glowTexture(), color: 0xbcd3ff, size: 0.06, transparent: true, opacity: 0.8,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(orbRing);
}

/* swirl harder + light the pill while Claude works; ease back when idle */
function setThinking(on) {
  if (thinking === on) return;
  thinking = on;
  ampTarget = on ? 0.42 : 0.12;
  statusEl.textContent = on ? 'thinking…' : '';
  statusEl.classList.toggle('on', on);
}

function sizeRenderer() {
  const w = bg.clientWidth || 1, h = bg.clientHeight || 1;
  lastW = w; lastH = h;
  camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}

function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, camZ);
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  bg.appendChild(renderer.domElement);
  buildOrb();
  sizeRenderer();
  startLoop();
}

function startLoop() { if (!raf) raf = requestAnimationFrame(loop); }
function loop() {
  raf = requestAnimationFrame(loop);
  const now = performance.now();
  const dt = Math.min((now - t0) / 1000, 0.05); t0 = now; t += dt;

  // keep the canvas glued to #bg as it animates from full-window → left column
  if (bg.clientWidth !== lastW || bg.clientHeight !== lastH) sizeRenderer();

  // camera framing: closer during the intro (orb large), settle back for chat
  const camTarget = win.classList.contains('showterm') ? 5.2 : 3.8;
  camZ += (camTarget - camZ) * 0.06;
  camera.position.z = camZ;

  if (orbU) {
    orbU.uTime.value = t;
    orbU.uAmp.value += (ampTarget - orbU.uAmp.value) * 0.05;
    if (!reduceMotion) {
      const spin = thinking ? 0.5 : 0.12;
      orb.rotation.y += spin * 0.016;
      orb.rotation.x = Math.sin(t * 0.3) * 0.12;
      orbWire.rotation.copy(orb.rotation);
      orbCore.rotation.y -= 0.01;
      orbCore.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06);
      orbRing.rotation.y = t * (thinking ? 0.6 : 0.2);
    }
  }
  renderer.render(scene, camera);
}

/* pause the orb when the panel is hidden — saves battery, costs nothing */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
  else if (threeInited) { t0 = performance.now(); startLoop(); }
});

/* ── brief intro, replayed on every summon ──────────────────────── */
function playIntro() {
  if (!threeInited) { initThree(); threeInited = true; }
  win.classList.remove('showterm');
  win.classList.remove('showintro');
  void win.offsetWidth;                       // restart the reveal
  win.classList.add('showintro');
  const dur = termStarted ? 1400 : 2600;      // longer the very first time (Claude boots)
  if (introTimer) clearTimeout(introTimer);
  introTimer = setTimeout(finishIntro, reduceMotion ? 350 : dur);
}

function finishIntro() {
  if (introTimer) { clearTimeout(introTimer); introTimer = null; }
  if (!termStarted) { termStarted = true; initTerm(); }
  win.classList.remove('showintro');
  win.classList.add('showterm');              // orb eases into the left column (CSS width + camera lerp)
  if (termInstance) { try { fitAddon.fit(); } catch (_) {} termInstance.focus(); }
}

/* ── thinking detection: drive the orb from live PTY output ──────── */
function onPtyActivity() {
  const now = performance.now();
  // output that isn't just the echo of my own keystrokes ⇒ Claude is working
  if (now - lastUserInput > 250) setThinking(true);
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => setThinking(false), 700);
}

function initTerm() {
  const el = document.getElementById('termpane');
  termInstance = new Terminal({
    allowTransparency: true,
    fontFamily: '"JetBrains Mono", Menlo, monospace',
    fontSize: 13,
    lineHeight: 1.25,
    cursorBlink: true,
    scrollback: 5000,
    theme: {
      // monochrome gray/white palette to match the glass
      background: 'rgba(0,0,0,0)',
      foreground: '#d6dae1', cursor: '#ffffff', cursorAccent: '#0b0c10',
      selectionBackground: 'rgba(255,255,255,0.18)',
      black: '#1a1c22', red: '#c9ccd2', green: '#e6ebf2', yellow: '#cfd3da',
      blue: '#aeb4bd', magenta: '#c9ccd2', cyan: '#e6ebf2', white: '#e6ebf2',
      brightBlack: '#6b727c', brightRed: '#e6ebf2', brightGreen: '#ffffff', brightYellow: '#e6ebf2',
      brightBlue: '#cfd3da', brightMagenta: '#e6ebf2', brightCyan: '#ffffff', brightWhite: '#ffffff',
    },
  });
  fitAddon = new FitAddon();
  termInstance.loadAddon(fitAddon);
  termInstance.open(el);
  try { fitAddon.fit(); } catch (_) {}
  termInstance.focus();

  window.sb.term.onData((d) => { termInstance.write(d); onPtyActivity(); });   // PTY → screen (+ thinking)
  termInstance.onData((d) => { lastUserInput = performance.now(); window.sb.term.write(d); });
  termInstance.onResize(({ cols, rows }) => window.sb.term.resize(cols, rows));
  window.sb.term.onExit(() => {
    setThinking(false);
    termInstance.write('\r\n\x1b[90m[ session ended — ⌥Space to hide ]\x1b[0m\r\n');
  });

  window.sb.term.start(termInstance.cols, termInstance.rows);
}

/* ── resize: orb + terminal both follow the window ──────────────── */
window.addEventListener('resize', () => {
  if (renderer) sizeRenderer();
  if (fitAddon) { try { fitAddon.fit(); } catch (_) {} }
});

/* ── input wiring ───────────────────────────────────────────────── */
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && win.classList.contains('showintro')) finishIntro(); // skip the brief intro
});

document.getElementById('lt-close').addEventListener('click', () => window.sb && window.sb.win.hide());
document.getElementById('lt-min').addEventListener('click', () => window.sb && window.sb.win.minimize());
document.getElementById('lt-zoom').addEventListener('click', () => window.sb && window.sb.win.toggleMax());

if (window.sb) {
  window.sb.onPlay(playIntro);
  window.sb.onFocus(() => { if (termInstance) termInstance.focus(); });
} else {
  playIntro();
}
