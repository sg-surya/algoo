export function radixSortSteps(input){
  const a=[...input];
  const steps=[];
  let comps=0, swaps=0;
  const push=(o)=> steps.push({array:[...a], variables:{ exp:o.variables?.exp??"-", digit:o.variables?.digit??"-", comps, swaps }, ...o});
  const max=Math.max(...a);
  push({type:"start", indices:[], message:`Radix Sort — LSD, max ${max} 🔢`, codeLine:0, variables:{exp:1}});
  for(let exp=1; Math.floor(max/exp)>0; exp*=10){
    push({type:"pick", indices:[], message:`Sorting by digit exp=${exp} (ones/tens/hundreds)`, codeLine:1, variables:{exp}});
    const n=a.length;
    const out=Array(n).fill(0);
    const cnt=Array(10).fill(0);
    for(let i=0;i<n;i++){ const d=Math.floor(a[i]/exp)%10; cnt[d]++; push({type:"compare", indices:[i], message:`Digit of ${a[i]} at exp ${exp} = ${d}`, codeLine:2, variables:{exp,digit:d}}); }
    for(let i=1;i<10;i++) cnt[i]+=cnt[i-1];
    for(let i=n-1;i>=0;i--){
      const d=Math.floor(a[i]/exp)%10;
      out[cnt[d]-1]=a[i];
      cnt[d]--;
      push({type:"overwrite", indices:[cnt[d]], message:`Place ${a[i]} (d=${d})`, codeLine:4, variables:{exp,digit:d}});
      swaps++;
    }
    for(let i=0;i<n;i++) a[i]=out[i];
    push({type:"overwrite", indices:[], message:`After exp ${exp} → [${a.join(", ")}]`, codeLine:5, variables:{exp}});
  }
  push({type:"done", indices:[], message:"Radix Sort done — O(d·(n+k)) 🚀 no comparisons!", codeLine:6, variables:{exp:"-"}});
  return steps;
}
export const radixCode=[
  "def radix_sort(arr):",
  "    max_v=max(arr)",
  "    exp=1",
  "    while max_v//exp>0:",
  "        counting_by_digit(arr,exp)",
  "        exp*=10",
];
