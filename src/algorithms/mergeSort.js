export function mergeSortSteps(input){
  const a=[...input];
  const steps=[];
  const push=(o)=> steps.push({array:[...a], ...o});
  push({type:"start", indices:[], message:"Divide & Conquer — todke jodenge 🧩", codeLine:0});
  function mergeSort(l,r){
    if(l>=r) return;
    const m=Math.floor((l+r)/2);
    push({type:"divide", indices:Array.from({length:r-l+1},(_,k)=>l+k), message:`Divide [${l}..${r}] → [${l}..${m}] & [${m+1}..${r}]`, codeLine:1});
    mergeSort(l,m);
    mergeSort(m+1,r);
    merge(l,m,r);
  }
  function merge(l,m,r){
    const left=a.slice(l,m+1), right=a.slice(m+1,r+1);
    let i=0,j=0,k=l;
    push({type:"merge_start", indices:Array.from({length:r-l+1},(_,idx)=>l+idx), message:`Merging [${left}] & [${right}]`, codeLine:3});
    while(i<left.length && j<right.length){
      push({type:"compare", indices:[l+i, m+1+j], message:`Compare ${left[i]} vs ${right[j]}`, codeLine:4});
      if(left[i]<=right[j]){
        a[k]=left[i++];
        push({type:"overwrite", indices:[k], message:`Place ${a[k]} at ${k}`, codeLine:5});
      } else {
        a[k]=right[j++];
        push({type:"overwrite", indices:[k], message:`Place ${a[k]} at ${k}`, codeLine:6});
      }
      k++;
    }
    while(i<left.length){ a[k]=left[i++]; push({type:"overwrite", indices:[k], message:`Copy remaining ${a[k]}`, codeLine:8}); k++; }
    while(j<right.length){ a[k]=right[j++]; push({type:"overwrite", indices:[k], message:`Copy remaining ${a[k]}`, codeLine:8}); k++; }
    push({type:"merged", indices:Array.from({length:r-l+1},(_,idx)=>l+idx), message:`Merged [${l}..${r}] → [${a.slice(l,r+1).join(", ")}] ✅`, codeLine:9});
  }
  mergeSort(0,a.length-1);
  push({type:"done", indices:[], message:"Merge Sort complete — stable & O(n log n) 🚀", codeLine:10});
  return steps;
}
export const mergeCode=[
  "def merge_sort(arr):",
  "    if len(arr)<=1: return arr",
  "    mid=len(arr)//2",
  "    left=merge_sort(arr[:mid])",
  "    right=merge_sort(arr[mid:])",
  "    return merge(left,right)",
  "def merge(l,r):",
  "    # compare and stitch",
  "    ...",
  "    return merged",
];
