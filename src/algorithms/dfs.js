export function dfsSteps(){
  const nodes=["A","B","C","D","E","F"];
  const edges=[["A","B"],["A","C"],["B","D"],["B","E"],["C","F"],["E","F"]];
  const adj={A:["B","C"], B:["D","E"], C:["F"], D:[], E:["F"], F:[]};
  const steps=[];
  const visited=new Set(), order=[];
  const push=(o)=> steps.push({graph:{nodes, edges, visited:[...visited], stack:[...stack], current:o.current||null, visitedOrder:[...order]}, ...o});
  let stack=["A"];
  push({type:"start", current:"A", message:"DFS start from A — stack me A 🕳️", codeLine:0});
  while(stack.length){
    const u=stack.pop();
    if(visited.has(u)) continue;
    visited.add(u); order.push(u);
    push({type:"compare", current:u, message:`Visit ${u} — go deep`, codeLine:1});
    push({type:"mark_sorted", current:u, message:`${u} visited ✅`, codeLine:1});
    const neigh=[...(adj[u]||[])].reverse();
    for(const v of neigh){
      if(!visited.has(v)){
        stack.push(v);
        push({type:"pick", current:v, message:`Push ${v} (neighbor of ${u})`, codeLine:2});
      }
    }
    if(stack.length) push({type:"pick", current:stack[stack.length-1], message:`Stack top: ${stack[stack.length-1]}`, codeLine:2});
  }
  push({type:"done", current:null, message:`DFS order: ${order.join(" → ")} ✨`, codeLine:3});
  return steps;
}
export const dfsCode=[
  "def dfs(u, visited):",
  "    visited.add(u)",
  "    for v in graph[u]:",
  "        if v not in visited: dfs(v, visited)",
];
