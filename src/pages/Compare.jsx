import { useState, useEffect, useRef } from "react";
import { algorithms } from "../data/algorithms";
import ArrayBars from "../components/ArrayBars";
import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";

function gen(n=8){ return Array.from({length:n},()=> Math.floor(Math.random()*20)+5); }

export default function Compare(){
  const sorting = algorithms.filter(a=>a.category==="Sorting");
  const [arr,setArr]=useState(()=> [8,3,5,1,7,2]);
  const [aId,setAId]=useState("bubble-sort");
  const [bId,setBId]=useState("quick-sort");
  const [idx,setIdx]=useState(0);
  const [playing,setPlaying]=useState(false);
  const timerRef=useRef(null);

  const a = algorithms.find(x=>x.id===aId) || sorting[0];
  const b = algorithms.find(x=>x.id===bId) || sorting[1];
  const aSteps = a.stepsFn(arr);
  const bSteps = b.stepsFn(arr);
  const max = Math.max(aSteps.length, bSteps.length);
  const curA = aSteps[Math.min(idx, aSteps.length-1)];
  const curB = bSteps[Math.min(idx, bSteps.length-1)];

  useEffect(()=>{
    if(playing){
      timerRef.current=setTimeout(()=>{
        if(idx < max-1) setIdx(i=>i+1);
        else setPlaying(false);
      }, 400);
    }
    return ()=> clearTimeout(timerRef.current);
  },[playing, idx, max]);

  useEffect(()=>{ if(idx>=max) setIdx(0); },[max]);

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-black">Compare — kaun tez?</h1>
      <p className="text-sm font-medium text-black/60">Same array, 2 algorithms, ek saath play.</p>

      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <select value={aId} onChange={e=>{ setAId(e.target.value); setIdx(0); setPlaying(false); }} className="brutal-input !py-2 !text-sm font-black" aria-label="Algorithm A">
          {sorting.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <span className="font-black">vs</span>
        <select value={bId} onChange={e=>{ setBId(e.target.value); setIdx(0); setPlaying(false); }} className="brutal-input !py-2 !text-sm font-black" aria-label="Algorithm B">
          {sorting.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button onClick={()=> { setArr(gen(8)); setIdx(0); setPlaying(false); }} className="brutal-btn bg-white !py-2"><Shuffle size={14}/> New array</button>
      </div>
      <div className="mt-1 font-mono text-xs font-bold text-black/50">[{arr.join(", ")}]</div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button onClick={()=> setIdx(0)} className="brutal-btn bg-white !px-4" aria-label="Reset"><RotateCcw size={16}/></button>
        <button onClick={()=>{ if(idx>=max-1) setIdx(0); setPlaying(v=>!v); }} className="brutal-btn !rounded-full !px-8 !py-3 bg-black text-white">
          {playing ? <><Pause size={18}/> Pause</> : <><Play size={18}/> Play both</>}
        </button>
      </div>
      <input type="range" min={0} max={max-1} value={idx} onChange={e=> setIdx(Number(e.target.value))} className="w-full accent-black mt-3" aria-label="Compare timeline" />
      <div className="text-center text-xs font-bold text-black/50">Step {idx+1}/{max}</div>

      <div className="grid md:grid-cols-2 gap-4 mt-3">
        {[[a,curA,aSteps],[b,curB,bSteps]].map(([algo,cur,steps])=>(
          <div key={algo.id} className="brutal-card p-4 bg-white">
            <div className="font-black text-sm">{algo.name} <span className="ml-1 text-xs font-mono font-bold text-black/50">{Math.min(idx+1,steps.length)}/{steps.length}</span>
              {idx >= steps.length-1 && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-brutalLime border-[2px] border-black">DONE ✓</span>}
            </div>
            <ArrayBars array={cur?.array||arr} activeIndices={cur?.indices||[]} sortedIndices={[]} />
          </div>
        ))}
      </div>
    </div>
  );
}
