import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
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
    },900);
    return ()=>clearInterval(id);
  },[]);
  return (
    <div className="flex items-end gap-2 h-28 justify-center" aria-hidden>
      {arr.map((v,idx)=>(
        <div key={idx} className={`w-10 rounded-t-lg flex items-end justify-center pb-1.5 text-xs font-black border-[2px] border-black ${idx===i || idx===i+1 ? "bg-brutalYellow" : "bg-white"}`} style={{height: `${24+v*10}px`}}>{v}</div>
      ))}
    </div>
  );
}

export default function Home(){
  const featured = algorithms.slice(0,3);
  return (
    <div className="max-w-[1080px] mx-auto px-4 md:px-6">
      {/* Hero — clean, single message */}
      <section className="grid md:grid-cols-2 gap-10 py-12 md:py-16 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-full bg-white border-[2px] border-black">
            <span className="w-2 h-2 rounded-full bg-brutalLime border border-black" /> {algorithms.length} ALGORITHMS · LIVE
          </div>
          <h1 className="text-[38px] md:text-[52px] font-black leading-[1.02] tracking-tight text-black">
            Stop memorizing.<br/>
            Start <span className="bg-brutalYellow border-[2.5px] border-black px-2">watching.</span>
          </h1>
          <p className="text-black/60 font-medium max-w-md text-[15px]">Sorting, searching, graphs aur trees — har step animation + code ke saath. Textbook nahi, visual learning.</p>
          <div className="flex items-center gap-4 pt-1">
            <Link to="/explorer" className="brutal-btn-dark !rounded-full px-7 py-3 text-base">Explore <ArrowRight size={17} strokeWidth={3}/></Link>
            <Link to="/algorithms/bubble-sort" className="text-sm font-black underline underline-offset-4 decoration-[2.5px]">Try Bubble Sort</Link>
          </div>
          <p className="text-xs font-bold text-black/40">No signup · Free · Hinglish commentary</p>
        </div>

        {/* Demo — single quiet card */}
        <div className="brutal-card p-6 !bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-black tracking-widest text-black/50">LIVE DEMO</div>
            <span className="brutal-badge bg-brutalLime !text-[10px]">EASY</span>
          </div>
          <MiniBars />
          <p className="mt-4 text-sm font-bold text-center">"8 bhai, side ho jao. Chhota pehle jayega." 😂</p>
          <Link to="/algorithms/bubble-sort" className="mt-4 flex items-center justify-center gap-1 text-sm font-black py-2.5 rounded-xl bg-black text-white"><Play size={14}/> Open visualizer</Link>
        </div>
      </section>

      {/* Steps — plain text, no rainbow cards */}
      <section className="border-t-[2px] border-black/10 py-8 grid md:grid-cols-3 gap-6">
        {[
          ["01","Choose","Explorer se algorithm pick karo."],
          ["02","Play","Compare, swap, partition live dekho."],
          ["03","Understand","Code + complexity saath me samjho."],
        ].map(([n,t,d])=>(
          <div key={n} className="flex gap-3">
            <span className="font-black text-2xl text-black/15">{n}</span>
            <div><div className="font-black text-sm">{t}</div><div className="text-sm text-black/55 font-medium">{d}</div></div>
          </div>
        ))}
      </section>

      {/* Featured — 3 cards only */}
      <section className="py-8">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl font-black">Start with these</h2>
          <Link to="/explorer" className="text-sm font-black underline underline-offset-4">View all {algorithms.length} →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {featured.map(a=> <AlgorithmCard key={a.id} algo={a} />)}
        </div>
      </section>

      {/* Single CTA */}
      <section className="mb-10 rounded-2xl bg-black text-white p-8 md:p-10 text-center border-[2.5px] border-black">
        <h2 className="text-2xl md:text-3xl font-black">Dekh ke samjho, ratta nahi.</h2>
        <p className="text-white/60 text-sm font-medium mt-2">Play dabao. Scrub karo. Apna data daalo.</p>
        <Link to="/explorer" className="inline-flex items-center gap-2 mt-5 px-7 py-3 rounded-full bg-brutalYellow text-black font-black border-[2px] border-brutalYellow">Explore Algorithms <ArrowRight size={16} strokeWidth={3}/></Link>
      </section>
    </div>
  );
}
