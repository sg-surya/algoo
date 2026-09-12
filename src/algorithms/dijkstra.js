export function dijkstraSteps(){
  const nodes=["A","B","C","D","E","F"];
  const edges=[["A","B",4],["A","C",2],["B","D",3],["B","E",1],["C","F",5],["E","F",2]];
  const adj={A:[["B",4],["C",2]], B:[["D",3],["E",1]], C:[["F",5]], D:[], E:[["F",2]], F:[]};
  const steps=[];
  const dist={A:0,B:1e9,C:1e9,D:1e9,E:1e9,F:1e9};
  const visited=new Set();
  const push=(o)=> steps.push({graph:{nodes, edges: edges.map(e=>[e[0],e[1]]), weights: Object.fromEntries(edges.map(e=>[e[0]+"-"+e[1], e[2]])), visited:[...visited], current:o.current||null, dist:{...dist}}, ...o});
  push({type:"start", current:"A", message:"Dijkstra from A — dist[A]=0 👑", codeLine:0});
  while(visited.size < nodes.length){
    let u=null, best=1e9;
    for(const n of nodes){ if(!visited.has(n) && dist[n]<best){ best=dist[n]; u=n; } }
    if(u===null) break;
    visited.add(u);
    push({type:"mark_sorted", current:u, message:`Pick ${u} (dist ${dist[u]}) — final ✅`, codeLine:1});
    for(const [v,w] of (adj[u]||[])){
      if(dist[u]+w < dist[v]){
        const old=dist[v];
        dist[v]=dist[u]+w;
        push({type:"compare", current:v, message:`Relax ${u}→${v} (${w}): ${old} → ${dist[v]}`, codeLine:2});
        push({type:"swap", current:v, message:`Update dist[${v}]=${dist[v]}`, codeLine:2});
      }
    }
  }
  push({type:"done", current:null, message:`Shortest from A: ${Object.entries(dist).map(([k,v])=>k+":"+ (v===1e9?"∞":v)).join(" ")} 🎯`, codeLine:3});
  return steps;
}
export const dijkstraCode=[
  "def dijkstra(graph, src):",
  "    dist={src:0}; pq=[(0,src)]",
  "    while pq:",
  "        d,u=heappop(pq)",
  "        for v,w in graph[u]:",
  "            if dist[u]+w < dist[v]: dist[v]=dist[u]+w",
];
