export function insertionSortSteps(input){
  const a=[...input];
  const steps=[];
  let comps=0, swaps=0;
  const push=(obj)=> steps.push({array:[...a], variables:{ i: obj.variables?.i ?? "-", j: obj.variables?.j ?? "-", key: obj.variables?.key ?? "-", comps, swaps }, ...obj});
  push({type:"start", indices:[], message:"Cards arrange karna shuru — disciplined mode on 🃏", codeLine:0, variables:{i:0,j:0,key:a[0]}});
  push({type:"mark_sorted", indices:[0], message:`${a[0]} — sorted zone mein ✅`, codeLine:0, variables:{i:0,j:0,key:a[0]}});
  for(let i=1;i<a.length;i++){
    const key=a[i];
    let j=i-1;
    push({type:"pick", indices:[i], message:`Pick key=${key} — sorted mein insert karna hai 🤔`, codeLine:1, variables:{i,j,key}});
    push({type:"compare", indices:[j, i], message:`Compare ${a[j]} vs key ${key}`, codeLine:3, variables:{i,j,key}});
    comps++;
    while(j>=0 && a[j]>key){
      comps++;
      push({type:"shift", indices:[j, j+1], message:`${a[j]} > ${key} → shift right ➡️`, codeLine:4, variables:{i,j,key}});
      a[j+1]=a[j];
      swaps++;
      push({type:"overwrite", indices:[j+1], message:`Shifted — [${a.join(", ")}]`, codeLine:4, variables:{i,j,key}});
      j--;
      if(j>=0){ push({type:"compare", indices:[j, j+1], message:`Compare ${a[j]} vs key ${key}`, codeLine:3, variables:{i,j,key}}); comps++; }
    }
    a[j+1]=key;
    swaps++;
    push({type:"insert", indices:[j+1], message:`Insert ${key} at ${j+1} → [${a.join(", ")}] ✨`, codeLine:6, variables:{i,j,key}});
    push({type:"mark_sorted", indices: Array.from({length:i+1},(_,k)=>k), message:`Prefix [0..${i}] sorted`, codeLine:6, variables:{i,j,key}});
  }
  push({type:"done", indices:[], message:"Sorted! Cards ekdum neat 👌", codeLine:7, variables:{i:a.length,j:"-",key:"-"}});
  return steps;
}
export const insertionCode=[
  "def insertion_sort(arr):",
  "    for i in range(1, len(arr)):",
  "        key = arr[i]",
  "        j = i-1",
  "        while j>=0 and arr[j] > key:",
  "            arr[j+1] = arr[j]; j-=1",
  "        arr[j+1] = key",
  "    return arr",
];
