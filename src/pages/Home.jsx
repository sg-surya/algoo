import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Sparkles, ArrowRight, Layers, Cpu, Lightbulb, Asterisk } from "lucide-react";
import { algorithms } from "../data/algorithms";
import AlgorithmCard from "../components/AlgorithmCard";
import { useEffect, useState } from "react";

function MiniBars(){
  const [arr,setArr]=useState([5,2,8,1,7,3]);
  const [i,setI]=useState(0);
  useEffect(()=>{
    const id=setInterval(()=>{
      setI(prev=>{
        const next=(prev+1)%(arr.length-1);
        setArr(a=>{
          const b=[...a];
          if(b[next]>b[next+1]){ const t=b[next]; b[next]=b[next+1]; b[next+1]=t; }
          return b;
        });
        return next;
      });
    },700);
    return ()=>clearInterval(id);
  },[]);
  return (
    <div className="flex items-end gap-2 h-28">
      {arr.map((v,idx)=>(
        <motion.div key={idx} layout className={`w-10 rounded-t-xl flex items-end justify-center pb-1.5 text-xs font-black border-[2.5px] border-black shadow-brutal-sm ${idx===i || idx===i+1 ? "bg-brutalPink" : "bg-white"}`} style={{height: `${24+v*10}px`}}>{v}</motion.div>
      ))}
    </div>
  );
}

export default function Home(){
  const featured = algorithms.slice(0,3);
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 py-8 md:py-12 items-start">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-black px-3 py-2 rounded-full bg-white border-[2.5px] border-black shadow-brutal-sm">
            <span className="w-2 h-2 rounded-full bg-brutalLime border border-black animate-pulse" /> NEW — 5 SORTING ALGORITHMS LIVE
          </div>
          <h1 className="text-[40px] md:text-[64px] font-black leading-[0.9] tracking-[-0.04em] text-black">
            STOP<br/>
            <span className="inline-block bg-brutalYellow border-[3px] border-black px-2 shadow-brutal rotate-[-1deg]">MEMORIZING</span><br/>
            ALGORITHMS.<br/>
            <span className="inline-block bg-black text-white px-2 rotate-[1deg] -mt-1">START WATCHING</span><br/>
            THEM THINK.
          </h1>
          <p className="text-black/70 font-medium max-w-lg text-[15px] leading-relaxed border-l-[4px] border-black pl-4">Live animation + funny Hinglish commentary + actual code execution + in-depth explanation. No dry textbook, only <span className="font-black bg-brutalCyan px-1 border border-black">click</span> wala learning.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/explorer" className="brutal-btn-dark !rounded-full px-7 py-3.5 text-base">Explore Algorithms <ArrowRight size={18} strokeWidth={3}/></Link>
            <Link to="/algorithms/bubble-sort" className="brutal-btn !rounded-full bg-white px-6 py-3.5"><Play size={16} strokeWidth={3}/> Try Bubble Sort</Link>
          </div>
          <div className="flex gap-3 pt-1">
            {[
              {k:"5", l:"Sorting"},
              {k:"1", l:"Searching"},
              {k:"∞", l:"Fun"},
            ].map(s=>(
              <div key={s.l} className="brutal-card !rounded-xl px-4 py-2.5 flex items-center gap-2 !shadow-brutal-sm">
                <span className="font-black text-xl leading-none">{s.k}</span><span className="text-xs font-bold text-black/60">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 bg-brutalYellow border-[2.5px] border-black rounded-[1.6rem] rotate-[1deg] shadow-brutal" />
          <div className="relative brutal-card p-6 md:p-7 !bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="font-black text-black flex items-center gap-2"><span className="w-3 h-3 bg-brutalPink border-[2px] border-black rounded-full"/> BUBBLE SORT — LIVE</div>
              <span className="brutal-badge bg-brutalLime">EASY</span>
            </div>
            <MiniBars />
            <div className="mt-5 p-3 rounded-xl bg-brutalYellow border-[2.5px] border-black shadow-brutal-sm text-sm font-bold">💬 "8 bhai, thoda side ho jao. Chhota banda pehle jayega." 😂</div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                {k:"TIME", v:"O(n²)"},
                {k:"SPACE", v:"O(1)"},
                {k:"STABLE", v:"✓ Yes", c:"bg-brutalLime"},
              ].map(x=>(
                <div key={x.k} className={`rounded-xl border-[2.5px] border-black p-3 shadow-brutal-sm font-black ${x.c||"bg-white"}`}><div className="text-[10px] tracking-widest text-black/50">{x.k}</div><div className="font-mono font-black text-black">{x.v}</div></div>
              ))}
            </div>
            {/* sticker */}
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-brutalPink border-[2.5px] border-black rounded-full grid place-items-center shadow-brutal-sm rotate-[12deg] font-black text-xl">★</div>
          </div>
        </div>
      </section>

      {/* How it works - brutal grid */}
      <section className="brutal-card p-2 md:p-3 !bg-brutalYellow">
        <div className="grid md:grid-cols-4 gap-3">
          {[
            {icon:Layers, title:"CHOOSE", desc:"Pick any algorithm", color:"bg-white"},
            {icon:Play, title:"VISUALIZE", desc:"Every compare live", color:"bg-brutalPink"},
            {icon:Cpu, title:"CODE SYNC", desc:"Line highlights", color:"bg-brutalCyan"},
            {icon:Lightbulb, title:"UNDERSTAND", desc:"Complexity & quiz", color:"bg-brutalLime"},
          ].map((s,idx)=>(
            <div key={idx} className={`rounded-2xl border-[2.5px] border-black p-5 flex gap-3 shadow-brutal-sm ${s.color}`}>
              <div className="w-11 h-11 rounded-xl bg-black text-white grid place-items-center shrink-0 border-[2px] border-black"><s.icon size={18} /></div>
              <div><div className="font-black text-black text-sm tracking-wide">0{idx+1} — {s.title}</div><div className="text-sm font-bold text-black/60">{s.desc}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="py-10">
        <div className="flex items-end justify-between mb-6 gap-4">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2"><Asterisk className="text-brutalPink fill-brutalPink" /> FEATURED</h2>
          <Link to="/explorer" className="brutal-btn !py-2 !px-4">View all <ArrowRight size={14} strokeWidth={3}/></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {featured.map(a=> <AlgorithmCard key={a.id} algo={a} />)}
        </div>
      </section>

      <div className="h-2" />
    </div>
  );
}
