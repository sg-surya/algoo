import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { algorithms } from "../data/algorithms";
import AlgorithmCard from "../components/AlgorithmCard";
import { Search } from "lucide-react";

const categories = ["All","Sorting","Searching","Graphs","Trees"];

export default function Explorer(){
  const [params]=useSearchParams();
  const [search,setSearch]=useState(params.get("search")||"");
  const [cat,setCat]=useState("All");

  const filtered = useMemo(()=>{
    return algorithms.filter(a=>{
      const mSearch = !search || a.name.toLowerCase().includes(search.toLowerCase());
      const mCat = cat==="All" || a.category===cat;
      return mSearch && mCat;
    });
  },[search,cat]);

  const countFor = (c)=> c==="All" ? algorithms.length : algorithms.filter(a=>a.category===c).length;

  return (
    <div className="max-w-[1080px] mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-black tracking-tight">Explorer</h1>
      <p className="text-sm text-black/55 font-medium mt-1">Pick one. Play. Samjho.</p>

      <div className="mt-5 relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search — bubble, heap, bfs…" className="w-full brutal-input pl-10 !rounded-full" />
      </div>

      <div className="mt-4 flex gap-1.5 flex-wrap">
        {categories.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-4 py-1.5 rounded-full text-sm font-black border-[2px] border-black ${cat===c ? "bg-black text-white" : "bg-white"}`}>
            {c} <span className="opacity-50 font-bold text-xs">{countFor(c)}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(a=> <AlgorithmCard key={a.id} algo={a} />)}
      </div>
      {filtered.length===0 && <div className="text-center py-14 text-sm font-bold text-black/40">Kuch nahi mila — search badlo.</div>}
      <p className="mt-6 text-xs font-bold text-black/35">{filtered.length} shown</p>
    </div>
  );
}
