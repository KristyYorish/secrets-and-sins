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
  return <img src={src} draggable={false} style={{ position: 'absolute', left: x, top: y, width: CU_W, height: CU_W, zIndex: z, borderRadius: 10, boxShadow: '0 18px 36px rgba(60,10,0,.45)' }} />;
}
function CuScene({ T }) {
  T = ((T % CU_TOTAL) + CU_TOTAL) % CU_TOTAL;
  const i = Math.min(CU_SEQ.length - 1, Math.floor(T / CU_HOLD));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#c33c20' }}>
      <CuCard {...CU_SIDES[0]} src={cuSrc(CU_SIDES[0].c)} z={1} />
      <CuCard {...CU_SIDES[1]} src={cuSrc(CU_SIDES[1].c)} z={2} />
      <CuCard {...CU_SIDES[3]} src={cuSrc(CU_SIDES[3].c)} z={1} />
      <CuCard {...CU_SIDES[2]} src={cuSrc(CU_SIDES[2].c)} z={2} />
      <CuCard x={CU_X} y={CU_Y} src={cuSrc(CU_SEQ[i])} z={5} />
      {CU_SEQ.map((n) => <link key={n} rel="preload" as="image" href={cuSrc(n)} />)}
    </div>
  );
}
function CuPiece() {
  const { T } = useComposition();
  return <CuScene T={T} />;
}
function CloseupAnim() {
  return (
    <CompositionStage width={1200} height={1200} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#c33c20">
      <CuPiece />
    </CompositionStage>
  );
}
function CloseupLoop() {
  const ref = React.useRef(null);
  const [T, setT] = React.useState(0);
  const [k, setK] = React.useState(0.2);
  React.useEffect(() => {
    let raf, t0 = performance.now();
    const tick = (now) => { setT(((now - t0) / 1000) % CU_TOTAL); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / 1200));
    if (ref.current) ro.observe(ref.current);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#c33c20' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 1200, transform: 'scale(' + k + ')', transformOrigin: '0 0' }}>
        <CuScene T={T} />
      </div>
    </div>
  );
}
window.CloseupAnim = CloseupAnim;
window.CloseupLoop = CloseupLoop;
