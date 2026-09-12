export function heapSortSteps(input){
  const a=[...input];
  const steps=[];
  let comps=0, swaps=0;
  const push=(o)=> steps.push({array:[...a], variables:{ i:o.variables?.i??"-", j:o.variables?.j??"-", heapSize:o.variables?.heapSize??a.length, comps, swaps }, ...o});
  const n=a.length;
  push({type:"start", indices:[], message:"Heap banao — max heap shuru 🪄", codeLine:0, variables:{i:Math.floor(n/2)-1, heapSize:n}});
  function heapify(size, i){
    let largest=i;
    const l=2*i+1, r=2*i+2;
    if(l<size){ comps++; push({type:"compare", indices:[l,largest], message:`Compare child ${a[l]} vs parent ${a[largest]}`, codeLine:3, variables:{i:largest, j:l, heapSize:size}}); if(a[l]>a[largest]) largest=l; }
    if(r<size){ comps++; push({type:"compare", indices:[r,largest], message:`Compare ${a[r]} vs ${a[largest]}`, codeLine:3, variables:{i:largest, j:r, heapSize:size}}); if(a[r]>a[largest]) largest=r; }
    if(largest!==i){
      push({type:"swap", indices:[i,largest], message:`Heap property break → swap ${a[i]} ↔ ${a[largest]}`, codeLine:4, variables:{i, j:largest, heapSize:size}});
      const t=a[i]; a[i]=a[largest]; a[largest]=t; swaps++;
      push({type:"swap_done", indices:[i,largest], message:`Heapified → [${a.join(", ")}]`, codeLine:4, variables:{i, j:largest, heapSize:size}});
      heapify(size, largest);
    }
  }
  for(let i=Math.floor(n/2)-1;i>=0;i--) heapify(n,i);
  push({type:"mark_sorted", indices:[], message:"Max heap ready! Root sabse bada 👑", codeLine:1, variables:{i:"-", heapSize:n}});
  for(let i=n-1;i>0;i--){
    push({type:"swap", indices:[0,i], message:`Root ${a[0]} ko end pe bhejo → swap`, codeLine:6, variables:{i:0, j:i, heapSize:i+1}});
    const t=a[0]; a[0]=a[i]; a[i]=t; swaps++;
    push({type:"swap_done", indices:[0,i], message:`[${a.join(", ")}]`, codeLine:6, variables:{i:0,j:i, heapSize:i}});
    push({type:"mark_sorted", indices:[i], message:`${a[i]} sorted! 🔒`, codeLine:6, variables:{i, heapSize:i}});
    heapify(i,0);
  }
  push({type:"mark_sorted", indices:[0], message:"Heap Sort done — O(n log n) 🚀", codeLine:7, variables:{i:0, heapSize:0}});
  push({type:"done", indices:[], message:"Sorted via heap! Heap ka jadoo ✨", codeLine:7, variables:{i:"-", heapSize:0}});
  return steps;
}
export const heapCode=[
  "def heap_sort(arr):",
  "    n=len(arr)",
  "    for i in range(n//2-1,-1,-1): heapify(arr,n,i)",
  "    for i in range(n-1,0,-1):",
  "        arr[0],arr[i]=arr[i],arr[0]",
  "        heapify(arr,i,0)",
  "def heapify(arr,n,i):",
  "    largest=i; l=2*i+1; r=2*i+2",
  "    ...",
];
