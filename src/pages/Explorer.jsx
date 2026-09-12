import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { algorithms } from "../data/algorithms";
import AlgorithmCard from "../components/AlgorithmCard";
import { Search, SlidersHorizontal } from "lucide-react";

const categories = ["All","Sorting","Searching","Graphs"];

export default function Explorer(){
  const [params]=useSearchParams();
  const initialSearch = params.get("search")||"";
  const [search,setSearch]=useState(initialSearch);
  const [cat,setCat]=useState("All");
  const [diff,setDiff]=useState("All");

  const filtered = useMemo(()=>{
    return algorithms.filter(a=>{
      const mSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
      const mCat = cat==="All" || a.category===cat;
      const mDiff = diff==="All" || a.difficulty===diff;
      return mSearch && mCat && mDiff;
    });
  },[search,cat,diff]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">ALGORITHM EXPLORER</h1>
          <p className="font-bold text-black/60">Pick an algorithm, watch it think, read the code.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/50"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search bubble, quick..." className="w-full brutal-input pl-10 !shadow-brutal-sm !rounded-full" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <div className="flex items-center gap-2 text-xs font-black"><SlidersHorizontal size={14}/> FILTERS:</div>
        {categories.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full text-sm font-black border-[2.5px] border-black shadow-brutal-sm ${cat===c ? "bg-black text-white" : "bg-white text-black hover:bg-brutalYellow"}`}>{c.toUpperCase()}</button>
        ))}
        <div className="w-px h-6 bg-black mx-1 hidden md:block" />
        {["All","Easy","Medium"].map(d=>(
          <button key={d} onClick={()=>setDiff(d)} className={`px-3 py-2 rounded-full text-xs font-black border-[2px] border-black ${diff===d ? "bg-brutalYellow shadow-brutal-sm" : "bg-white"}`}>{d.toUpperCase()}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map(a=> <AlgorithmCard key={a.id} algo={a} />)}
      </div>
      {filtered.length===0 && <div className="text-center py-16 font-black border-[2.5px] border-black border-dashed rounded-2xl mt-6">No algorithms found for "{search}"</div>}

      <div className="mt-8 brutal-card p-4 flex flex-wrap gap-2 items-center">
        <span className="text-sm font-black mr-2">QUICK JUMP:</span>
        {algorithms.map(a=> <Link key={a.id} to={`/algorithms/${a.id}`} className="text-xs font-black px-3 py-2 rounded-full bg-white border-[2.5px] border-black shadow-brutal-sm hover:bg-brutalYellow">{a.name.toUpperCase()}</Link>)}
      </div>
    </div>
  );
}
