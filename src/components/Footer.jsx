export default function Footer(){
  return (
    <footer className="border-t-[2.5px] border-black mt-8 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm font-black">
        <div className="flex flex-wrap items-center gap-2">
          <span>© 2026 ALGOVERSE — BUILT WITH ❤️ FOR DSA LEARNERS</span>
          <span className="hidden md:inline">•</span>
          <a href="https://vasudevai.in" target="_blank" rel="noopener noreferrer" className="underline decoration-[3px] underline-offset-4 decoration-brutalYellow hover:bg-brutalYellow px-1 border border-transparent hover:border-black rounded">vasudevai.in</a>
        </div>
        <div className="flex items-center gap-2">
          <span className="brutal-badge bg-black text-white">ALGORITHMS, BUT MAKE THEM CLICK.</span>
          <a href="https://vasudevai.in" target="_blank" className="brutal-badge bg-brutalYellow hover:brightness-95">VISIT VASUDEVAI.IN →</a>
        </div>
      </div>
    </footer>
  );
}
