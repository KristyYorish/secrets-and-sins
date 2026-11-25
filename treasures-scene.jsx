const TR_A = 'assets/treasures/';
const TR_POOL = ['01','03','05','06','08','11','13','16','20','22','24','27','31','33','36','38','40','41','45','46','50','57','59'];
const TR_C = 3, TR_R = 2, TR_SLOTS = TR_C * TR_R;
const TR_BACKS = [4, 0, 2, 5, 1, 3];
const TR_S = 1.0, TR_N = 24, TR_TOTAL = TR_S * TR_N, TR_FLIP = 0.55;
const TR_W = 418, TR_G = 36;
const trEase = (p) => { p = Math.max(0, Math.min(1, p)); return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; };
// each step flips one slot to a new treasure; only the last step of the cycle flips to the back
const TR_EVENTS = (() => {
  const target = (k) => k === TR_N - 1 ? null : TR_POOL[k % TR_POOL.length];
  let state = Array(TR_SLOTS).fill(null);
  const run = (log) => { for (let k = 0; k < TR_N; k++) { const j = TR_BACKS[k % TR_SLOTS]; const e = { k, j, from: state[j], to: target(k) }; state[j] = e.to; if (log) log.push(e); } };
  run(null); const init = state.slice(); const ev = []; run(ev);
  return { init, ev };
})();
const trSrc = (c) => c ? TR_A + c + '.jpg' : TR_A + 'back.jpg';
function TrFace({ src, ry }) {
  return <img src={src} draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 14, transform: 'rotateY(' + ry + 'deg)', boxShadow: '0 22px 44px rgba(20,0,6,.55)' }} />;
}
function TrScene({ T }) {
  T = ((T % TR_TOTAL) + TR_TOTAL) % TR_TOTAL;
  const { init, ev } = TR_EVENTS;
  const slots = init.map((c) => ({ src: trSrc(c), ry: 0 }));
  for (const e of ev) {
    const t0 = e.k * TR_S;
    if (T < t0) break;
    const p = trEase((T - t0) / TR_FLIP);
    slots[e.j] = p < 0.5 ? { src: trSrc(e.from), ry: p * 180 } : { src: trSrc(e.to), ry: (p - 1) * 180 };
  }
  const gw = TR_C * TR_W + (TR_C - 1) * TR_G, gh = TR_R * TR_W + (TR_R - 1) * TR_G;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#5f111b' }}>
      <div style={{ position: 'absolute', left: 600 - gw / 2, top: 600 - gh / 2, width: gw, height: gh, transform: 'rotate(-8deg)', perspective: 1600 }}>
        {slots.map((s, j) => (
          <div key={j} style={{ position: 'absolute', left: (j % TR_C) * (TR_W + TR_G), top: Math.floor(j / TR_C) * (TR_W + TR_G), width: TR_W, height: TR_W, perspective: 1600 }}>
            <TrFace src={s.src} ry={s.ry} />
          </div>
        ))}
      </div>
      {TR_POOL.map((n) => <link key={n} rel="preload" as="image" href={TR_A + n + '.jpg'} />)}
    </div>
  );
}
function TreasuresLoop() {
  const ref = React.useRef(null);
  const [T, setT] = React.useState(0);
  const [k, setK] = React.useState(0.2);
  React.useEffect(() => {
    let raf, t0 = performance.now();
    const tick = (now) => { setT(((now - t0) / 1000) % TR_TOTAL); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / 1200));
    if (ref.current) ro.observe(ref.current);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#5f111b' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 1200, transform: 'scale(' + k + ')', transformOrigin: '0 0' }}>
        <TrScene T={T} />
      </div>
    </div>
  );
}
window.TreasuresLoop = TreasuresLoop;
