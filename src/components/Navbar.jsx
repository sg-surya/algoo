import { Link, useNavigate } from "react-router-dom";
import { Search, GitBranch, Zap, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar(){
  const [q,setQ]=useState("");
  const [open,setOpen]=useState(false);
  const nav=useNavigate();
  const submit=(e)=>{
    e.preventDefault();
    if(q.trim()) nav(`/explorer?search=${encodeURIComponent(q)}`);
  };
  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF0] border-b-[2.5px] border-black">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-[68px] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-black border-[2px] border-black flex items-center justify-center shadow-brutal-sm rotate-[-2deg]">
            <Zap size={18} className="text-brutalYellow fill-brutalYellow" />
          </div>
          <div>
            <div className="font-black tracking-tight text-black text-[18px] leading-none">ALGOVERSE</div>
            <div className="text-[11px] font-bold tracking-[0.12em] text-black/60 -mt-0.5">ALGORITHMS, BUT MAKE THEM CLICK.</div>
          </div>
        </Link>

        <form onSubmit={submit} className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/50" />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search algorithms..." className="w-full brutal-input pl-10 pr-4 !py-2.5 !rounded-full bg-white shadow-brutal-sm" />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-3">
          <Link to="/explorer" className="brutal-btn-dark !rounded-full px-6">Explore →</Link>
          <a href="https://github.com" target="_blank" className="w-10 h-10 rounded-full bg-white border-[2.5px] border-black shadow-brutal-sm grid place-items-center hover:translate-y-[-1px] transition"><GitBranch size={16} className="text-black" /></a>
        </nav>

        <button onClick={()=>setOpen(!open)} className="md:hidden w-10 h-10 grid place-items-center rounded-xl bg-white border-[2.5px] border-black shadow-brutal-sm">
          {open ? <X size={18}/> : <Menu size={18}/>}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3 border-t-[2.5px] border-black bg-brutalYellow">
          <form onSubmit={submit} className="pt-4 flex gap-2">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="flex-1 brutal-input" />
            <button className="brutal-btn-dark px-6">Go</button>
          </form>
          <Link to="/explorer" onClick={()=>setOpen(false)} className="block text-center py-3 bg-black text-white rounded-xl font-black border-[2.5px] border-black">Explore Algorithms</Link>
        </div>
      )}
    </header>
  );
}
