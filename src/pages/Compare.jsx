import { useState, useEffect, useRef } from "react";
import { algorithms } from "../data/algorithms";
import ArrayBars from "../components/ArrayBars";
import { Swords, Play, Pause, RotateCcw, Shuffle } from "lucide-react";

function gen(n=8){ return Array.from({length:n},()=> Math.floor(Math.random()*20)+5); }

export default function Compare(){
  const sorting = algorithms.filter(a=>a.category==="Sorting");
  const [arr,setArr]=useState(()=> [8,3,5,1,7,2]);
  const [aId,setAId]=useState("bubble-sort");
  const [bId,setBId]=useState("quick-sort");
  const [idx,setIdx]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [speed,setSpeed]=useState(400);
  const timerRef=useRef(null);

  const a = algorithms.find(x=>x.id===aId) || sorting[0];
  const b = algorithms.find(x=>x.id===bId) || sorting[1];
  const aSteps = a.stepsFn(arr);
  const bSteps = b.stepsFn(arr);
  const max = Math.max(aSteps.length, bSteps.length);
  const curA = aSteps[Math.min(idx, aSteps.length-1)];
  const curB = bSteps[Math.min(idx, bSteps.length-1)];
  const sortedA = aSteps.slice(0, Math.min(idx+1, aSteps.length)).filter(s=>s.type==="mark_sorted").flatMap(s=>s.indices);
  const sortedB = bSteps.slice(0, Math.min(idx+1, bSteps.length)).filter(s=>s.type==="mark_sorted").flatMap(s=>s.indices);

  useEffect(()=>{
    if(playing){
      timerRef.current=setTimeout(()=>{
        if(idx < max-1) setIdx(i=>i+1);
        else setPlaying(false);
      }, speed);
    }
    return ()=> clearTimeout(timerRef.current);
  },[playing, idx, max, speed]);

  // clamp idx when algos change
  useEffect(()=>{ if(idx>=max) setIdx(0); },[max]);
  // keyboard
  useEffect(()=>{
    const onKey=(e)=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="SELECT") return;
      if(e.code==="Space"){ e.preventDefault(); setPlaying(v=>!v); }
      else if(e.code==="ArrowRight") setIdx(i=> Math.min(i+1, max-1));
      else if(e.code==="ArrowLeft") setIdx(i=> Math.max(i-1,0));
    };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  },[max]);

  const handlePlay=()=>{
    if(idx>=max-1) setIdx(0);
    setPlaying(v=>!v);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
      <h1 className="text-3xl font-black flex items-center gap-2"><Swords/> COMPARE — 2 algos, 1 array</h1>
      <p className="font-bold text-black/60">Same array pe kaun tez? O(n²) vs O(n log n) live dekho. Dono ek saath auto-play honge.</p>
      <div className="mt-4 flex flex-wrap gap-3 items-end">
        <div>
          <div className="text-xs font-black">ARRAY</div>
          <div className="font-mono text-sm border-[2px] border-black rounded-xl px-3 py-2 bg-white">[{arr.join(", ")}]</div>
        </div>
        <button onClick={()=> { const n=gen(8); setArr(n); setIdx(0); setPlaying(false); }} className="brutal-btn bg-brutalYellow"><Shuffle size={14}/> Randomize</button>
        <div>
          <div className="text-xs font-black">A</div>
          <select value={aId} onChange={e=>{ setAId(e.target.value); setIdx(0); setPlaying(false); }} className="brutal-input !py-2">
            {sorting.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <div className="text-xs font-black">B</div>
          <select value={bId} onChange={e=>{ setBId(e.target.value); setIdx(0); setPlaying(false); }} className="brutal-input !py-2">
            {sorting.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-black">SPEED</span>
          <input type="range" min={80} max={800} step={40} value={800-speed} onChange={e=> setSpeed(880 - Number(e.target.value))} className="w-20 accent-black" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <button onClick={handlePlay} className={`brutal-btn !rounded-full ${playing?"bg-brutalPink":"bg-brutalYellow"}`}>
          {playing ? <><Pause size={16} strokeWidth={3}/> Pause</> : <><Play size={16} strokeWidth={3}/> Play Both</>}
        </button>
        <button onClick={()=> setIdx(0)} className="brutal-btn bg-white"><RotateCcw size={14}/> Reset</button>
        <div className="flex items-center gap-2 text-xs font-black border-[2px] border-black rounded-full px-3 py-1.5 bg-white">
          {idx+1} / {max} {playing && "• Playing…"} 
        </div>
        <span className="text-xs font-bold text-black/40 ml-auto">Space = Play/Pause • →/← Step</span>
      </div>

      <div className="mt-2">
        <input type="range" min={0} max={max-1} value={idx} onChange={e=> setIdx(Number(e.target.value))} className="w-full accent-black h-2" aria-label="Compare timeline" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        {[ [a,curA,sortedA,aSteps], [b,curB,sortedB,bSteps] ].map(([algo,cur,sorted,steps])=>(
          <div key={algo.id} className="brutal-card p-4 bg-white">
            <div className="font-black flex items-center gap-2">{algo.name} <span className="ml-auto text-xs border border-black rounded-full px-2 py-0.5">{algo.time}</span> <span className={`text-[10px] px-2 py-0.5 rounded-full border border-black font-black ${idx >= steps.length-1 ? "bg-brutalLime" : "bg-brutalYellow"}`}>{idx >= steps.length-1 ? "DONE" : "RUNNING"}</span></div>
            <div className="text-xs font-bold text-black/60 truncate min-h-[18px]">{cur?.message}</div>
            <div className="text-[11px] font-mono font-bold">Steps: {Math.min(idx+1, steps.length)}/{steps.length}</div>
            <ArrayBars array={cur?.array||arr} activeIndices={cur?.indices||[]} sortedIndices={sorted} />
          </div>
        ))}
      </div>
      <div className="mt-4 brutal-card p-3 bg-brutalYellow text-sm font-bold">💡 Tip: Bubble vs Quick — same array pe Quick jaldi DONE hoga. Speed slider se slow-mo dekho!</div>
    </div>
  );
}
