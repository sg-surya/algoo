import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getAlgo, algorithms } from "../data/algorithms";
import ArrayBars from "../components/ArrayBars";
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Gauge, Code2, Brain, Clock, Layers } from "lucide-react";

function genArray(n=8, max=30){
  return Array.from({length:n},()=> Math.floor(Math.random()* (max-4))+5);
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
  const timerRef = useRef(null);

  const cur = steps[idx] || steps[0];
  const array = cur?.array || arr;
  const active = cur?.indices || [];
  const isCompare = cur?.type==="compare" || cur?.type==="swap" || cur?.type==="pick_pivot";
  const sorted = steps.slice(0, idx+1).filter(s=>s.type==="mark_sorted").flatMap(s=>s.indices);
  const pivotIdx = cur?.type==="pick_pivot" || cur?.type==="compare" ? cur.indices[1] : null;

  const stats = {
    comparisons: steps.slice(0,idx+1).filter(s=>s.type==="compare").length,
    swaps: steps.slice(0,idx+1).filter(s=>s.type==="swap"||s.type==="swap_done").length,
  };

  const rebuild = (newArr)=>{
    const s = algo.stepsFn(newArr);
    setSteps(s); setIdx(0); setPlaying(false);
  };

  useEffect(()=>{
    rebuild(arr);
    // eslint-disable-next-line
  },[id]);

  useEffect(()=>{
    if(playing){
      timerRef.current = setTimeout(()=>{
        if(idx < steps.length-1) setIdx(i=>i+1);
        else setPlaying(false);
      }, speed);
    }
    return ()=> clearTimeout(timerRef.current);
  },[playing, idx, steps.length, speed]);

  const handlePlay = ()=>{
    if(idx>=steps.length-1) { setIdx(0); setPlaying(true); }
    else setPlaying(!playing);
  };
  const handleStep = ()=> setIdx(i=> Math.min(i+1, steps.length-1));
  const handleReset = ()=> setIdx(0);
  const handleShuffle = ()=>{
    const n = genArray(size);
    setArr(n);
    rebuild(n);
  };
  const handleSize = (n)=>{
    setSize(n);
    const na = genArray(n);
    setArr(na);
    rebuild(na);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-4 grid lg:grid-cols-[220px_1fr] gap-6">
      {/* Sidebar */}
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

        {/* Visualizer Card - yellow pop */}
        <div className="brutal-card p-4 md:p-6 !bg-[#FFFDF5]">
          <ArrayBars array={array} activeIndices={isCompare ? active : []} sortedIndices={sorted} pivotIndex={pivotIdx} />
          <div className="mt-4 p-3 rounded-xl bg-brutalYellow border-[2.5px] border-black shadow-brutal-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="text-sm font-bold">
              <span className="text-black/60 text-xs font-black">STEP {idx+1}/{steps.length} — </span>
              <span className="text-black">{cur?.message}</span>
            </div>
            <div className="hidden md:flex gap-2 text-xs font-black">
              <span className="px-3 py-1 rounded-full bg-white border-[2px] border-black">CMP: {stats.comparisons}</span>
              <span className="px-3 py-1 rounded-full bg-black text-white border-[2px] border-black">SWAPS: {stats.swaps}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button onClick={handlePlay} className={`brutal-btn !rounded-full ${playing ? "bg-brutalPink" : "bg-brutalYellow"}`}>
              {playing ? <><Pause size={16} strokeWidth={3}/> PAUSE</> : <><Play size={16} strokeWidth={3}/> PLAY</>}
            </button>
            <button onClick={handleStep} className="brutal-btn"><SkipForward size={16} strokeWidth={3}/> STEP</button>
            <button onClick={handleReset} className="brutal-btn bg-white"><RotateCcw size={16} strokeWidth={3}/> RESET</button>
            <button onClick={handleShuffle} className="brutal-btn bg-brutalCyan"><Shuffle size={16} strokeWidth={3}/> RANDOMIZE</button>

            <div className="ml-auto flex items-center gap-3 flex-wrap">
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

          <div className="md:hidden flex gap-2 mt-3 text-xs font-black">
            <span className="px-2 py-1 rounded-full bg-white border-[2px] border-black">CMP: {stats.comparisons}</span>
            <span className="px-2 py-1 rounded-full bg-black text-white border-[2px] border-black">SWAPS: {stats.swaps}</span>
            <span className="ml-auto">{idx+1}/{steps.length}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="brutal-card p-5 !bg-white">
            <div className="flex items-center gap-2 text-sm font-black mb-3"><span className="w-8 h-8 rounded-lg bg-black text-brutalYellow grid place-items-center"><Code2 size={16}/></span> CODE <span className="text-xs font-bold text-black/40 border border-black rounded-full px-2 py-0.5">PYTHON</span></div>
            <div className="rounded-xl bg-[#F7F5EB] border-[2.5px] border-black p-3 font-mono text-xs leading-5 overflow-x-auto shadow-inner">
              {algo.code.map((line,i)=>(
                <div key={i} className={`px-2 py-0.5 rounded-lg border-l-[4px] ${cur?.codeLine===i ? "bg-brutalYellow border-black font-bold" : "border-transparent text-black/60"}`}>
                  <span className="text-black/20 mr-3 select-none font-bold">{String(i+1).padStart(2," ")}</span>{line || " "}
                </div>
              ))}
            </div>
          </div>

          <div className="brutal-card p-5 space-y-4 !bg-white">
            <div className="flex items-center gap-2 text-sm font-black"><span className="w-8 h-8 rounded-lg bg-brutalPink border-[2px] border-black grid place-items-center"><Brain size={16}/></span> WHAT'S HAPPENING</div>
            <p className="text-sm font-medium text-black/70 leading-relaxed">{algo.description} <br/><br/> <span className="font-black bg-brutalYellow px-1 border border-black">Key idea:</span> {algo.personality} {algo.hindi}</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-brutalLime border-[2.5px] border-black p-3 text-center shadow-brutal-sm"><div className="text-[10px] font-black tracking-widest">BEST</div><div className="font-mono text-sm font-black">{algo.complexity.best}</div></div>
              <div className="rounded-xl bg-brutalYellow border-[2.5px] border-black p-3 text-center shadow-brutal-sm"><div className="text-[10px] font-black tracking-widest">AVG</div><div className="font-mono text-sm font-black">{algo.complexity.avg}</div></div>
              <div className="rounded-xl bg-white border-[2.5px] border-black p-3 text-center shadow-brutal-sm"><div className="text-[10px] font-black tracking-widest">WORST</div><div className="font-mono text-sm font-black">{algo.complexity.worst}</div></div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-black">
              <span className="px-3 py-1 rounded-full bg-brutalLime border-[2px] border-black">STABLE: {algo.stable ? "YES" : algo.stable===null ? "—" : "NO"}</span>
              <span className="px-3 py-1 rounded-full bg-white border-[2px] border-black">SPACE {algo.space}</span>
              <span className="px-3 py-1 rounded-full bg-brutalCyan border-[2px] border-black">{algo.whenToUse}</span>
            </div>
            <div className="pt-3 border-t-[2.5px] border-black">
              <div className="text-xs font-black mb-2">PROS / CONS</div>
              <div className="flex gap-4 text-xs font-bold">
                <ul className="list-disc list-inside">{algo.pros.map(p=> <li key={p}>{p}</li>)}</ul>
                <ul className="list-disc list-inside text-black/50">{algo.cons.map(c=> <li key={c}>{c}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>

        <div className="brutal-card p-5">
          <div className="text-sm font-black mb-3 flex items-center gap-2"><Layers size={16} strokeWidth={3}/> ALL STEPS — CLICK TO JUMP</div>
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            {steps.map((s,i)=>(
              <button key={i} onClick={()=> setIdx(i)} className={`shrink-0 w-9 h-9 rounded-full text-xs font-black border-[2.5px] border-black shadow-brutal-sm ${i===idx ? "bg-black text-white" : i<idx ? "bg-brutalYellow" : "bg-white"}`}>{i+1}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
