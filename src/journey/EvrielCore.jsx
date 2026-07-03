/* ============================================================
   THE EVRIEL SYSTEM CORE
   An architectural blueprint of an intelligent business system:
   3 concentric rings (intelligence / operations / outcomes),
   square + diamond module nodes, thin connector lines.
   All motion is driven externally by GSAP (ScrollJourney).
   ============================================================ */

const C = 400; // center

/* node positions — angle measured clockwise from 12 o'clock */
const IN_NODES = [
  [400, 308],
  [479.67, 446],
  [320.33, 446],
];
const MID_NODES = [
  [534.35, 265.65],
  [534.35, 534.35],
  [265.65, 534.35],
  [265.65, 265.65],
];
const OUT_NODES = [
  [400, 104],
  [696, 400],
  [400, 696],
  [104, 400],
];

/* connectors: center→inner, inner→middle, middle→outer */
const LK_C = IN_NODES.map(([x, y]) => [C, C, x, y]);
const LK_IM = [
  [400, 308, 534.35, 265.65],
  [400, 308, 265.65, 265.65],
  [479.67, 446, 534.35, 534.35],
  [479.67, 446, 534.35, 265.65],
  [320.33, 446, 265.65, 534.35],
  [320.33, 446, 265.65, 265.65],
];
const LK_MO = [
  [534.35, 265.65, 400, 104],
  [534.35, 265.65, 696, 400],
  [534.35, 534.35, 696, 400],
  [534.35, 534.35, 400, 696],
  [265.65, 534.35, 400, 696],
  [265.65, 534.35, 104, 400],
  [265.65, 265.65, 104, 400],
  [265.65, 265.65, 400, 104],
];

const Link = ({ pts, cls }) => (
  <line
    className={cls}
    x1={pts[0]} y1={pts[1]} x2={pts[2]} y2={pts[3]}
    pathLength="1"
    stroke="var(--c-link)"
    strokeWidth="1"
  />
);

/* Each node has a fixed, positioned outer group and an inner .nd group that
   GSAP scatters from (0,0) — never touch the outer translate, or the node
   snaps to the viewBox origin when the tween resolves absolute values. */

/* diamond module node (inner ring) */
const DiamondNode = ({ x, y, i }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className={`nd nd-in nd-in-${i}`}>
      <rect x="-5.5" y="-5.5" width="11" height="11" transform="rotate(45)"
        fill="var(--c-fill)" stroke="var(--c-node)" strokeWidth="1.2" />
      <circle r="1.6" fill="var(--c-node)" />
    </g>
  </g>
);

/* square module node (middle ring — the 4 service pillars) */
const PillarNode = ({ x, y, i }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className={`nd nd-mid nd-mid-${i}`}>
      <circle className="nd-halo nd-halo-mid" r="17" fill="none"
        stroke="var(--c-acc)" strokeWidth="1" opacity="0" />
      <rect x="-7" y="-7" width="14" height="14"
        fill="var(--c-fill)" stroke="var(--c-node)" strokeWidth="1.3" />
      <rect className="nd-fillcore" x="-3" y="-3" width="6" height="6" fill="var(--c-node)" />
    </g>
  </g>
);

/* square outcome node (outer ring) */
const OutcomeNode = ({ x, y, i }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className={`nd nd-out nd-out-${i}`}>
      <circle className="nd-halo nd-halo-out" r="14" fill="none"
        stroke="var(--c-acc)" strokeWidth="1" opacity="0" />
      <rect x="-5" y="-5" width="10" height="10"
        fill="var(--c-fill)" stroke="var(--c-node)" strokeWidth="1.2" />
    </g>
  </g>
);

export default function EvrielCore({ className = "" }) {
  return (
    <svg
      className={`core ${className}`}
      viewBox="0 0 800 800"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* faint blueprint crosshair */}
      <g className="core-x" stroke="var(--c-ring)" strokeWidth="0.5" opacity="0.28">
        <line x1="400" y1="48" x2="400" y2="752" />
        <line x1="48" y1="400" x2="752" y2="400" />
      </g>

      {/* glow that appears when the system completes */}
      <circle className="core-glow" cx="400" cy="400" r="150" fill="url(#coreGlow)" opacity="0" />

      {/* connectors (drawn/broken by scroll) */}
      <g className="core-links">
        {LK_C.map((p, i) => <Link key={`c${i}`} pts={p} cls={`lk lk-c lk-c-${i}`} />)}
        {LK_IM.map((p, i) => <Link key={`im${i}`} pts={p} cls={`lk lk-im lk-im-${i}`} />)}
        {LK_MO.map((p, i) => <Link key={`mo${i}`} pts={p} cls={`lk lk-mo lk-mo-${i}`} />)}
      </g>

      {/* OUTER RING — business outcomes */}
      <g className="core-rot core-rot--out">
        <circle className="ring ring-out" cx="400" cy="400" r="296" pathLength="1"
          stroke="var(--c-ring)" strokeWidth="1" />
        {/* radar tick marks */}
        <circle className="ring-ticks" cx="400" cy="400" r="308"
          stroke="var(--c-ring)" strokeWidth="7" strokeDasharray="1.5 159.77" opacity="0.8" />
        <circle className="ring-dash ring-dash--out" cx="400" cy="400" r="283"
          stroke="var(--c-ring)" strokeWidth="0.7" strokeDasharray="1 7" opacity="0.55" />
        {OUT_NODES.map(([x, y], i) => <OutcomeNode key={i} x={x} y={y} i={i} />)}
      </g>

      {/* MIDDLE RING — the four service pillars */}
      <g className="core-rot core-rot--mid">
        <circle className="ring ring-mid" cx="400" cy="400" r="190" pathLength="1"
          stroke="var(--c-ring)" strokeWidth="1" />
        {MID_NODES.map(([x, y], i) => <PillarNode key={i} x={x} y={y} i={i} />)}
      </g>

      {/* INNER RING — the intelligence center */}
      <g className="core-rot core-rot--in">
        <circle className="ring ring-in" cx="400" cy="400" r="92" pathLength="1"
          stroke="var(--c-ring)" strokeWidth="1.1" />
        <circle className="ring-dash ring-dash--in" cx="400" cy="400" r="72"
          stroke="var(--c-ring)" strokeWidth="0.8" strokeDasharray="3 9" opacity="0.7" />
        {IN_NODES.map(([x, y], i) => <DiamondNode key={i} x={x} y={y} i={i} />)}
      </g>

      {/* center — the intelligence mark */}
      <g className="core-center">
        <circle cx="400" cy="400" r="14" stroke="var(--c-node)" strokeWidth="1" fill="none" opacity="0.8" />
        <circle className="core-pulse" cx="400" cy="400" r="4.5" fill="var(--c-acc)" />
        <line x1="400" y1="378" x2="400" y2="370" stroke="var(--c-node)" strokeWidth="1" />
        <line x1="400" y1="422" x2="400" y2="430" stroke="var(--c-node)" strokeWidth="1" />
        <line x1="378" y1="400" x2="370" y2="400" stroke="var(--c-node)" strokeWidth="1" />
        <line x1="422" y1="400" x2="430" y2="400" stroke="var(--c-node)" strokeWidth="1" />
      </g>

      {/* technical label */}
      <text className="core-tag" x="400" y="524" textAnchor="middle"
        fill="var(--c-lbl)" style={{ font: "500 11px var(--mono)", letterSpacing: "0.32em" }}>
        EV·CORE / SC-01
      </text>

      <defs>
        <radialGradient id="coreGlow">
          <stop offset="0%" stopColor="#C8945A" stopOpacity="0.32" />
          <stop offset="70%" stopColor="#C8945A" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#C8945A" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* small static echo of the Core used as a watermark behind the light sections */
export function CoreWatermark() {
  return (
    <svg className="core-wm" viewBox="0 0 800 800" fill="none" aria-hidden="true">
      <g stroke="#A66A43" strokeWidth="1.4">
        <circle cx="400" cy="400" r="92" />
        <circle cx="400" cy="400" r="190" />
        <circle cx="400" cy="400" r="296" strokeDasharray="4 10" />
        {LK_IM.map((p, i) => <line key={i} x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]} />)}
      </g>
      <g fill="#A66A43">
        {IN_NODES.map(([x, y], i) => <rect key={`a${i}`} x={x - 5} y={y - 5} width="10" height="10" transform={`rotate(45 ${x} ${y})`} />)}
        {MID_NODES.map(([x, y], i) => <rect key={`b${i}`} x={x - 6} y={y - 6} width="12" height="12" />)}
      </g>
    </svg>
  );
}
