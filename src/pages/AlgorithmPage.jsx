import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getAlgo, algorithms } from "../data/algorithms";
import ArrayBars from "../components/ArrayBars";
import GraphCanvas from "../components/GraphCanvas";
import TreeCanvas from "../components/TreeCanvas";
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Volume2, VolumeX, Share2, Check, Settings2, ArrowLeft, Copy } from "lucide-react";
import { playForStep, setVolume } from "../utils/sound";

function genArray(n=8, max=30){ return Array.from({length:n},()=> Math.floor(Math.random()* (max-4))+5); }
function parseCustom(str){
  const nums = str.split(",").map(s=> s.trim()).filter(Boolean).map(Number).filter(n=> !isNaN(n) && n>=1 && n<=99);
  return nums.length>=3 && nums.length<=16 ? nums : null;
}

export default function AlgorithmPage(){
  const { id } = useParams();
  const algo = getAlgo(id) || algorithms[0];
  const isGraph = algo.category==="Graphs";
  const isSearch = algo.category==="Searching";
  const isTree = algo.category==="Trees";
  const needsTarget = isSearch || id==="bst-search";

  const getUrlParams = ()=>{
    try{
      const sp = new URLSearchParams(window.location.search);
      return {arr: sp.get("arr"), step: sp.get("step"), target: sp.get("target")};
    }catch{ return {arr:null, step:null, target:null}; }
  };
  const _url = typeof window!=="undefined" ? getUrlParams() : {arr:null, step:null, target:null};
  const initialArr = _url.arr ? parseCustom(_url.arr) || [8,3,5,1,7,2] : [8,3,5,1,7,2];
  const urlStep = parseInt(_url.step||"0",10);
  const initialTarget = _url.target!==null && _url.target!=="" && !isNaN(Number(_url.target)) ? Number(_url.target) : initialArr[Math.floor(initialArr.length/2)];

  const [arr, setArr] = useState(initialArr);
  const [target, setTarget] = useState(initialTarget);
  const [targetInput, setTargetInput] = useState(String(initialTarget));
  const [steps, setSteps] = useState(()=> isGraph ? algo.stepsFn() : (isSearch || isTree) ? algo.stepsFn(initialArr, initialTarget) : algo.stepsFn(initialArr));
  const [idx, setIdx] = useState(isNaN(urlStep)?0: Math.min(urlStep, 1000));
  const [playing, setPlaying] = useState(false);
  const [speedLabel, setSpeedLabel] = useState("Normal");
  const speed = speedLabel==="Slow" ? 800 : speedLabel==="Fast" ? 200 : 450;
  const [customInput, setCustomInput] = useState(initialArr.join(", "));
  const [customErr, setCustomErr] = useState("");
  const [soundOn, setSoundOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [learnTab, setLearnTab] = useState("story");
  const prevIdxRef = useRef(0);
  const lastSoundRef = useRef(0);
  const timerRef = useRef(null);

  const cur = steps[idx] || steps[0];
  const array = cur?.array || arr;
  const active = cur?.indices || [];
  const isCompare = cur?.type==="compare" || cur?.type==="swap" || cur?.type==="pick_pivot";
  const sorted = steps.slice(0, idx+1).filter(s=>s.type==="mark_sorted").flatMap(s=>s.indices);
  const pivotIdx = cur?.type==="pick_pivot" || cur?.type==="compare" ? cur.indices[1] : null;
  const vars = cur?.variables || {};
  const comps = vars.comps ?? 0;
  const swaps = vars.swaps ?? 0;
  const graph = cur?.graph;
  const tree = cur?.tree;
  const varLine = Object.entries(vars).filter(([k])=>k!=="comps"&&k!=="swaps").map(([k,v])=>`${k}=${v}`).join("  ");

  const rebuild = (newArr, newTarget = target)=>{
    const s = isGraph ? algo.stepsFn() : (isSearch || isTree) ? algo.stepsFn(newArr, newTarget) : algo.stepsFn(newArr);
    setSteps(s); setIdx(0); setPlaying(false);
  };

  useEffect(()=>{ if(idx >= steps.length) setIdx(0); },[steps.length]);

  useEffect(()=>{
    document.title = `${algo.name} — AlgoVerse`;
    if(isGraph){
      const s = algo.stepsFn();
      setSteps(s); setIdx(0); setPlaying(false);
    } else if(isSearch || isTree){
      const valid = arr && arr.length>=3 ? arr : [8,3,5,1,7,2];
      const validTarget = target ?? valid[Math.floor(valid.length/2)];
      setTargetInput(String(validTarget));
      const s = algo.stepsFn(valid, validTarget);
      setSteps(s); setIdx(0); setPlaying(false);
    } else {
      const valid = arr && arr.length>=3 ? arr : [8,3,5,1,7,2];
      rebuild(valid);
    }
    // eslint-disable-next-line
  },[id]);

  useEffect(()=>{
    if(isGraph) return;
    try{
      const params = new URLSearchParams();
      params.set("arr", arr.join(","));
      if(needsTarget) params.set("target", String(target));
      if(idx>0) params.set("step", String(idx));
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    }catch{}
  },[arr, idx, isGraph, needsTarget, target]);

  useEffect(()=>{
    if(playing){
      timerRef.current = setTimeout(()=>{
        if(idx < steps.length-1) setIdx(i=>i+1);
        else setPlaying(false);
      }, speed);
    }
    return ()=> clearTimeout(timerRef.current);
  },[playing, idx, steps.length, speed]);

  useEffect(()=>{ setVolume(0.1); },[]);
  useEffect(()=>{
    if(!soundOn) return;
    if(prevIdxRef.current === idx) return;
    const now=Date.now();
    if(now - lastSoundRef.current < 120) return;
    if(Math.abs(idx - prevIdxRef.current) > 3) { prevIdxRef.current=idx; return; }
    lastSoundRef.current=now;
    if(idx!==0) try{ playForStep(cur); }catch{}
    prevIdxRef.current = idx;
  },[idx, soundOn, cur]);

  useEffect(()=>{
    const onKey=(e)=>{
      if(e.target.tagName==="INPUT" || e.target.tagName==="SELECT") return;
      if(e.code==="Space"){ e.preventDefault(); handlePlay(); }
      else if(e.code==="ArrowRight"){ setIdx(i=> Math.min(i+1, steps.length-1)); }
      else if(e.code==="ArrowLeft"){ setIdx(i=> Math.max(i-1,0)); }
    };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  },[steps.length, playing, idx]);

  const handlePlay = ()=>{
    if(idx>=steps.length-1) { setIdx(0); setPlaying(true); }
    else setPlaying(!playing);
  };
  const applyNewArray = (n)=>{
    setArr(n); setCustomInput(n.join(", "));
    rebuild(n, target);
  };
  const handleCustom = ()=>{
    const parsed = parseCustom(customInput);
    if(!parsed){ setCustomErr("3–16 numbers, comma se likho (e.g. 9, 8, 7, 6)"); return; }
    setCustomErr("");
    setArr(parsed);
    rebuild(parsed, target);
  };
  const handleTargetGo = ()=>{
    const v = Number(targetInput);
    if(isNaN(v)) return;
    setTarget(v);
    rebuild(arr, v);
  };

  const progress = steps.length>1 ? (idx/(steps.length-1))*100 : 0;

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-5">
      {/* Simple header */}
      <div className="flex items-center gap-3 mb-4">
        <Link to="/explorer" className="w-9 h-9 grid place-items-center rounded-full bg-white border-[2.5px] border-black shadow-brutal-sm" aria-label="Back to explorer"><ArrowLeft size={16} strokeWidth={3}/></Link>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none truncate">{algo.name} <span className="text-xs align-middle ml-1 px-2 py-0.5 rounded-full border-[2px] border-black bg-brutalYellow">{algo.time}</span></h1>
          <p className="text-sm text-black/60 font-medium truncate">"{algo.personality}"</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={()=> setSoundOn(v=>!v)} className="w-9 h-9 grid place-items-center rounded-full bg-white border-[2.5px] border-black shadow-brutal-sm" title="Sound on/off" aria-label="Toggle sound">
            {soundOn ? <Volume2 size={16}/> : <VolumeX size={16} className="opacity-40"/>}
          </button>
          <button onClick={async()=>{ await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(()=>setCopied(false),1200); }} className="w-9 h-9 grid place-items-center rounded-full bg-white border-[2.5px] border-black shadow-brutal-sm" title="Copy link" aria-label="Copy link">
            {copied ? <Check size={16}/> : <Share2 size={16}/>}
          </button>
        </div>
      </div>

      {/* Main visual card — only 3 actions visible */}
      <div className="brutal-card p-4 md:p-6 !bg-[#FFFDF5]">
        {/* legend — one subtle line */}
        <div className="text-[11px] font-bold text-black/50 mb-2 flex flex-wrap gap-3">
          {isTree ? <><span>● Current</span><span>● Visited</span><span>● Found</span></> :
          !isGraph ? (
            isSearch ? <><span>● Compare</span><span className="text-black">● Target 🎯</span><span>● Found</span></> :
            <><span>● Compare</span><span>● Swap</span><span>● Sorted</span></>
          ) : <><span>● Current</span><span>● Visited</span></>}
          <span className="ml-auto hidden sm:inline">Step {idx+1}/{steps.length}</span>
        </div>

        {/* TARGET — always visible for search + bst-search */}
        {needsTarget && !isGraph && (
          <div className="mb-3 rounded-xl border-[2.5px] border-black bg-brutalCyan p-2.5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-black">🎯 FIND:</span>
            <input value={targetInput} onChange={e=> setTargetInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") handleTargetGo(); }} type="number" className="w-20 brutal-input !py-1 text-center font-mono font-black !text-sm" aria-label="Target value" />
            <button onClick={handleTargetGo} className="brutal-btn !py-1 bg-black text-white !text-xs">Go</button>
            <button onClick={()=>{ const v=arr[Math.floor(Math.random()*arr.length)]; setTarget(v); setTargetInput(String(v)); rebuild(arr,v); }} className="brutal-btn !py-1 !text-xs bg-white">Random</button>
            <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border-[2px] border-black ${array.includes(target) ? "bg-brutalLime" : "bg-brutalPink"}`}>{array.includes(target) ? "MILEGA ✓" : "NAHI MILEGA ✕"}</span>
          </div>
        )}

        {/* CUSTOM DATA — always visible */}
        {!isGraph && (
          <div className="mb-3 rounded-xl border-[2px] border-black bg-white p-2.5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-black">✏️ DATA:</span>
            <input value={customInput} onChange={e=> setCustomInput(e.target.value)} placeholder="e.g. 8, 3, 5, 1, 7, 2" className="flex-1 min-w-[160px] brutal-input !py-1 !text-xs font-mono" aria-label="Custom data" />
            <button onClick={handleCustom} className="brutal-btn !py-1 bg-brutalYellow !text-xs">Set</button>
            {customErr && <span className="text-xs font-bold text-red-600 w-full">{customErr}</span>}
          </div>
        )}

        {isTree ? (
          tree ? <TreeCanvas tree={tree} /> :
          <div className="text-center py-10 font-bold text-black/40">Loading…</div>
        ) : !isGraph ? (
          <ArrayBars array={array} activeIndices={isCompare ? active : []} sortedIndices={sorted} pivotIndex={pivotIdx} targetValue={needsTarget ? target : null} />
        ) : (
          graph ? <GraphCanvas graph={graph} current={cur?.current} visited={graph?.visited} /> :
          <div className="text-center py-10 font-bold text-black/40">Loading…</div>
        )}

        {/* message — single line */}
        <div className="mt-3 text-center">
          <p className="text-[15px] font-bold leading-snug min-h-[24px]">{cur?.message}</p>
          <p className="text-xs text-black/45 font-mono mt-1">Comparisons {comps} · {isGraph ? `Visited ${graph?.visited?.length||0}` : isTree ? `Visited ${tree?.visited?.length||tree?.order?.length||0}` : `Swaps ${swaps}`} {varLine && <span>· {varLine}</span>}</p>
        </div>

        {/* timeline — single slider */}
        <div className="mt-3">
          <input type="range" min={0} max={steps.length-1} value={idx} onChange={e=> setIdx(Number(e.target.value))} className="w-full accent-black" aria-label="Timeline" />
          <div className="h-1 rounded-full bg-black/10 overflow-hidden"><div className="h-full bg-black" style={{width:`${progress}%`}}/></div>
        </div>

        {/* primary controls — only Play / Step / Reset */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button onClick={()=> setIdx(0)} className="brutal-btn bg-white !px-4" aria-label="Restart"><RotateCcw size={16} strokeWidth={3}/></button>
          <button onClick={handlePlay} className={`brutal-btn !rounded-full !px-8 !py-3 text-base ${playing ? "bg-brutalPink" : "bg-black text-white"}`}>
            {playing ? <><Pause size={18} strokeWidth={3}/> Pause</> : <><Play size={18} strokeWidth={3}/> {idx>=steps.length-1 ? "Replay" : "Play"}</>}
          </button>
          <button onClick={()=> setIdx(i=> Math.min(i+1, steps.length-1))} className="brutal-btn bg-white !px-4" aria-label="Next step"><SkipForward size={16} strokeWidth={3}/></button>
        </div>

        {/* speed — segmented, not slider */}
        <div className="mt-3 flex items-center justify-center gap-1 text-xs font-black">
          {["Slow","Normal","Fast"].map(s=>(
            <button key={s} onClick={()=> setSpeedLabel(s)} className={`px-3 py-1 rounded-full border-[2px] border-black ${speedLabel===s ? "bg-black text-white" : "bg-white"}`}>{s}</button>
          ))}
          <span className="mx-2 text-black/20">|</span>
          <button onClick={()=> setShowSettings(v=>!v)} className={`flex items-center gap-1 px-3 py-1 rounded-full border-[2px] border-black ${showSettings ? "bg-brutalYellow" : "bg-white"}`}>
            <Settings2 size={12}/> {showSettings ? "Hide" : "Customize"}
          </button>
          {!isGraph && (
            <button onClick={()=>{ const n=genArray(arr.length); applyNewArray(n); }} className="flex items-center gap-1 px-3 py-1 rounded-full border-[2px] border-black bg-white">
              <Shuffle size={12}/> Shuffle
            </button>
          )}
        </div>

        {/* settings — only presets + size, data/target already visible above */}
        {showSettings && !isGraph && (
          <div className="mt-3 rounded-xl border-[2px] border-black bg-white p-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-black mr-1">Try:</span>
            {[["Sorted","sorted"],["Reverse","reverse"],["Nearly","nearly"]].map(([label,t])=>(
              <button key={t} onClick={()=>{ let n; if(t==="sorted") n=[...arr].sort((a,b)=>a-b); else if(t==="reverse") n=[...arr].sort((a,b)=>b-a); else { n=[...arr].sort((a,b)=>a-b); if(n.length>2){ const x=n[1]; n[1]=n[2]; n[2]=x; } } applyNewArray(n); }} className="px-2.5 py-1 text-xs font-black rounded-full border-[2px] border-black bg-white">{label}</button>
            ))}
            <span className="text-[11px] font-bold text-black/40 ml-1">Size:</span>
            {[6,10,14].map(n=>(
              <button key={n} onClick={()=>{ const na=genArray(n); applyNewArray(na); }} className="px-2 py-1 text-xs font-black rounded-full border-[2px] border-black bg-white">{n}</button>
            ))}
          </div>
        )}
      </div>

      {/* Learn — tabs, not long scroll */}
      <div className="mt-4 brutal-card p-4 md:p-5 !bg-white">
        <div className="flex gap-1 mb-3">
          {[["story","Story"],["code","Code"],["complexity","Complexity"]].map(([k,label])=>(
            <button key={k} onClick={()=> setLearnTab(k)} className={`px-4 py-1.5 text-sm font-black rounded-full border-[2px] border-black ${learnTab===k ? "bg-black text-white" : "bg-white"}`}>{label}</button>
          ))}
        </div>
        {learnTab==="story" && (
          <div className="text-sm leading-relaxed">
            <p className="font-medium text-black/75">{algo.description}</p>
            <div className="mt-2 p-2.5 rounded-xl bg-brutalYellow border-[2px] border-black text-[13px] font-bold">💡 {algo.analogy}</div>
            <p className="mt-2 text-[13px] text-black/55 font-medium">Use: {algo.realWorld}</p>
          </div>
        )}
        {learnTab==="code" && (
          <div className="rounded-xl bg-[#F7F5EB] border-[2px] border-black p-2 font-mono text-xs leading-5 overflow-x-auto">
            {algo.code.map((line,i)=>(
              <div key={i} className={`px-2 py-0.5 rounded ${cur?.codeLine===i ? "bg-brutalYellow font-bold" : "text-black/55"}`}>
                <span className="text-black/25 mr-2">{String(i+1).padStart(2," ")}</span>{line}
              </div>
            ))}
          </div>
        )}
        {learnTab==="complexity" && (
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["Best",algo.complexity.best,"bg-brutalLime"],["Avg",algo.complexity.avg,"bg-brutalYellow"],["Worst",algo.complexity.worst,"bg-white"]].map(([k,v,c])=>(
              <div key={k} className={`rounded-xl border-[2px] border-black p-3 ${c}`}><div className="text-[10px] font-black">{k.toUpperCase()}</div><div className="font-mono font-black">{v}</div></div>
            ))}
          </div>
        )}
      </div>

      {/* more algos — simple row */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {algorithms.filter(a=>a.category===algo.category).map(a=>(
          <Link key={a.id} to={`/algorithms/${a.id}`} className={`shrink-0 px-3 py-1.5 text-xs font-black rounded-full border-[2px] border-black ${a.id===algo.id ? "bg-black text-white" : "bg-white"}`}>{a.name}</Link>
        ))}
        <Link to="/explorer" className="shrink-0 px-3 py-1.5 text-xs font-black rounded-full border-[2px] border-dashed border-black">All →</Link>
      </div>
    </div>
  );
}
