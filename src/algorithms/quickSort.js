export function quickSortSteps(input){
  const a=[...input];
  const steps=[];
  const push=(o)=> steps.push({array:[...a], ...o});
  push({type:"start", indices:[], message:"Pivot ka boss entry ⚡ — partition shuru!", codeLine:0});
  function qs(low,high){
    if(low>=high){
      if(low===high) push({type:"mark_sorted", indices:[low], message:`Single element ${a[low]} — sorted`, codeLine:1});
      return;
    }
    const pi=partition(low,high);
    push({type:"mark_sorted", indices:[pi], message:`Pivot ${a[pi]} locked at ${pi} 🔒`, codeLine:2});
    qs(low,pi-1);
    qs(pi+1,high);
  }
  function partition(low,high){
    const pivot=a[high];
    push({type:"pick_pivot", indices:[high], message:`Pivot = ${pivot} (index ${high})`, codeLine:5});
    let i=low-1;
    for(let j=low;j<high;j++){
      push({type:"compare", indices:[j, high], message:`Compare ${a[j]} < pivot ${pivot}?`, codeLine:7});
      if(a[j]<pivot){
        i++;
        if(i!==j){
          push({type:"swap", indices:[i,j], message:`${a[j]} < pivot → swap ${a[i]} ↔ ${a[j]}`, codeLine:9});
          const t=a[i]; a[i]=a[j]; a[j]=t;
          push({type:"swap_done", indices:[i,j], message:`[${a.join(", ")}]`, codeLine:9});
        } else {
          push({type:"no_swap", indices:[i], message:`${a[j]} stays — already left side`, codeLine:7});
        }
      }
    }
    // place pivot
    push({type:"swap", indices:[i+1, high], message:`Place pivot ${pivot} at ${i+1}`, codeLine:11});
    const t=a[i+1]; a[i+1]=a[high]; a[high]=t;
    push({type:"swap_done", indices:[i+1, high], message:`Partitioned → [${a.join(", ")}]`, codeLine:11});
    return i+1;
  }
  qs(0,a.length-1);
  push({type:"done", indices:[], message:"Quick Sort done — recursively chaos sorted 😂", codeLine:12});
  return steps;
}
export const quickCode=[
  "def quick_sort(arr, low, high):",
  "    if low < high:",
  "        pi = partition(arr, low, high)",
  "        quick_sort(arr, low, pi-1)",
  "        quick_sort(arr, pi+1, high)",
  "def partition(arr, low, high):",
  "    pivot = arr[high]",
  "    i = low-1",
  "    for j in range(low, high):",
  "        if arr[j] < pivot:",
  "            i+=1; arr[i],arr[j]=arr[j],arr[i]",
  "    arr[i+1],arr[high]=arr[high],arr[i+1]",
  "    return i+1",
];
