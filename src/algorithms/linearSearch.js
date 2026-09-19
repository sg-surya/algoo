export function linearSearchSteps(input, targetOverride){
  const a=[...input];
  const steps=[];
  const parsed = Number(targetOverride);
  const target = (targetOverride!==undefined && targetOverride!==null && targetOverride!=="" && !isNaN(parsed)) ? parsed : a[Math.floor(a.length/2)]; // default middle so found
  let comps=0;
  const push=(o)=> steps.push({array:[...a], variables:{ idx:o.variables?.idx??"-", target, comps }, ...o});
  push({type:"start", indices:[], message:`Linear Search — dhundo ${target} 🔍`, codeLine:0, variables:{idx:0}});
  for(let i=0;i<a.length;i++){
    comps++;
    push({type:"compare", indices:[i], message:`Check a[${i}]=${a[i]} == ${target}?`, codeLine:1, variables:{idx:i}});
    if(a[i]===target){
      push({type:"mark_sorted", indices:[i], message:`Mil gaya! ${target} at ${i} 🎯`, codeLine:2, variables:{idx:i}});
      push({type:"done", indices:[i], message:`Found ${target} in ${comps} steps — O(n)`, codeLine:3, variables:{idx:i}});
      return steps;
    } else {
      push({type:"no_swap", indices:[i], message:`${a[i]} ≠ ${target} — aage dekho`, codeLine:1, variables:{idx:i}});
    }
  }
  push({type:"done", indices:[], message:`${target} nahi mila — poora scan O(n)`, codeLine:3, variables:{idx:"-"}});
  return steps;
}
export const linearCode=[
  "def linear_search(arr, x):",
  "    for i in range(len(arr)):",
  "        if arr[i]==x: return i",
  "    return -1",
];
