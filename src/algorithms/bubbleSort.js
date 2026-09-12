export function bubbleSortSteps(input) {
  const a = [...input];
  const steps = [];
  const n = a.length;
  let comps=0, swaps=0;
  const push = (obj) => steps.push({ array: [...a], variables:{ i: obj.variables?.i ?? "-", j: obj.variables?.j ?? "-", swapped: obj.variables?.swapped ?? false, comps, swaps }, ...obj });

  push({ type: "start", indices: [], message: "Chalo shuru karte hain! Neighbours ko check karenge 😎", codeLine: 0, variables:{i:0,j:0,swapped:false} });

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comps++;
      push({ type: "compare", indices: [j, j + 1], message: `${a[j]} vs ${a[j + 1]} — compare kar rahe hain 👀`, codeLine: 3, variables:{i,j,swapped} });
      if (a[j] > a[j + 1]) {
        push({ type: "swap", indices: [j, j + 1], message: `${a[j]} > ${a[j+1]} → Swap! "Side ho jao bhai!" 😂`, codeLine: 4, variables:{i,j,swapped} });
        const tmp = a[j]; a[j] = a[j+1]; a[j+1] = tmp;
        swaps++; comps++;
        push({ type: "swap_done", indices: [j, j+1], message: `Swapped → [${a.join(", ")}]`, codeLine: 4, variables:{i,j,swapped:true} });
        swapped = true;
      } else {
        push({ type: "no_swap", indices: [j, j+1], message: `${a[j]} ≤ ${a[j+1]} — sahi order, no swap ✅`, codeLine: 3, variables:{i,j,swapped} });
      }
    }
    push({ type: "mark_sorted", indices: [n-1-i], message: `${a[n-1-i]} apni sahi jagah par lock! 🔒`, codeLine: 1, variables:{i, j:"-", swapped} });
    if (!swapped) {
      for (let k = 0; k < n-i-1; k++) push({ type: "mark_sorted", indices: [k], message: "Already sorted — early exit! ⚡", codeLine: 6, variables:{i, j:"-", swapped} });
      break;
    }
  }
  push({ type: "done", indices: [], message: "Sorted! Bubble Sort ne sab neighbours ko sambhal liya 🫧", codeLine: 7, variables:{i:n, j:"-", swapped:false} });
  return steps;
}

export const bubbleCode = [
  "def bubble_sort(arr):",
  "    n = len(arr)",
  "    for i in range(n):",
  "        for j in range(0, n-i-1):",
  "            if arr[j] > arr[j+1]:",
  "                arr[j], arr[j+1] = arr[j+1], arr[j]",
  "        if not swapped: break",
  "    return arr",
];
