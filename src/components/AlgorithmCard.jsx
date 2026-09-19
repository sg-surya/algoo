import { Link } from "react-router-dom";

const dot = {
  Easy: "bg-brutalLime",
  Medium: "bg-brutalYellow",
  Hard: "bg-brutalPink",
};

export default function AlgorithmCard({ algo }){
  return (
    <Link to={`/algorithms/${algo.id}`} className="group brutal-card p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition-transform">
      <div className="flex items-center gap-2 text-xs font-bold text-black/50">
        <span className={`w-2.5 h-2.5 rounded-full border border-black ${dot[algo.difficulty]||dot.Easy}`} />
        {algo.difficulty}
        <span className="ml-auto font-mono">{algo.time}</span>
      </div>
      <h3 className="font-black text-[17px] leading-tight group-hover:underline underline-offset-4">{algo.name}</h3>
      <p className="text-[13px] text-black/55 font-medium leading-snug line-clamp-1">"{algo.personality}"</p>
    </Link>
  );
}
