export function shellSortSteps(input){
  const a=[...input];
  const steps=[];
  let comps=0, swaps=0;
  const push=(o)=> steps.push({array:[...a], variables:{ gap:o.variables?.gap??"-", i:o.variables?.i??"-", j:o.variables?.j??"-", comps, swaps }, ...o});
  const n=a.length;
  push({type:"start", indices:[], message:"Shell Sort — gap se insertion jaisa 🐚", codeLine:0, variables:{gap:Math.floor(n/2)}});
  for(let gap=Math.floor(n/2); gap>0; gap=Math.floor(gap/2)){
    push({type:"pick", indices:[], message:`Gap = ${gap} — is gap ke saare pairs check`, codeLine:1, variables:{gap}});
    for(let i=gap;i<n;i++){
      const temp=a[i];
      let j=i;
      push({type:"compare", indices:[j, j-gap], message:`Compare a[${j}]=${a[j]} vs a[${j-gap}]=${a[j-gap]}`, codeLine:3, variables:{gap,i,j}});
      comps++;
      while(j>=gap && a[j-gap]>temp){
        push({type:"shift", indices:[j-gap, j], message:`Shift ${a[j-gap]} → ${j}`, codeLine:4, variables:{gap,i,j}});
        a[j]=a[j-gap];
        swaps++; push({type:"overwrite", indices:[j], message:`[${a.join(", ")}]`, codeLine:4, variables:{gap,i,j}});
        j-=gap;
        if(j>=gap){ comps++; push({type:"compare", indices:[j, j-gap], message:`Compare ${a[j]} vs ${a[j-gap]}`, codeLine:3, variables:{gap,i,j}}); }
      }
      a[j]=temp;
      push({type:"insert", indices:[j], message:`Insert ${temp} at ${j}`, codeLine:5, variables:{gap,i,j}});
    }
    push({type:"mark_sorted", indices:[], message:`Gap ${gap} complete`, codeLine:1, variables:{gap}});
  }
  push({type:"done", indices:[], message:"Shell Sort done — gap 1 pe final insertion ✨", codeLine:7, variables:{gap:1}});
  return steps;
}
export const shellCode=[
  "def shell_sort(arr):",
  "    gap=len(arr)//2",
  "    while gap>0:",
  "        for i in range(gap,len(arr)):",
  "            temp=arr[i]; j=i",
  "            while j>=gap and arr[j-gap]>temp:",
  "                arr[j]=arr[j-gap]; j-=gap",
  "            arr[j]=temp",
  "        gap//=2",
];
