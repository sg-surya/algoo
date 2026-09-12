import { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";

const STEPS=[
  {title:"1 — Pick algorithm", desc:"Left se Bubble/Heap/BFS choose karo. Har ek ka Hindi story + analogy diya hai."},
  {title:"2 — Scrub timeline", desc:"Bars ke neeche TIMELINE slider ko drag karo — YouTube jaisa aage-peeche."},
  {title:"3 — Try Reverse preset", desc:"CUSTOM ARRAY me Reverse dabao → dekho O(n²) kaise slow hota hai. Sound on rakho!"},
];

export default function Onboarding(){
  const [open,setOpen]=useState(false);
  const [idx,setIdx]=useState(0);
  useEffect(()=>{
    if(!localStorage.getItem("av_onboarded")){
      const t=setTimeout(()=> setOpen(true), 900);
      return ()=> clearTimeout(t);
    }
  },[]);
  if(!open) return null;
  const dismiss=()=>{
    localStorage.setItem("av_onboarded","1");
    setOpen(false);
  };
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm grid place-items-center p-4" onClick={dismiss}>
      <div className="brutal-card max-w-[420px] w-full p-6 bg-white" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="font-black text-lg">30-sec Tour 👋</div>
          <button onClick={dismiss} className="w-8 h-8 grid place-items-center rounded-full border-[2px] border-black"><X size={14}/></button>
        </div>
        <div className="mt-4 brutal-card p-4 bg-brutalYellow">
          <div className="font-black">{STEPS[idx].title}</div>
          <div className="text-sm font-medium">{STEPS[idx].desc}</div>
        </div>
        <div className="flex gap-2 mt-4">
          {idx>0 && <button onClick={()=> setIdx(i=>i-1)} className="brutal-btn bg-white">Back</button>}
          {idx<STEPS.length-1 ? <button onClick={()=> setIdx(i=>i+1)} className="brutal-btn bg-black text-white ml-auto">Next <ArrowRight size={14}/></button>
            : <button onClick={dismiss} className="brutal-btn bg-brutalLime ml-auto">Start Exploring →</button>}
        </div>
        <div className="text-center text-xs font-bold text-black/40 mt-3">{idx+1} / {STEPS.length}</div>
      </div>
    </div>
  );
}
