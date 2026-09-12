export function binarySearchSteps(input){
  const a=[...input].sort((x,y)=>x-y);
  const steps=[];
  const target = a[Math.floor(a.length/2)+1] ?? a[0];
  let comps=0;
  const push=(o)=> steps.push({array:[...a], variables:{ l:o.variables?.l??"-", r:o.variables?.r??"-", m:o.variables?.m??"-", target, comps }, ...o});
  push({type:"start", indices:[], message:`Binary Search — sorted [${a.join(", ")}], dhundo ${target} 🔍`, codeLine:0, variables:{l:0,r:a.length-1,m:"-"}});
  let l=0, r=a.length-1;
  while(l<=r){
    const m=Math.floor((l+r)/2);
    comps++;
    push({type:"compare", indices:[m], message:`Mid m=${m} → ${a[m]} vs ${target}`, codeLine:2, variables:{l,r,m}});
    if(a[m]===target){
      push({type:"mark_sorted", indices:[m], message:`Found ${target} at ${m} in ${comps} steps! 🎯 O(log n)`, codeLine:3, variables:{l,r,m}});
      push({type:"done", indices:[m], message:`Binary Search done — log n magic ✨`, codeLine:4, variables:{l,r,m}});
      return steps;
    } else if(a[m]<target){
      push({type:"no_swap", indices:[m], message:`${a[m]} < ${target} → right jao`, codeLine:4, variables:{l,r,m}});
      l=m+1;
      push({type:"pick", indices:[], message:`New range [${l}..${r}]`, codeLine:4, variables:{l,r,m}});
    } else {
      push({type:"no_swap", indices:[m], message:`${a[m]} > ${target} → left jao`, codeLine:4, variables:{l,r,m}});
      r=m-1;
      push({type:"pick", indices:[], message:`New range [${l}..${r}]`, codeLine:4, variables:{l,r,m}});
    }
  }
  push({type:"done", indices:[], message:`${target} nahi mila`, codeLine:5, variables:{l,r,m:"-"}});
  return steps;
}
export const binaryCode=[
  "def binary_search(arr, x):",
  "    l,r=0,len(arr)-1",
  "    while l<=r:",
  "        m=(l+r)//2",
  "        if arr[m]==x: return m",
  "        elif arr[m]<x: l=m+1",
  "        else: r=m-1",
  "    return -1",
];
