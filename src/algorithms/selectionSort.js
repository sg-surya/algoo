export function selectionSortSteps(input){
  const a=[...input];
  const steps=[];
  let comps=0, swaps=0;
  const push=(o)=> steps.push({array:[...a], variables:{ i:o.variables?.i??"-", j:o.variables?.j??"-", minIdx:o.variables?.minIdx??"-", comps, swaps }, ...o});
  push({type:"start", indices:[], message:"Sabse chhota dhoondo, front pe lao 🔍", codeLine:0, variables:{i:0,j:1,minIdx:0}});
  for(let i=0;i<a.length-1;i++){
    let min=i;
    push({type:"pick", indices:[i], message:`Position ${i} ke liye minimum dhoondh rahe`, codeLine:1, variables:{i,j:i+1,minIdx:min}});
    for(let j=i+1;j<a.length;j++){
      comps++;
      push({type:"compare", indices:[min, j], message:`Compare current min ${a[min]} vs ${a[j]}`, codeLine:3, variables:{i,j,minIdx:min}});
      if(a[j]<a[min]){
        min=j;
        push({type:"new_min", indices:[min], message:`New min = ${a[min]} at ${min} 👀`, codeLine:4, variables:{i,j,minIdx:min}});
      }
    }
    if(min!==i){
      push({type:"swap", indices:[i,min], message:`Swap ${a[i]} ↔ ${a[min]}`, codeLine:6, variables:{i,j:"-",minIdx:min}});
      const t=a[i]; a[i]=a[min]; a[min]=t;
      swaps++;
      push({type:"swap_done", indices:[i,min], message:`Swapped → [${a.join(", ")}]`, codeLine:6, variables:{i,j:"-",minIdx:min}});
    } else {
      push({type:"no_swap", indices:[i], message:`${a[i]} already minimum ✅`, codeLine:6, variables:{i,j:"-",minIdx:min}});
    }
    push({type:"mark_sorted", indices:[i], message:`${a[i]} locked at ${i} 🔒`, codeLine:6, variables:{i,j:"-",minIdx:min}});
  }
  push({type:"mark_sorted", indices:[a.length-1], message:`Last element auto sorted`, codeLine:6, variables:{i:a.length-1,j:"-",minIdx:a.length-1}});
  push({type:"done", indices:[], message:"Done! Selection Sort — minimal swaps 🌟", codeLine:7, variables:{i:"-",j:"-",minIdx:"-"}});
  return steps;
}
export const selectionCode=[
  "def selection_sort(arr):",
  "    for i in range(len(arr)):",
  "        min_idx = i",
  "        for j in range(i+1, len(arr)):",
  "            if arr[j] < arr[min_idx]: min_idx=j",
  "        arr[i], arr[min_idx]=arr[min_idx],arr[i]",
  "    return arr",
];
