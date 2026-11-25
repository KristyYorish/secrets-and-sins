// Smuggler card close-up. Plain JavaScript, so phones don't have to download a compiler.
const h = React.createElement;
const CU_A = 'assets/smugglers/';
const CU_SEQ = ['back', 15, 3, 1, 8, 7, 12, 18];
const CU_HOLD = 2, CU_TOTAL = CU_SEQ.length * CU_HOLD;
const CU_W = 920, CU_X = 140, CU_Y = 140;
const cuSrc = (n) => CU_A + (n === 'back' ? 'back' : String(n).padStart(2, '0')) + '.jpg';
// side stacks peek in from the edges: [left-back, left-front, right-front, right-back]
const CU_SIDES = [
  { x: CU_X - 40 - CU_W - 34, y: CU_Y - 6, c: 12 },
  { x: CU_X - 40 - CU_W, y: CU_Y, c: 18 },
  { x: CU_X + CU_W + 40, y: CU_Y, c: 7 },
  { x: CU_X + CU_W + 40 + 34, y: CU_Y - 6, c: 8 },
];
function CuCard({ x, y, src, z }) {
  return h('img', { src, alt: '', draggable: false, style: { position: 'absolute', left: x, top: y, width: CU_W, height: CU_W, maxWidth: 'none', zIndex: z, borderRadius: 10, boxShadow: '0 18px 36px rgba(60,10,0,.45)' } });
}
function CuScene({ i }) {
  return h('div', { style: { position: 'absolute', inset: 0, overflow: 'hidden', background: '#c33c20' } },
    h(CuCard, { ...CU_SIDES[0], src: cuSrc(CU_SIDES[0].c), z: 1 }),
    h(CuCard, { ...CU_SIDES[1], src: cuSrc(CU_SIDES[1].c), z: 2 }),
    h(CuCard, { ...CU_SIDES[3], src: cuSrc(CU_SIDES[3].c), z: 1 }),
    h(CuCard, { ...CU_SIDES[2], src: cuSrc(CU_SIDES[2].c), z: 2 }),
    h(CuCard, { x: CU_X, y: CU_Y, src: cuSrc(CU_SEQ[i]), z: 5 }),
    CU_SEQ.map((n) => h('link', { key: n, rel: 'preload', as: 'image', href: cuSrc(n) })));
}
function CloseupLoop() {
  const ref = React.useRef(null);
  const [i, setI] = React.useState(0);
  const [k, setK] = React.useState(0.2);
  const [near, setNear] = React.useState(false);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / 1200));
    const io = new IntersectionObserver(([e]) => { setOn(e.isIntersecting); if (e.isIntersecting) setNear(true); }, { rootMargin: '400px' });
    ro.observe(ref.current); io.observe(ref.current);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);
  React.useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setI((v) => (v + 1) % CU_SEQ.length), CU_HOLD * 1000);
    return () => clearInterval(id);
  }, [on]);
  return h('div', { ref, style: { position: 'absolute', inset: 0, overflow: 'hidden', background: '#c33c20' } },
    h('div', { style: { position: 'absolute', left: 0, top: 0, width: 1200, height: 1200, transform: 'scale(' + k + ')', transformOrigin: '0 0' } },
      near ? h(CuScene, { i }) : null));
}
window.CloseupLoop = CloseupLoop;
