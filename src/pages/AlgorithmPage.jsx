import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getAlgo, algorithms } from "../data/algorithms";
import ArrayBars from "../components/ArrayBars";
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Gauge, Code2, Brain, Clock, Layers, Volume2, VolumeX } from "lucide-react";
import { playForStep } from "../utils/sound";

function genArray(n=8, max=30){ return Array.from({length:n},()=> Math.floor(Math.random()* (max-4))+5); }
function parseCustom(str){
  const nums = str.split(",").map(s=> s.trim()).filter(Boolean).map(Number).filter(n=> !isNaN(n) && n>=1 && n<=99);
  return nums.length>=3 && nums.length<=16 ? nums : null;
}

export default function AlgorithmPage(){
  const { id } = useParams();
  const algo = getAlgo(id) || algorithms[0];
  const [arr, setArr] = useState(()=> [8,3,5,1,7,2]);
  const [steps, setSteps] = useState(()=> algo.stepsFn([8,3,5,1,7,2]));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [size, setSize] = useState(6);
  const [customInput, setCustomInput] = useState("8, 3, 5, 1, 7, 2");
  const [customErr, setCustomErr] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const prevIdxRef = useRef(0);
  const timerRef = useRef(null);

  const cur = steps[idx] || steps[0];
  const array = cur?.array || arr;
  const active = cur?.indices || [];
  const isCompare = cur?.type==="compare" || cur?.type==="swap" || cur?.type==="pick_pivot";
  const sorted = steps.slice(0, idx+1).filter(s=>s.type==="mark_sorted").flatMap(s=>s.indices);
  const pivotIdx = cur?.type==="pick_pivot" || cur?.type==="compare" ? cur.indices[1] : null;
  const vars = cur?.variables || {};
  const comps = vars.comps ?? steps.slice(0,idx+1).filter(s=>s.type==="compare").length;
  const swaps = vars.swaps ?? steps.slice(0,idx+1).filter(s=>s.type==="swap_done").length;

  const rebuild = (newArr)=>{
    const s = algo.stepsFn(newArr);
    setSteps(s); setIdx(0); setPlaying(false);
  };

  useEffect(()=>{ rebuild(arr); },[id]);

  useEffect(()=>{
    if(playing){
      timerRef.current = setTimeout(()=>{
        if(idx < steps.length-1) setIdx(i=>i+1);
        else setPlaying(false);
      }, speed);
    }
    return ()=> clearTimeout(timerRef.current);
  },[playing, idx, steps.length, speed]);

  // sound on step change (not on initial mount, and not when scrubbing fast? we play always but throttled)
  useEffect(()=>{
    if(!soundOn) return;
    if(prevIdxRef.current === idx) return;
    // only play if user is playing or just stepped (not on rebuild where idx resets to 0)
    // simple: play if idx !==0
    if(idx!==0 || steps[idx]?.type==="start"){
      playForStep(cur);
    }
    prevIdxRef.current = idx;
  },[idx, soundOn, cur, steps]);

  const handlePlay = ()=>{
    if(idx>=steps.length-1) { setIdx(0); setPlaying(true); }
    else setPlaying(!playing);
  };
  const handleStep = ()=> setIdx(i=> Math.min(i+1, steps.length-1));
  const handleReset = ()=> setIdx(0);
  const handleShuffle = ()=>{
    const n = genArray(size);
    setArr(n); setCustomInput(n.join(", "));
    rebuild(n);
  };
  const handleSize = (n)=>{
    setSize(n);
    const na = genArray(n);
    setArr(na); setCustomInput(na.join(", "));
    rebuild(na);
  };
  const handleCustom = ()=>{
    const parsed = parseCustom(customInput);
    if(!parsed){ setCustomErr("3-16 numbers, 1-99, comma se alag karo"); return; }
    setCustomErr("");
    setArr(parsed); setSize(parsed.length);
    rebuild(parsed);
  };
  const handlePreset = (type)=>{
    let n;
    if(type==="sorted") n=[...arr].sort((a,b)=>a-b);
    else if(type==="reverse") n=[...arr].sort((a,b)=>b-a);
    else if(type==="nearly"){ n=[...arr].sort((a,b)=>a-b); if(n.length>2){ const t=n[1]; n[1]=n[2]; n[2]=t; } }
    else if(type==="same") n=Array(arr.length).fill(7);
    else n=genArray(size);
    setArr(n); setCustomInput(n.join(", "));
    rebuild(n);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-4 grid lg:grid-cols-[220px_1fr] gap-6">
      <aside className="hidden lg:block sticky top-[76px] h-fit space-y-3">
        <div className="text-xs font-black tracking-widest">EXPLORE</div>
        <div className="space-y-2">
          <div className="text-xs font-black px-2">SORTING</div>
          {algorithms.filter(a=>a.category==="Sorting").map(a=>(
            <Link key={a.id} to={`/algorithms/${a.id}`} className={`block px-3 py-2.5 rounded-xl text-sm font-black border-[2.5px] border-black shadow-brutal-sm ${a.id===algo.id ? "bg-black text-white" : "bg-white hover:bg-brutalYellow"}`}>{a.name.toUpperCase()}</Link>
          ))}
          <div className="text-xs font-black px-2 pt-2">SEARCHING</div>
          {algorithms.filter(a=>a.category==="Searching").map(a=>(
            <Link key={a.id} to={`/algorithms/${a.id}`} className={`block px-3 py-2.5 rounded-xl text-sm font-black border-[2.5px] border-black ${a.id===algo.id ? "bg-black text-white shadow-brutal-sm" : "bg-white"}`}>{a.name.toUpperCase()}</Link>
          ))}
        </div>
      </aside>

      <div className="space-y-4 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3 flex-wrap">{algo.name.toUpperCase()} <span className={`brutal-badge ${algo.difficulty==="Easy" ? "bg-brutalLime" : "bg-brutalYellow"}`}>{algo.difficulty.toUpperCase()}</span></h1>
            <p className="font-bold italic text-black/70 text-sm">"{algo.personality}"</p>
            <p className="font-medium text-black/60 text-sm mt-1">{algo.hindi}</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-white border-[2.5px] border-black shadow-brutal-sm text-xs font-black flex items-center gap-1"><Clock size={12} strokeWidth={3}/> {algo.time}</span>
            <span className="px-3 py-1.5 rounded-full bg-brutalCyan border-[2.5px] border-black shadow-brutal-sm text-xs font-black">{algo.space} SPACE</span>
          </div>
        </div>

        {/* Visualizer */}
        <div className="brutal-card p-4 md:p-6 !bg-[#FFFDF5]">
          {/* Color Legend - compact */}
          <div className="flex flex-wrap gap-2 text-[11px] font-black mb-3">
            <span className="flex items-center gap-1.5 bg-white border-[2px] border-black rounded-full px-2.5 py-1"><span className="w-3 h-3 bg-brutalYellow border border-black rounded-full"/> COMPARE</span>
            <span className="flex items-center gap-1.5 bg-white border-[2px] border-black rounded-full px-2.5 py-1"><span className="w-3 h-3 bg-brutalPink border border-black rounded-full"/> SWAP</span>
            <span className="flex items-center gap-1.5 bg-white border-[2px] border-black rounded-full px-2.5 py-1"><span className="w-3 h-3 bg-brutalLime border border-black rounded-full"/> SORTED</span>
            <span className="flex items-center gap-1.5 bg-white border-[2px] border-black rounded-full px-2.5 py-1"><span className="w-3 h-3 bg-brutalCyan border border-black rounded-full"/> PIVOT/KEY</span>
            <span className="ml-auto hidden md:flex items-center gap-1.5 text-black/50">💡 {algo.analogy?.slice(0,55)}…</span>
          </div>

          <ArrayBars array={array} activeIndices={isCompare ? active : []} sortedIndices={sorted} pivotIndex={pivotIdx} />

          {/* Timeline Scrubber - video like */}
          <div className="mt-4">
            <div className="flex items-center gap-2 text-xs font-black mb-1"><span>TIMELINE</span><span className="ml-auto font-mono">{idx+1} / {steps.length}</span></div>
            <input type="range" min={0} max={steps.length-1} value={idx} onChange={e=> setIdx(Number(e.target.value))} className="w-full accent-black h-2" />
          </div>

          {/* Message + Counters + Variables - one row */}
          <div className="mt-3 grid md:grid-cols-[1fr_auto] gap-3">
            <div className="p-3 rounded-xl bg-brutalYellow border-[2.5px] border-black shadow-brutal-sm">
              <div className="text-xs font-black text-black/60">STEP {idx+1}/{steps.length} — {cur?.type?.toUpperCase()}</div>
              <div className="text-sm font-bold leading-tight">{cur?.message}</div>
            </div>
            <div className="flex md:flex-col gap-2">
              <div className="flex-1 md:w-[160px] rounded-xl bg-white border-[2.5px] border-black p-2 shadow-brutal-sm flex items-center justify-between">
                <div className="text-xs font-black"><div className="text-black/50 text-[10px]">COMPARISONS</div><div className="text-lg leading-none">{comps}</div></div>
                <div className="h-8 w-px bg-black/10 mx-2"/>
                <div className="text-xs font-black text-right"><div className="text-black/50 text-[10px]">SWAPS</div><div className="text-lg leading-none">{swaps}</div></div>
              </div>
              <div className="hidden md:block rounded-xl bg-black text-white border-[2.5px] border-black p-2 shadow-brutal-sm">
                <div className="text-[10px] font-black text-white/60 tracking-widest">VARIABLES</div>
                <div className="font-mono text-xs font-bold flex flex-wrap gap-1.5 mt-1">
                  {Object.entries(vars).filter(([k])=>k!=="comps"&&k!=="swaps").map(([k,v])=>(
                    <span key={k} className="bg-white text-black px-1.5 py-0.5 rounded border border-black">{k}={String(v)}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="md:hidden mt-2 rounded-xl bg-black text-white border-[2.5px] border-black p-2 flex flex-wrap gap-1.5">
            <span className="text-[10px] font-black text-white/60 w-full">VARIABLES</span>
            {Object.entries(vars).filter(([k])=>k!=="comps"&&k!=="swaps").map(([k,v])=>(
              <span key={k} className="bg-white text-black px-1.5 py-0.5 rounded border border-black font-mono text-xs font-bold">{k}={String(v)}</span>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button onClick={handlePlay} className={`brutal-btn !rounded-full ${playing ? "bg-brutalPink" : "bg-brutalYellow"}`}>
              {playing ? <><Pause size={16} strokeWidth={3}/> PAUSE</> : <><Play size={16} strokeWidth={3}/> PLAY</>}
            </button>
            <button onClick={handleStep} className="brutal-btn"><SkipForward size={16} strokeWidth={3}/> STEP</button>
            <button onClick={handleReset} className="brutal-btn bg-white"><RotateCcw size={16} strokeWidth={3}/> RESET</button>
            <button onClick={handleShuffle} className="brutal-btn bg-brutalCyan"><Shuffle size={16} strokeWidth={3}/> Random</button>
            <button onClick={()=> setSoundOn(v=>!v)} className={`brutal-btn ${soundOn ? "bg-brutalLime" : "bg-white"} !px-3`} title={soundOn ? "Sound On" : "Sound Off"}>
              {soundOn ? <Volume2 size={16} strokeWidth={3}/> : <VolumeX size={16} strokeWidth={3}/>} {soundOn ? "Sound" : "Mute"}
            </button>
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-black border-[2px] border-black rounded-full px-3 py-1.5 bg-white shadow-brutal-sm">
                <Gauge size={14} strokeWidth={3}/> SPEED
                <input type="range" min={80} max={1000} step={40} value={1000-speed} onChange={e=> setSpeed(1080 - e.target.value)} className="w-20 accent-black" />
              </div>
              <div className="flex items-center gap-1 text-xs font-black">
                <span>SIZE</span>
                {[6,8,12,16].map(n=>(
                  <button key={n} onClick={()=>handleSize(n)} className={`w-8 h-8 rounded-full text-xs font-black border-[2.5px] border-black shadow-brutal-sm ${size===n ? "bg-black text-white" : "bg-white"}`}>{n}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Input - compact */}
          <div className="mt-4 brutal-card p-3 !bg-white flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <div className="text-xs font-black">✏️ CUSTOM ARRAY</div>
              <div className="flex gap-2 mt-1">
                <input value={customInput} onChange={e=> setCustomInput(e.target.value)} placeholder="e.g. 9, 8, 7, 6" className="flex-1 brutal-input !py-2 text-xs font-mono" />
                <button onClick={handleCustom} className="brutal-btn !py-2 bg-brutalYellow">Set</button>
              </div>
              {customErr ? <div className="text-xs font-bold text-red-600 mt-1">{customErr}</div> : <div className="text-[11px] font-bold text-black/40 mt-1">3-16 nums, comma separated • try presets →</div>}
            </div>
            <div className="flex gap-1.5 flex-wrap md:max-w-[240px]">
              <button onClick={()=>handlePreset("sorted")} className="brutal-btn !py-1 !text-xs">Sorted</button>
              <button onClick={()=>handlePreset("reverse")} className="brutal-btn !py-1 !text-xs bg-brutalPink">Reverse</button>
              <button onClick={()=>handlePreset("nearly")} className="brutal-btn !py-1 !text-xs bg-brutalCyan">Nearly</button>
              <button onClick={()=>handlePreset("same")} className="brutal-btn !py-1 !text-xs">Same</button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="brutal-card p-5 !bg-white">
            <div className="flex items-center gap-2 text-sm font-black mb-3"><span className="w-8 h-8 rounded-lg bg-black text-brutalYellow grid place-items-center"><Code2 size={16}/></span> CODE <span className="text-xs font-bold text-black/40 border border-black rounded-full px-2 py-0.5">PYTHON</span></div>
            <div className="rounded-xl bg-[#F7F5EB] border-[2.5px] border-black p-3 font-mono text-xs leading-5 overflow-x-auto">
              {algo.code.map((line,i)=>(
                <div key={i} className={`px-2 py-0.5 rounded-lg border-l-[4px] ${cur?.codeLine===i ? "bg-brutalYellow border-black font-bold" : "border-transparent text-black/60"}`}>
                  <span className="text-black/20 mr-3 select-none font-bold">{String(i+1).padStart(2," ")}</span>{line || " "}
                </div>
              ))}
            </div>
          </div>

          <div className="brutal-card p-5 space-y-3 !bg-white">
            <div className="flex items-center gap-2 text-sm font-black"><span className="w-8 h-8 rounded-lg bg-brutalPink border-[2px] border-black grid place-items-center"><Brain size={16}/></span> WHAT'S HAPPENING</div>
            <p className="text-sm font-medium text-black/70 leading-relaxed">{algo.description}</p>
            <div className="p-3 rounded-xl bg-brutalYellow border-[2px] border-black text-xs font-bold">💡 <b>Analogy:</b> {algo.analogy}</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-brutalLime border-[2.5px] border-black p-3 text-center shadow-brutal-sm"><div className="text-[10px] font-black tracking-widest">BEST</div><div className="font-mono text-sm font-black">{algo.complexity.best}</div></div>
              <div className="rounded-xl bg-brutalYellow border-[2.5px] border-black p-3 text-center shadow-brutal-sm"><div className="text-[10px] font-black tracking-widest">AVG</div><div className="font-mono text-sm font-black">{algo.complexity.avg}</div></div>
              <div className="rounded-xl bg-white border-[2.5px] border-black p-3 text-center shadow-brutal-sm"><div className="text-[10px] font-black tracking-widest">WORST</div><div className="font-mono text-sm font-black">{algo.complexity.worst}</div></div>
            </div>
          </div>
        </div>

        <div className="brutal-card p-4">
          <div className="text-sm font-black mb-2 flex items-center gap-2"><Layers size={14}/> JUMP TO STEP</div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {steps.map((s,i)=>(
              <button key={i} onClick={()=> setIdx(i)} className={`shrink-0 w-8 h-8 rounded-full text-xs font-black border-[2.5px] border-black shadow-brutal-sm ${i===idx ? "bg-black text-white" : i<idx ? "bg-brutalYellow" : "bg-white"}`}>{i+1}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
