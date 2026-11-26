// Secrets & Sins landing page
'use strict';
const KICKSTARTER = 'https://www.kickstarter.com/projects/merchantsofplay/fatal-feast-illustrated-by-award-winning-artist-riki-blanco';
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

const fx = {
  shushSynth() {
    try {
      const ac = this.ac || (this.ac = new (window.AudioContext || window.webkitAudioContext)());
      if (ac.state === 'suspended') ac.resume();
      const t = ac.currentTime, dur = 1.9, len = Math.floor(ac.sampleRate * dur);
      const buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b0 = .997 * b0 + w * .029; b1 = .985 * b1 + w * .032; b2 = .95 * b2 + w * .048; d[i] = (b0 + b1 + b2 + w * .5) * .45; }
      const src = ac.createBufferSource(); src.buffer = buf;
      const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1700;
      const bp = ac.createBiquadFilter(); bp.type = 'peaking'; bp.frequency.value = 3300; bp.Q.value = 1.4; bp.gain.value = 9;
      const bp2 = ac.createBiquadFilter(); bp2.type = 'peaking'; bp2.frequency.value = 5200; bp2.Q.value = 2; bp2.gain.value = 4;
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7500;
      bp.frequency.setValueAtTime(3000, t); bp.frequency.linearRampToValueAtTime(3500, t + .5); bp.frequency.linearRampToValueAtTime(3100, t + dur);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.32, t + 0.16);
      g.gain.linearRampToValueAtTime(0.26, t + 0.6);
      g.gain.linearRampToValueAtTime(0.22, t + 1.25);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      const trem = ac.createOscillator(), tg = ac.createGain(); trem.frequency.value = 5.5; tg.gain.value = 0.03; trem.connect(tg); tg.connect(g.gain);
      const pan = ac.createStereoPanner ? ac.createStereoPanner() : null;
      src.connect(hp); hp.connect(bp); bp.connect(bp2); bp2.connect(lp); lp.connect(g);
      if (pan) { pan.pan.setValueAtTime(-0.25, t); pan.pan.linearRampToValueAtTime(0.2, t + dur); g.connect(pan); pan.connect(ac.destination); } else g.connect(ac.destination);
      src.start(t); trem.start(t); src.stop(t + dur); trem.stop(t + dur);
    } catch (err) {}
  },
  dimPage() {
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;inset:0;z-index:100;pointer-events:none;background:radial-gradient(circle at 50% 60%,rgba(10,3,4,.35),rgba(10,3,4,.85));opacity:0';
    document.body.appendChild(d);
    d.animate([{ opacity: 0 }, { opacity: 1, offset: 0.25 }, { opacity: 1, offset: 0.55 }, { opacity: 0 }], { duration: 1800, easing: 'ease-in-out' }).onfinish = () => d.remove();
  },
  sealEnvelope(bar) {
    const h = bar.offsetHeight;
    bar.style.perspective = '800px';
    bar.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(90deg)' }], { duration: 380, easing: 'ease-in', fill: 'forwards' }).onfinish = () => {
      const env = document.createElement('div');
      env.setAttribute('role', 'status');
      env.style.cssText = 'position:relative;width:100%;max-width:620px;margin-bottom:8px;display:flex;flex-direction:column;align-items:center;gap:14px';
      env.innerHTML =
        '<div data-burn style="position:relative;width:40%;overflow:visible"><img src="assets/envelope.webp" alt="Sealed envelope" style="display:block;width:100%;height:auto;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5));-webkit-mask-image:linear-gradient(0deg,transparent 40%,#000 60%);mask-image:linear-gradient(0deg,transparent 40%,#000 60%);-webkit-mask-size:100% 300%;mask-size:100% 300%;-webkit-mask-position:0 0;mask-position:0 0"></div>' +
        '<a data-ks href="' + KICKSTARTER + '" target="_blank" rel="noopener" style="position:relative;z-index:6;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:60px;margin-top:6px;padding:12px 40px;border-radius:6px;background:#05ce78;color:#0b1f14;text-decoration:none;font:700 18px \'Figtree\',sans-serif;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 0 0 1px rgba(120,255,190,.5),0 0 24px rgba(5,206,120,.45),0 0 60px rgba(5,206,120,.25);transition:background .2s,box-shadow .2s" onmouseover="this.style.background=\'#2fe08f\';this.style.boxShadow=\'0 0 0 1px #8fffc4,0 0 30px rgba(5,206,120,.8),0 0 70px rgba(5,206,120,.45)\'" onmouseout="this.style.background=\'#05ce78\';this.style.boxShadow=\'0 0 0 1px rgba(120,255,190,.5),0 0 24px rgba(5,206,120,.45),0 0 60px rgba(5,206,120,.25)\'"><span>Follow the Kickstarter Campaign Now</span><span style="font-size:12px;font-weight:600;letter-spacing:.08em;opacity:.85">Extra bonus if we reach 1K before launch</span></a>' +
        '<div style="font-family:\'Figtree\',sans-serif;font-weight:600;font-size:clamp(13px,1.1vw,16px);letter-spacing:.22em;line-height:1.6;color:#cbb9a6;text-align:center;text-transform:uppercase;text-wrap:balance;margin-top:4px">Your Secrets &amp; Sins Rewards will soon be revealed. Keep an eye on your inbox.</div>' +
        '';
      const title = bar.nextElementSibling, desc = title && title.nextElementSibling;
      if (title) title.style.display = 'none';
      if (desc) desc.textContent = 'Check your inbox shortly for details about your subscriber-only rewards.';
      bar.style.display = 'none';
      bar.parentNode.insertBefore(env, bar.nextSibling);
      const kb = env.querySelector('a[data-ks]'), bw = env.querySelector('[data-burn]');
      if (kb && bw) bw.style.width = Math.min(kb.offsetWidth, env.offsetWidth) + 'px';
      if (kb && bw) { const hold = document.createElement('div'); hold.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding-bottom:26px;z-index:6;pointer-events:none'; bw.appendChild(hold); hold.appendChild(kb); kb.style.marginTop = '0'; }
      const bimg = bw && bw.querySelector('img'); if (bimg) { const fix = () => { bw.style.height = bimg.offsetHeight + 'px'; }; bimg.complete ? fix() : bimg.addEventListener('load', fix); }
      const ks = env.querySelectorAll('[data-ks]');
      ks.forEach(el => { el.style.opacity = '0'; el.style.pointerEvents = 'none'; });
      env.animate([{ transform: 'perspective(800px) rotateX(-90deg)' }, { transform: 'perspective(800px) rotateX(0deg)' }], { duration: 520, easing: 'cubic-bezier(.2,.9,.3,1.2)' });
      setTimeout(() => this.burnEnvelope(env, ks), 1900);
    };
  },
  burnEnvelope(env, ks) {
    fx.fire();
    this.pieceN = 0;
    const wrap = env.querySelector('[data-burn]'); if (!wrap) return;
    const img = wrap.querySelector('img'), D = 2200, W = wrap.offsetWidth, H = img.offsetHeight, SRC = img.src;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const char = img.cloneNode();
    char.alt = ''; char.setAttribute('aria-hidden', 'true');
    char.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:auto;display:block;pointer-events:none;filter:brightness(.18) sepia(1) saturate(2);-webkit-mask-image:linear-gradient(0deg,transparent 40%,#000 41%,#000 45%,transparent 50%);mask-image:linear-gradient(0deg,transparent 40%,#000 41%,#000 45%,transparent 50%);-webkit-mask-size:100% 300%;mask-size:100% 300%;-webkit-mask-position:0 0;mask-position:0 0';
    wrap.appendChild(char);
    const wave = (n, amp) => { const v = Array.from({ length: n + 2 }, () => rnd(-1, 1)); return x => { const t = x / 100 * n, i = Math.floor(t), f = t - i, s = (1 - Math.cos(f * Math.PI)) / 2; return amp * (v[i] * (1 - s) + v[i + 1] * s); }; };
    const w1 = wave(rnd(2, 3.5), 6), w2 = wave(rnd(7, 11), 2.6), w3 = wave(rnd(22, 32), 1.1), w4 = wave(rnd(60, 80), .45), tilt = rnd(-2.5, 2.5);
    const bites = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => [rnd(6, 94), rnd(1.4, 4), rnd(2.5, 5.5)]);
    const L = []; for (let x = 0; x <= 100.001; x += .5) L.push([Math.min(100, x), w1(x) + w2(x) + w3(x) + w4(x) + tilt * (x - 50) / 50 - bites.reduce((a, [c, w, h]) => a + h * Math.exp(-(((x - c) / w) ** 2)), 0)]);
    const cw = wave(rnd(4, 7), 1.8);
    const L2 = L.map(([x, d]) => [x, d - 6.5 - cw(x)]);
    const B = Math.ceil(101 - Math.min(...L2.map(p => p[1]))), S = Math.max(230, Math.ceil(B + Math.max(...L.map(p => p[1])) + 101));
    const gid = 'b' + Math.random().toString(36).slice(2, 8);
    const svgUrl = (inner, vh) => 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 ' + vh + '" preserveAspectRatio="none">' + inner + '</svg>') + '")';
    const line = (pts, base) => pts.map(([x, d]) => x.toFixed(2) + ',' + (base + d).toFixed(2)).join(' ');
    const mainMask = svgUrl('<polygon points="0,-10 100,-10 ' + line(L.slice().reverse(), B) + '" fill="#000"/>', S);
    const charMask = svgUrl('<defs><filter id="s" x="-5%" y="-50%" width="110%" height="200%"><feGaussianBlur stdDeviation="0 1.6"/></filter><clipPath id="c"><polygon points="0,-10 100,-10 ' + line(L.slice().reverse(), B) + '"/></clipPath></defs><g clip-path="url(#c)"><polygon points="' + line(L, B + 3) + ' ' + line(L2.slice().reverse(), B) + '" fill="#000" filter="url(#s)"/></g>', S);
    [[img, mainMask], [char, charMask]].forEach(([el, m]) => { el.style.webkitMaskImage = m; el.style.maskImage = m; el.style.webkitMaskSize = '100% ' + S + '%'; el.style.maskSize = '100% ' + S + '%'; el.style.webkitMaskRepeat = 'no-repeat'; el.style.maskRepeat = 'no-repeat'; });
    const edge = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    edge.setAttribute('viewBox', '0 0 100 16'); edge.setAttribute('preserveAspectRatio', 'none'); edge.setAttribute('aria-hidden', 'true');
    const eh = H * .16;
    edge.style.cssText = 'position:absolute;left:0;width:100%;height:' + eh + 'px;bottom:0;transform:translateY(50%);overflow:visible;pointer-events:none;mix-blend-mode:screen';
    const ep = line(L, 8);
    const gl = Array.from({ length: 14 }, (_, i) => '<stop offset="' + (i / 13).toFixed(3) + '" stop-color="#fff" stop-opacity="' + rnd(.3, 1).toFixed(2) + '"/>').join('');
    edge.innerHTML = '<defs><filter id="' + gid + 'f" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="1.1"/></filter><linearGradient id="' + gid + 'g">' + gl + '</linearGradient><mask id="' + gid + 'm" maskUnits="userSpaceOnUse" x="-5" y="-40" width="110" height="96"><rect x="-5" y="-40" width="110" height="96" fill="url(#' + gid + 'g)"/></mask></defs><g mask="url(#' + gid + 'm)">' +
      '<polyline points="' + ep + '" fill="none" stroke="#ff5a24" stroke-width="2.6" vector-effect="non-scaling-stroke" style="stroke-width:7px" filter="url(#' + gid + 'f)" opacity=".9"/>' +
      '<polyline points="' + ep + '" fill="none" stroke="#ff9a3c" stroke-width="1.6" vector-effect="non-scaling-stroke" style="stroke-width:3px"/>' +
      '<polyline points="' + ep + '" fill="none" stroke="#ffe0a0" stroke-width="1" vector-effect="non-scaling-stroke" style="stroke-width:1.2px"/></g>';
    const clip = document.createElement('div');
    clip.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:' + H + 'px;overflow:hidden;pointer-events:none';
    clip.appendChild(edge); wrap.appendChild(clip);
    const ease = 'cubic-bezier(.45,.05,.55,.95)';
    const mk = (from, to) => [{ maskPosition: from, webkitMaskPosition: from }, { maskPosition: to, webkitMaskPosition: to }];
    img.animate(mk('0 0', '0 100%'), { duration: D, easing: ease, fill: 'forwards' });
    char.animate(mk('0 0', '0 100%'), { duration: D, easing: ease, fill: 'forwards' });
    edge.animate([{ bottom: (100 - B) + '%' }, { bottom: (S - B) + '%' }], { duration: D, easing: ease, fill: 'forwards' });
    edge.animate([{ opacity: 1 }, { opacity: 1, offset: .9 }, { opacity: 0 }], { duration: D, fill: 'forwards' });
    edge.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.5)' }, { filter: 'brightness(.85)' }], { duration: 160, iterations: Math.ceil(D / 160), direction: 'alternate' });
    fx.ghost(wrap, D);
    const t0 = performance.now();
    const spawn = () => {
      const p = Math.min(1, (performance.now() - t0) / D); if (p >= .97) return;
      const q = p * p * (3 - 2 * p), lineY = Math.max(0, Math.min(H, H * (B - (S - 100) * q) / 100));
      for (let k = 0; k < 2; k++) {
        const sz = rnd(10, 26), x = rnd(0, W - sz), y = Math.max(0, lineY - sz * .6);
        const pts = Array.from({ length: 6 }, (_, i) => { const ang = i / 6 * Math.PI * 2, r = rnd(32, 50); return (50 + Math.cos(ang) * r).toFixed(0) + '% ' + (50 + Math.sin(ang) * r).toFixed(0) + '%'; }).join(',');
        const ground = wrap;
        const rx = rnd(W * .04, Math.max(1, W * .96 - sz)), ry = H - sz * rnd(.55, 1.1);
        const ox = x - rx, oy = y - ry;
        const o = document.createElement('div'), pc = document.createElement('div');
        o.style.cssText = 'position:absolute;left:' + rx + 'px;top:' + ry + 'px;width:' + sz + 'px;height:' + sz + 'px;pointer-events:none';
        pc.style.cssText = 'width:100%;height:100%;background:url(' + SRC + ') -' + x + 'px -' + y + 'px/' + W + 'px ' + H + 'px no-repeat;clip-path:polygon(' + pts + ')';
        o.appendChild(pc); ground.appendChild(o);
        this.pieceN = (this.pieceN || 0) + 1;
        const sizzle = this.pieceN === 7 || this.pieceN === 19 || this.pieceN === 34;
        const dx = rnd(-30, 30), rot = rnd(-540, 540), rest = rnd(-35, 35), dur = rnd(1100, 1800);
        o.animate([{ transform: 'translate(' + ox + 'px,' + oy + 'px) rotate(0deg)' }, { transform: 'translate(' + (ox * .45 + dx) + 'px,' + (oy * .45) + 'px) rotate(' + (rot * .7) + 'deg)', offset: .7 }, { transform: 'translate(0px,-6px) rotate(' + (rest + rot * .05) + 'deg)', offset: .92 }, { transform: 'translate(0px,0px) rotate(' + rest + 'deg)' }], { duration: dur, easing: 'cubic-bezier(.35,0,.75,.55)', fill: 'forwards' });
        pc.animate([{ filter: 'brightness(.9) sepia(.6)' }, { filter: 'brightness(.3) sepia(1)', offset: .3 }, { filter: 'brightness(.22) sepia(1) saturate(1.4)' }], { duration: dur, fill: 'forwards' });
        if (sizzle) {
          const glowA = 'drop-shadow(0 0 1px #ffd27a) drop-shadow(0 0 3px #ff7a2c) drop-shadow(0 0 7px rgba(255,90,36,.75))';
          const glowB = 'drop-shadow(0 0 1px #ffb04a) drop-shadow(0 0 2px #ff5a24) drop-shadow(0 0 4px rgba(255,90,36,.45))';
          o.style.filter = glowA;
          o.animate([{ filter: glowA }, { filter: glowB }, { filter: glowA, offset: .55 }, { filter: glowB, offset: .8 }, { filter: glowA }], { duration: 900, iterations: Infinity, delay: dur, easing: 'ease-in-out' });
          const pop = () => {
            if (!o.isConnected) return;
            const sp = document.createElement('span'), z = rnd(1.5, 3);
            sp.style.cssText = 'position:absolute;left:' + rnd(20, 80) + '%;top:20%;width:' + z + 'px;height:' + z + 'px;border-radius:50%;background:#ffbd59;box-shadow:0 0 5px #ff7a2c;pointer-events:none';
            o.appendChild(sp);
            sp.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(' + rnd(-10, 10) + 'px,' + rnd(-26, -12) + 'px)', opacity: 0 }], { duration: rnd(500, 900), easing: 'ease-out', fill: 'forwards' }).onfinish = () => sp.remove();
            setTimeout(pop, rnd(600, 1600));
          };
          setTimeout(pop, dur + 300);
        }
      }
      for (let k = 0; k < (Math.random() < .5 ? 1 : 0); k++) {
        const sp = document.createElement('span'), sz = rnd(3, 7);
        sp.style.cssText = 'position:absolute;left:' + rnd(0, W) + 'px;top:' + lineY + 'px;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:' + (Math.random() < .5 ? '#ffbd59' : '#ff5a24') + ';box-shadow:0 0 6px #ff7a2c;pointer-events:none;z-index:4';
        wrap.appendChild(sp);
        sp.style.boxShadow = '0 0 8px #ff7a2c';
        sp.animate([{ transform: 'translate(0,0)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: 'translate(' + rnd(-30, 30) + 'px,' + rnd(-150, -60) + 'px)', opacity: 0 }], { duration: rnd(900, 1800), easing: 'ease-out', fill: 'forwards' }).onfinish = () => sp.remove();
      }
      setTimeout(spawn, 70);
    };
    spawn();
    setTimeout(() => {
      const sx = W * .45, sy = H * .4, sw = W * .1, sh = H * .34;
      const ghost = document.createElement('div');
      ghost.style.cssText = 'position:absolute;left:' + sx + 'px;top:' + sy + 'px;width:' + sw + 'px;height:' + sh + 'px;background:url(' + SRC + ') -' + sx + 'px -' + sy + 'px/' + W + 'px ' + H + 'px no-repeat;filter:grayscale(1) contrast(3.2) brightness(1.5) blur(.5px);mix-blend-mode:screen;pointer-events:none;z-index:5;transform-origin:50% 60%';
      wrap.appendChild(ghost);
      ghost.animate([{ transform: 'translateY(0) scale(1)', opacity: 0, filter: 'grayscale(1) contrast(3.2) brightness(1.5) blur(.5px)' }, { opacity: .75, offset: .12 }, { transform: 'translateY(' + (-H * 1.2) + 'px) scale(1.9,2.1)', opacity: .45, filter: 'grayscale(1) contrast(3) brightness(1.4) blur(4px)', offset: .6 }, { transform: 'translateY(' + (-H * 2.6) + 'px) scale(2.8,3.2)', opacity: 0, filter: 'grayscale(1) contrast(2.5) brightness(1.3) blur(12px)' }], { duration: 3200, easing: 'cubic-bezier(.3,.1,.4,1)', fill: 'forwards' }).onfinish = () => ghost.remove();
      for (let k = 0; k < 9; k++) {
        const pf = document.createElement('div'), sz = rnd(24, 56);
        pf.style.cssText = 'position:absolute;left:' + (sx + sw / 2 - sz / 2 + rnd(-20, 20)) + 'px;top:' + (sy + sh / 2 - sz / 2) + 'px;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:radial-gradient(circle,rgba(200,190,185,.35),rgba(200,190,185,0) 70%);filter:blur(4px);pointer-events:none;z-index:4';
        wrap.appendChild(pf);
        pf.animate([{ transform: 'translate(0,0) scale(.6)', opacity: 0 }, { opacity: .8, offset: .2 }, { transform: 'translate(' + rnd(-50, 50) + 'px,' + (-H * rnd(1.6, 2.8)) + 'px) scale(' + rnd(2, 3.5) + ')', opacity: 0 }], { duration: rnd(2200, 3400), delay: k * 140, easing: 'ease-out', fill: 'forwards' }).onfinish = () => pf.remove();
      }
    }, D * .5);
    setTimeout(() => {
      ks.forEach((el, i) => { el.style.pointerEvents = 'auto'; el.animate([{ opacity: 0, transform: 'translateY(10px) scale(.96)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 550, delay: i * 120, easing: 'cubic-bezier(.2,.9,.3,1.2)', fill: 'forwards' }); });
    }, D + 150);
  }
};

// ---------- observers. An explicit document root makes the margins work inside the Strikingly frame ----------
const watch = (margin, fn, threshold = 0) => {
  try { return new IntersectionObserver(fn, { root: document, rootMargin: margin, threshold }); }
  catch (e) { return new IntersectionObserver(fn, { rootMargin: margin, threshold }); }
};
const saver = !!(navigator.connection && navigator.connection.saveData);

// ---------- videos: still frame first, load when close, play only while really on screen ----------
// iPhones refuse or pause muted video started while it is off screen (and inside the Strikingly frame),
// so play is tried once it is visible, retried if the phone pauses it, and a tap plays it too
// (Low Power Mode blocks autoplay entirely).
const posters = watch('1400px 0px', (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.poster = e.target.dataset.poster; posters.unobserve(e.target); } }));
const tryPlay = (v) => {
  if (!v.src || !v.inView) return;
  const p = v.play(); if (p && p.catch) p.catch(() => {});
};
const load = (v) => {
  if (v.src) return;
  if (!v.poster) v.poster = v.dataset.poster;
  v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
  v.autoplay = true; v.preload = 'auto'; v.src = v.dataset.src;
  v.addEventListener('loadeddata', () => tryPlay(v));
  v.addEventListener('canplay', () => tryPlay(v));
  v.addEventListener('pause', () => { if (v.inView && (v.tries = (v.tries || 0) + 1) < 6) setTimeout(() => tryPlay(v), 500); });
};
const loaders = watch('700px 0px', (es) => es.forEach((e) => { if (e.isIntersecting && !saver) { load(e.target); loaders.unobserve(e.target); } }));
const players = watch('0px', (es) => es.forEach((e) => {
  const v = e.target, seen = e.isIntersecting && e.intersectionRatio >= 0.2;
  if (seen && !v.inView) v.tries = 0;
  v.inView = seen;
  if (seen) { if (!saver) load(v); tryPlay(v); }
  else if (!e.isIntersecting && v.src) v.pause();
}), [0, 0.2, 0.5]);
$$('video.lz').forEach((v) => {
  posters.observe(v); loaders.observe(v); players.observe(v);
  v.addEventListener('click', () => { load(v); v.inView = true; v.tries = 0; tryPlay(v); });
});

// ---------- card scenes ----------
const scenes = watch('200px 0px', (es) => es.forEach((e) => { e.isIntersecting ? start(e.target) : stop(e.target); }));
const timers = new Map();
const stop = (el) => { clearInterval(timers.get(el)); timers.delete(el); };
const ready = (src) => { const i = new Image(); i.src = src; return i.decode ? i.decode().catch(() => {}) : Promise.resolve(); };
const SMUGGLERS = ['back', '15', '03', '01', '08', '07', '12', '18'];
const POOL = ['01','03','05','06','08','11','13','16','20','22','24','27','31','33','36','38','40','41','45','46','50','57','59'];
const ORDER = [4, 0, 2, 5, 1, 3];
const step = {
  closeup(el) {
    el.n = ((el.n || 0) + 1) % SMUGGLERS.length;
    const src = 'assets/s/' + SMUGGLERS[el.n] + '.webp', main = el.querySelector('.cumain');
    ready(src).then(() => { main.src = src; });
  },
  treasures(el) {
    const k = el.n || 0; el.n = (k + 1) % 24;
    const img = el.querySelectorAll('.tr img')[ORDER[k % 6]], src = 'assets/t/' + (k === 23 ? 'back' : POOL[k % 23]) + '.webp';
    ready(src).then(() => {
      img.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(90deg)' }], { duration: 275, easing: 'ease-in', fill: 'forwards' }).onfinish = () => {
        img.src = src;
        img.animate([{ transform: 'rotateY(-90deg)' }, { transform: 'rotateY(0deg)' }], { duration: 275, easing: 'ease-out', fill: 'forwards' });
      };
    });
  },
};
const start = (el) => { if (!timers.has(el)) timers.set(el, setInterval(() => step[el.dataset.scene](el), el.dataset.scene === 'closeup' ? 2000 : 1000)); };
$$('[data-scene]').forEach((el) => scenes.observe(el));

// ---------- floating keyhole ----------
const fab = document.querySelector('.fab'), closing = document.querySelector('[data-screen-label="08 Closing sign-up"]');
const onScroll = () => fab.classList.toggle('on', scrollY > 300 && closing.getBoundingClientRect().top >= innerHeight * 0.8);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
// Glide to the closing email box and wait until the glide has really finished before touching the box.
// Phones get no automatic keyboard: on iPhones it popped up mid-glide and stopped the scroll part-way.
// There the box sits in the top third, glows, and the person's own tap opens the keyboard.
fab.addEventListener('click', () => {
  const row = closing.querySelector('[data-m=row]'), input = row && row.querySelector('input[type=email]'); if (!input) return;
  const touch = matchMedia('(hover: none)').matches;
  const want = () => Math.round(scrollY + (touch
    ? row.getBoundingClientRect().top - innerHeight * 0.3
    : input.getBoundingClientRect().top + input.offsetHeight / 2 - innerHeight / 2));
  let off = false, last = scrollY, still = 0, moved = false; const t0 = performance.now();
  const stop = () => { off = true; };
  addEventListener('touchstart', stop, { once: true, passive: true });
  const arrive = () => {
    removeEventListener('touchstart', stop);
    const y = want(); if (Math.abs(y - scrollY) > 3) scrollTo(0, y);
    row.animate([
      { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: 'rgba(255,189,89,0)', outlineOffset: '12px' },
      { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: 'rgba(255,189,89,.95)', outlineOffset: '5px', offset: 0.4 },
      { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: 'rgba(255,189,89,0)', outlineOffset: '3px' },
    ], { duration: 1000, iterations: 2, easing: 'ease-out' });
    if (touch) { input.placeholder = 'Enter your email'; input.dataset.ph = ''; }
    else input.focus({ preventScroll: true });
  };
  const tick = () => {
    if (off) return;
    const y = scrollY; if (Math.abs(y - last) > 0.5) { moved = true; still = 0; } else still++; last = y;
    const t = performance.now() - t0;
    if ((still > 6 && (moved || t > 400)) || t > 3000) arrive(); else requestAnimationFrame(tick);
  };
  scrollTo({ top: want(), behavior: 'smooth' });
  requestAnimationFrame(tick);
});

// ---------- sounds: fetched when someone reaches for the email box, decoded during their tap and played ----------
// ---------- through the AudioContext that tap unlocked, so phones still play them after the Mailchimp wait ----------
const SOUNDS = { whisper: 'assets/whisper.mp3', fire: 'assets/fire.m4a' };
const rawSound = {}, sound = {};
const fetchSounds = () => {
  for (const k in SOUNDS) if (!rawSound[k]) rawSound[k] = fetch(SOUNDS[k]).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null);
};
const decodeSounds = () => {
  fetchSounds();
  for (const k in SOUNDS) if (!sound[k]) sound[k] = rawSound[k].then((b) => b && new Promise((ok) => fx.ac.decodeAudioData(b, ok, () => ok(null)))).catch(() => null);
};
const soon = (p, ms) => Promise.race([p || Promise.resolve(null), new Promise((r) => setTimeout(() => r(null), ms))]);
fx.shush = async () => { // the whisper, or the design's synthesized shush if it can't load
  const buf = fx.ac && await soon(sound.whisper, 1500);
  if (!buf) { fx.shushSynth(); return; }
  const src = fx.ac.createBufferSource(), g = fx.ac.createGain();
  src.buffer = buf; g.gain.value = 0.9; src.connect(g); g.connect(fx.ac.destination); src.start();
};
fx.fire = async () => { // fades in with the flames, out as the envelope finishes burning
  const buf = fx.ac && await soon(sound.fire, 800);
  if (!buf) return;
  const ac = fx.ac, t = ac.currentTime, src = ac.createBufferSource(), g = ac.createGain();
  src.buffer = buf;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.85, t + 0.44);
  g.gain.setValueAtTime(0.85, t + 2.4); g.gain.linearRampToValueAtTime(0, t + 3.4);
  src.connect(g); g.connect(ac.destination); src.start(t); src.stop(t + 3.5);
};

// ---------- smoke skull: the skull on the wax seal lifts off as smoke while the envelope burns ----------
const SKULL = 'M112 57C121 50 137 47 156 47C176 47 192 50 201 57C210 64 214 76 215 92C216 106 215 120 212 130C209 140 205 146 199 151L195 154C193 166 191 180 188 190C185 200 180 205 172 206L130 206C121 205 116 200 114 191C112 182 111 168 110 155L106 150C100 145 97 138 95 130C92 118 91 104 92 92C93 76 101 64 112 57Z' +
  'M145 105C138 96 127 89 117 90C108 91 105 99 105 107C105 116 109 122 115 121C126 120 138 112 145 105Z' +
  'M158 113C165 101 178 89 191 87C201 86 207 95 206 105C205 115 201 123 194 123C183 122 168 119 158 113Z' +
  'M152 118C147 124 140 130 139 137C138 144 143 148 149 147L154 144L159 147C165 148 171 144 170 137C169 130 158 123 152 118Z' +
  'M120 156L131 155L136 167L142 167L146 156L155 156L159 163L163 157L178 157L181 161L182 180L176 181L168 172L163 181L155 182L150 174L145 182L138 182L132 175L127 181L119 180Z';
fx.ghost = (wrap, D) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const art = wrap.querySelector('img'), W = wrap.offsetWidth, H = art.offsetHeight;
  if (!W || !H) return;
  // where the skull sits on the envelope art (1240 x 486)
  const L = 558 / 1240 * W, T = 194 / 486 * H, SW = 132 / 1240 * W, SH = 166 / 486 * H, id = 'smoke' + Date.now();
  const g = document.createElement('div');
  g.setAttribute('aria-hidden', 'true');
  g.style.cssText = 'position:absolute;left:' + L + 'px;top:' + T + 'px;width:' + SW + 'px;height:' + SH + 'px;z-index:4;pointer-events:none;opacity:0;transform-origin:50% 75%;will-change:transform,opacity';
  g.innerHTML = '<svg viewBox="88 44 132 166" width="100%" height="100%" style="display:block;overflow:visible">' +
    '<defs><filter id="' + id + '" x="-60%" y="-80%" width="220%" height="260%" color-interpolation-filters="sRGB">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.04 0.028" numOctaves="2" seed="11" result="n"/>' +
    '<feOffset in="n" dy="0" result="m"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="m" scale="2" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
    '<feGaussianBlur in="d" stdDeviation="0.4" result="s"/>' +
    '<feGaussianBlur in="d" stdDeviation="3" result="h"/>' +
    '<feComponentTransfer in="h" result="h2"><feFuncA type="linear" slope=".75"/></feComponentTransfer>' +
    '<feMerge><feMergeNode in="h2"/><feMergeNode in="s"/></feMerge></filter>' +
    '<filter id="' + id + 't" x="-150%" y="-40%" width="400%" height="180%" color-interpolation-filters="sRGB">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.07 0.02" numOctaves="2" seed="3" result="n"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="30" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
    '<feGaussianBlur in="d" stdDeviation="7"/></filter></defs>' +
    '<path class="tail" opacity="0" fill="#efe6dc" filter="url(#' + id + 't)" d="M120 186C112 232 134 270 146 318C150 330 154 330 158 318C170 270 192 232 184 186Z"/>' +
    '<path d="' + SKULL + '" fill="#efe6dc" fill-rule="evenodd" filter="url(#' + id + ')"/></svg>';
  wrap.appendChild(g);
  const off = g.querySelector('feOffset'), disp = g.querySelector('feDisplacementMap'), [sharp, halo] = g.querySelectorAll('feGaussianBlur'), tail = g.querySelector('.tail');
  const t0 = performance.now() + D * .4, dur = 3600;
  const tick = (now) => {
    if (!g.isConnected) return;
    const t = (now - t0) / dur;
    if (t < 0) { requestAnimationFrame(tick); return; }
    if (t >= 1) { g.remove(); return; }
    // clear skull first, then it stretches, wisps apart and thins out as it climbs
    const op = t < .1 ? t / .1 * .88 : t < .3 ? .88 - (t - .1) * .4 : .8 * Math.pow(1 - (t - .3) / .7, 1.4);
    const rise = H * 1.5 * (1 - Math.pow(1 - t, 1.6));
    const sx = 1 + 1.6 * t, sy = 1 + 2.2 * t, sway = Math.sin(t * Math.PI * 1.7) * SW * .3 * t, skew = Math.sin(t * Math.PI * 2.3) * 8 * t;
    g.style.opacity = op.toFixed(3);
    g.style.transform = 'translate(' + sway.toFixed(1) + 'px,' + (-rise).toFixed(1) + 'px) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ') skewX(' + skew.toFixed(2) + 'deg)';
    off.setAttribute('dy', (-70 * t).toFixed(1));
    disp.setAttribute('scale', (6 + 44 * Math.pow(t, 1.2)).toFixed(1));
    sharp.setAttribute('stdDeviation', (0.7 + 4.5 * Math.pow(t, 1.3)).toFixed(2));
    halo.setAttribute('stdDeviation', (4 + 10 * t).toFixed(2));
    tail.setAttribute('opacity', (Math.min(1, t / .15) * Math.pow(1 - t, .9) * .7).toFixed(3));
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

// ---------- sign-up: saves to the Mailchimp audience "Collections FF BOTV" ----------
const tell = (type) => { // the Strikingly page around this one holds the Meta Pixel
  if (parent === window) return;
  parent.postMessage({ source: 'secrets-sins', type, contentName: 'Secrets and Sins Signup - ' + (innerWidth < 768 ? 'Mobile' : 'Desktop') }, '*');
};
const subscribe = (email) => {
  const U = '58f7b89014bab2b3fb5363938', ID = 'be71c311db', q = new URLSearchParams(location.search), cb = 'mcSignup' + Date.now();
  const data = new URLSearchParams({
    u: U, id: ID, f_id: '00ce47e4f0', EMAIL: email,
    MERGE5: q.get('utm_source') || '', MERGE6: q.get('utm_medium') || '', MERGE7: q.get('utm_campaign') || '', MERGE8: q.get('utm_content') || '',
    ['b_' + U + '_' + ID]: '', c: cb,
  });
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    const end = (fn, v) => { clearTimeout(timer); window[cb] = () => {}; s.remove(); fn(v); };
    const timer = setTimeout(() => end(reject, new Error('timeout')), 12000);
    window[cb] = (r) => end(resolve, r || {});
    s.onerror = () => end(reject, new Error('network'));
    s.src = 'https://skybloomgame.us7.list-manage.com/subscribe/post-json?' + data;
    document.body.appendChild(s);
  });
};
const cleanMsg = (m) => String(m || '').replace(/<[^>]*>/g, '').replace(/^\d+\s*-\s*/, '').trim() || 'Something went wrong. Please try again.';
const showError = (row, text) => {
  let el = row.nextElementSibling; if (!el || !el.hasAttribute('data-signup-error')) el = null;
  if (!text) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('div'); el.setAttribute('data-signup-error', ''); el.setAttribute('role', 'alert'); row.after(el); }
  el.textContent = text;
};
const unlock = async (row) => {
  const input = row.querySelector('input[type=email]'), btn = row.querySelector('.unlock');
  if (row.dataset.busy) return;
  if (row.querySelector('input[name=ss_hp]').value) { tell('bot'); return; }
  showError(row, '');
  if (!row.dataset.bs) row.dataset.bs = row.style.boxShadow || 'none';
  const email = input.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    input.value = ''; input.placeholder = 'Enter your email to unlock your reward';
    row.style.boxShadow = 'inset 0 0 0 2px #ff5a24,0 20px 50px rgba(0,0,0,.5),0 0 60px rgba(255,90,36,.35)';
    row.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(0)' }], { duration: 360 });
    input.focus(); input.oninput = () => { row.style.boxShadow = row.dataset.bs; };
    return;
  }
  input.blur();
  // sound has to be armed during the tap itself, before we wait on Mailchimp
  try { fx.ac = fx.ac || new (window.AudioContext || window.webkitAudioContext)(); fx.ac.resume(); decodeSounds(); } catch (e) {}
  row.dataset.busy = '1'; btn.disabled = true;
  let error = '', fresh = false;
  try {
    const r = await subscribe(email);
    fresh = r.result === 'success';
    if (!fresh && !/already subscribed/i.test(r.msg || '')) error = cleanMsg(r.msg);
  } catch (e) { error = 'We couldn’t reach the sign-up service. Please try again.'; }
  delete row.dataset.busy; btn.disabled = false;
  if (error) { showError(row, error); return; }
  if (fresh) tell('lead');
  fx.shush(); fx.dimPage(); fx.sealEnvelope(row);
};
$$('[data-m=row]').forEach((row) => {
  const input = row.querySelector('input[type=email]');
  const hp = document.createElement('input');
  hp.type = 'text'; hp.name = 'ss_hp'; hp.tabIndex = -1; hp.autocomplete = 'off'; hp.setAttribute('aria-hidden', 'true');
  hp.style.cssText = 'position:absolute;left:-5000px;width:1px;height:1px;opacity:0';
  row.appendChild(hp);
  row.querySelector('.unlock').addEventListener('click', () => unlock(row));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); unlock(row); } });
  const ask = () => { input.placeholder = 'Enter your email'; input.dataset.ph = ''; };
  const rest = () => { if (document.activeElement !== input) { input.placeholder = 'Claim Subscriber-Only Rewards'; input.dataset.ph = 'claim'; } };
  input.addEventListener('mouseenter', ask); input.addEventListener('mouseleave', rest);
  input.addEventListener('focus', () => { ask(); new Image().src = 'assets/envelope.webp'; fetchSounds(); });
  input.addEventListener('blur', rest);
});
