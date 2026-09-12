let ctx = null;
function getCtx(){
  if(typeof window==="undefined") return null;
  if(!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if(ctx.state==="suspended") ctx.resume();
  return ctx;
}

function tone(freq, duration, type="sine", gain=0.12, slideTo=null){
  const c = getCtx();
  if(!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  if(slideTo){
    osc.frequency.linearRampToValueAtTime(slideTo, c.currentTime + duration*0.9);
  }
  g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(g); g.connect(c.destination);
  osc.start(); osc.stop(c.currentTime + duration);
}

export function playSound(type){
  // keep it subtle, neo-brutal pop sounds
  switch(type){
    case "compare": // tick - yellow
      tone(620, 0.09, "sine", 0.10);
      break;
    case "swap": // pop - pink
      tone(440, 0.13, "square", 0.11, 660);
      break;
    case "swap_done":
      tone(520, 0.10, "triangle", 0.09);
      break;
    case "shift":
      tone(380, 0.11, "sine", 0.09, 480);
      break;
    case "mark_sorted": // chime - lime
      tone(880, 0.25, "sine", 0.13);
      setTimeout(()=> tone(1100, 0.18, "sine", 0.08), 80);
      break;
    case "pick_pivot":
      tone(300, 0.18, "triangle", 0.11, 500);
      break;
    case "done": // fanfare
      tone(600, 0.14, "sine", 0.12);
      setTimeout(()=> tone(750, 0.14, "sine", 0.12), 120);
      setTimeout(()=> tone(900, 0.30, "sine", 0.13), 240);
      break;
    case "no_swap":
      tone(320, 0.07, "sine", 0.06);
      break;
    default:
      tone(500, 0.08, "sine", 0.07);
  }
}

export function playForStep(step){
  if(!step) return;
  playSound(step.type);
}
