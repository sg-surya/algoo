export default function GraphCanvas({ graph, current, visited }){
  if(!graph) return null;
  const { nodes, edges, weights } = graph;
  // fixed layout
  const pos = {
    A:[80,60], B:[40,150], C:[140,150], D:[20,240], E:[80,240], F:[140,240]
  };
  // edges may be [a,b] or [a,b,w]
  const edgeList = edges || [];
  return (
    <div className="w-full flex justify-center">
      <svg viewBox="0 0 200 300" className="w-[280px] h-[300px]">
        {edgeList.map(([a,b],i)=>{
          const [x1,y1]=pos[a]||[0,0], [x2,y2]=pos[b]||[0,0];
          const isActive = current && (a===current || b===current);
          const w = weights?.[a+"-"+b] ?? weights?.[`${a}-${b}`];
          const mx=(x1+x2)/2, my=(y1+y2)/2;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isActive ? "#000" : "#000"} strokeWidth={isActive?3:2} opacity={isActive?1:0.35} />
              {w!==undefined && <text x={mx} y={my-4} fontSize="9" fontWeight="900" textAnchor="middle" className="fill-black bg-white">{w}</text>}
            </g>
          );
        })}
        {nodes.map(n=>{
          const [x,y]=pos[n]||[100,100];
          const isVis = visited?.includes(n);
          const isCur = current===n;
          let fill="#fff", stroke="#000";
          if(isCur) fill="#FF90E8";
          else if(isVis) fill="#B8FF66";
          return (
            <g key={n}>
              <circle cx={x} cy={y} r={18} fill={fill} stroke={stroke} strokeWidth={2.5} />
              <text x={x} y={y+5} textAnchor="middle" fontSize="12" fontWeight="900">{n}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
