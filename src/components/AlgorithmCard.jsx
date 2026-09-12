import { Link } from "react-router-dom";
import { Clock, Layers, ArrowRight } from "lucide-react";

const diffStyle = {
  Easy: "bg-brutalLime text-black",
  Medium: "bg-brutalYellow text-black",
  Hard: "bg-brutalPink text-black",
};

export default function AlgorithmCard({ algo }){
  return (
    <Link to={`/algorithms/${algo.id}`} className="group brutal-card p-5 flex flex-col gap-3 hover:shadow-brutal-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
      <div className="flex items-start justify-between">
        <div className={`brutal-badge ${diffStyle[algo.difficulty]||diffStyle.Easy}`}>{algo.difficulty.toUpperCase()}</div>
        <span className="text-xs font-bold flex items-center gap-1 border-[2px] border-black rounded-full px-2 py-1 bg-white"><Clock size={12}/> {algo.time}</span>
      </div>
      <div>
        <h3 className="font-black text-lg leading-tight text-black group-hover:underline decoration-[3px] underline-offset-2">{algo.name}</h3>
        <p className="text-xs font-bold text-black/60 italic mt-1">"{algo.personality}"</p>
        <p className="text-sm text-black/70 mt-3 leading-snug line-clamp-2 font-medium">{algo.description}</p>
      </div>
      <div className="flex items-center gap-2 text-xs font-bold mt-auto pt-3 border-t-[2px] border-black/10">
        <span className="flex items-center gap-1.5 bg-black text-white px-2.5 py-1 rounded-full text-[11px] tracking-wide"><Layers size={12}/> {algo.category.toUpperCase()}</span>
        <span className="ml-auto flex items-center gap-1 font-black group-hover:gap-2 transition-all">EXPLORE <ArrowRight size={14} strokeWidth={3}/></span>
      </div>
    </Link>
  );
}
