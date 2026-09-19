export function jumpSearchSteps(input, targetOverride){
  const a=[...input].sort((x,y)=>x-y);
  const steps=[];
  const parsed = Number(targetOverride);
  const target = (targetOverride!==undefined && targetOverride!==null && targetOverride!=="" && !isNaN(parsed)) ? parsed : (a[Math.floor(a.length/2)] ?? a[0]);
  let comps=0;
  const n=a.length;
  const push=(o)=> steps.push({array:[...a], variables:{ block:o.variables?.block??"-", idx:o.variables?.idx??"-", target, comps }, ...o});
  const step=Math.max(1, Math.floor(Math.sqrt(n)));
  push({type:"start", indices:[], message:`Jump Search — sorted [${a.join(", ")}], dhundo ${target} 🦘 step=${step}`, codeLine:0, variables:{block:0}});
  let prev=0;
  let curr=step;
  // jump phase
  while(curr<n && a[Math.min(curr,n)-1] < target){
    comps++;
    const checkIdx=Math.min(curr,n)-1;
    push({type:"compare", indices:[checkIdx], message:`Block check a[${checkIdx}]=${a[checkIdx]} < ${target}? jump!`, codeLine:1, variables:{block:curr}});
    prev=curr;
    curr+=step;
    push({type:"pick", indices:[], message:`Jump → block [${prev}..${Math.min(curr,n)-1}]`, codeLine:1, variables:{block:curr}});
  }
  push({type:"pick", indices:[], message:`Linear scan block [${prev}..${Math.min(curr,n)-1}]`, codeLine:2, variables:{block:prev}});
  const end=Math.min(curr,n);
  for(let i=prev;i<end;i++){
    comps++;
    push({type:"compare", indices:[i], message:`Check a[${i}]=${a[i]} == ${target}?`, codeLine:2, variables:{idx:i, block:prev}});
    if(a[i]===target){
      push({type:"mark_sorted", indices:[i], message:`Mil gaya! ${target} at ${i} 🎯`, codeLine:3, variables:{idx:i, block:prev}});
      push({type:"done", indices:[i], message:`Found in ${comps} steps — O(√n)`, codeLine:3, variables:{idx:i}});
      return steps;
    } else {
      push({type:"no_swap", indices:[i], message:`${a[i]} ≠ ${target}`, codeLine:2, variables:{idx:i, block:prev}});
    }
  }
  push({type:"done", indices:[], message:`${target} nahi mila — O(√n)`, codeLine:4, variables:{idx:"-"}});
  return steps;
}
export const jumpCode=[
  "def jump_search(arr, x):",
  "    import math; n=len(arr); step=int(math.sqrt(n))",
  "    prev=0",
  "    while arr[min(step,n)-1] < x:",
  "        prev=step; step+=int(math.sqrt(n))",
  "        if prev>=n: return -1",
  "    for i in range(prev, min(step,n)):",
  "        if arr[i]==x: return i",
  "    return -1",
];
