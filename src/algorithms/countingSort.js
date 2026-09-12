export function countingSortSteps(input){
  const a=[...input];
  const steps=[];
  let comps=0, swaps=0;
  const push=(o)=> steps.push({array:[...a], variables:{ val:o.variables?.val??"-", idx:o.variables?.idx??"-", comps, swaps }, ...o});
  const max=Math.max(...a);
  push({type:"start", indices:[], message:`Counting Sort — max=${max} tak count karo 🔢`, codeLine:0, variables:{val:max}});
  const count=Array(max+1).fill(0);
  for(let i=0;i<a.length;i++){
    count[a[i]]++;
    push({type:"compare", indices:[i], message:`Count ${a[i]} → count[${a[i]}]=${count[a[i]]}`, codeLine:2, variables:{val:a[i], idx:i}});
  }
  push({type:"mark_sorted", indices:[], message:`Count array ready — prefix sum banao`, codeLine:3, variables:{val:"-"}});
  for(let i=1;i<count.length;i++){ count[i]+=count[i-1]; }
  const out=[...a];
  for(let i=a.length-1;i>=0;i--){
    const v=a[i];
    const pos=count[v]-1;
    push({type:"pick", indices:[i], message:`Place ${v} at pos ${pos}`, codeLine:5, variables:{val:v, idx:pos}});
    out[pos]=v;
    count[v]--;
    // visualize by overwriting pos in a copy
    a[pos]=v;
    swaps++;
    push({type:"overwrite", indices:[pos], message:`Placed ${v} → [${a.join(", ")}]`, codeLine:5, variables:{val:v, idx:pos}});
  }
  for(let i=0;i<a.length;i++) a[i]=out[i];
  push({type:"done", indices:[], message:"Counting Sort done — O(n+k) ⚡ non-comparison!", codeLine:7, variables:{val:"-"}});
  return steps;
}
export const countingCode=[
  "def counting_sort(arr):",
  "    max_v=max(arr)",
  "    count=[0]*(max_v+1)",
  "    for x in arr: count[x]+=1",
  "    for i in range(1,len(count)): count[i]+=count[i-1]",
  "    out=[0]*len(arr)",
  "    for x in reversed(arr): out[count[x]-1]=x; count[x]-=1",
  "    return out",
];
