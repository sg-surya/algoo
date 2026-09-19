export default function TreeCanvas({ tree }) {
  if (!tree || !tree.nodes || tree.nodes.length === 0) return <div className="text-center py-10 font-bold text-black/40">Tree empty</div>;
  const W = 320, H = 260;
  const { nodes, edges, current, visited = [], foundId, order = [] } = tree;
  return (
    <div className="w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[420px] h-[260px]">
        {edges.map(([a, b], i) => {
          const na = nodes.find(n => n.id === a), nb = nodes.find(n => n.id === b);
          if (!na || !nb) return null;
          return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#000" strokeWidth={2} opacity={0.4} />;
        })}
        {nodes.map(n => {
          const isCur = current === n.id;
          const isFound = foundId === n.id;
          const isVis = visited.includes(n.value) || order.includes(n.value);
          let fill = "#fff";
          if (isFound) fill = "#B8FF66";
          else if (isCur) fill = "#FF90E8";
          else if (isVis) fill = "#FFDE59";
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={17} fill={fill} stroke="#000" strokeWidth={2.5} />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="12" fontWeight="900">{n.value}</text>
            </g>
          );
        })}
      </svg>
      {order.length > 0 && <div className="text-xs font-mono font-bold mt-1">Order: [{order.join(", ")}]</div>}
    </div>
  );
}
