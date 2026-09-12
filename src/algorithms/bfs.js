export function bfsSteps(){
  const nodes = ["A","B","C","D","E","F"];
  const edges = [["A","B"],["A","C"],["B","D"],["B","E"],["C","F"],["E","F"]];
  const adj = {A:["B","C"], B:["D","E"], C:["F"], D:[], E:["F"], F:[]};
  const steps=[];
  const push=(o)=> steps.push({graph:{nodes, edges, visited:[...visited], queue:[...queue], current:o.current||null, visitedOrder:[...visitedOrder]}, ...o});
  let visited=new Set(), queue=["A"], visitedOrder=[];
  push({type:"start", current:"A", message:"BFS start from A — queue me A 🌊", codeLine:0});
  while(queue.length){
    const u=queue.shift();
    if(visited.has(u)) continue;
    visited.add(u); visitedOrder.push(u);
    push({type:"compare", current:u, message:`Visit ${u} — level order`, codeLine:1});
    push({type:"mark_sorted", current:u, message:`${u} visited ✅`, codeLine:1});
    for(const v of (adj[u]||[])){
      if(!visited.has(v) && !queue.includes(v)){
        queue.push(v);
        push({type:"pick", current:v, message:`Enqueue ${v} (neighbor of ${u})`, codeLine:2});
      }
    }
    if(queue.length) push({type:"pick", current:queue[0], message:`Queue: [${queue.join(", ")}] — next ${queue[0]}`, codeLine:2});
  }
  push({type:"done", current:null, message:`BFS order: ${visitedOrder.join(" → ")} 🎯`, codeLine:3});
  return steps;
}
export const bfsCode=[
  "def bfs(graph, start):",
  "    visited={start}; queue=[start]",
  "    while queue:",
  "        u=queue.pop(0)",
  "        for v in graph[u]:",
  "            if v not in visited: visited.add(v); queue.append(v)",
];
