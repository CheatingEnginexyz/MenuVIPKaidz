(function(){
  const canvas=document.getElementById("particles-canvas"); if(!canvas) return;
  const ctx=canvas.getContext("2d"), dpr=Math.min(window.devicePixelRatio||1,2);
  let W=0,H=0, particles=[], raf=0, cursor={x:-9999,y:-9999};
  const conf={densityBase:.0001,maxSpeed:.35,size:[1.2,2.4],linkDist:110,linkAlpha:.12};

  function rand(a,b){return a+Math.random()*(b-a)}
  function resize(){
    const w=window.innerWidth, h=window.innerHeight;
    W=canvas.width=Math.floor(w*dpr); H=canvas.height=Math.floor(h*dpr);
    canvas.style.width=w+"px"; canvas.style.height=h+"px";
    const n=Math.floor(W*H*conf.densityBase/(dpr*dpr));
    particles.length=0;
    for(let i=0;i<n;i++) particles.push({x:Math.random()*W,y:Math.random()*H,vx:rand(-conf.maxSpeed,conf.maxSpeed),vy:rand(-conf.maxSpeed,conf.maxSpeed),r:rand(conf.size[0],conf.size[1])*dpr});
  }
  function step(){
    ctx.clearRect(0,0,W,H);
    for(const p of particles){p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W) p.vx*=-1; if(p.y<0||p.y>H) p.vy*=-1; const dx=p.x-cursor.x, dy=p.y-cursor.y, dd=dx*dx+dy*dy; if(dd<19600*dpr*dpr){const ax=-.0008*dx; p.vx+=ax*dx; p.vy+=ax*dy;} ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,2*Math.PI); ctx.fillStyle="rgba(255,255,255,0.6)"; ctx.fill();}
    for(let i=0;i<particles.length;i++){const a=particles[i]; for(let j=i+1;j<particles.length;j++){const b=particles[j], dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy); if(d<conf.linkDist*dpr){const alpha=(1-d/(conf.linkDist*dpr))*conf.linkAlpha; ctx.strokeStyle=`rgba(124,242,211,${alpha})`; ctx.lineWidth=.7*dpr; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();}}}
    raf=requestAnimationFrame(step);
  }
  function move(e){if(e.touches&&e.touches[0]){cursor.x=e.touches[0].clientX*dpr; cursor.y=e.touches[0].clientY*dpr;}else{cursor.x=(e.clientX??-9999)*dpr; cursor.y=(e.clientY??-9999)*dpr;}}
  function leave(){cursor.x=cursor.y=-9999}
  window.addEventListener("resize",resize,{passive:true}); window.addEventListener("mousemove",move,{passive:true}); window.addEventListener("touchmove",move,{passive:true}); window.addEventListener("mouseleave",leave,{passive:true});
  resize(); cancelAnimationFrame(raf); raf=requestAnimationFrame(step);
})();

document.addEventListener("DOMContentLoaded",function(){
  const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
  const store={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
  function toast(msg){let e=document.querySelector(".toast");if(!e){e=document.createElement("div");e.className="toast";e.setAttribute("role","status");document.body.appendChild(e)}e.textContent=msg;e.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(()=>e.classList.remove("show"),2200)}
  function reflect(){$$(".toggle-switch").forEach(sw=>{const i=sw.querySelector(".toggle-input"),it=sw.closest(".function-item");if(!i||!it)return;it.dataset.state=i.checked?"on":"off";it.style.borderColor=i.checked?"rgba(34,197,94,.6)":"rgba(255,255,255,.06)"})}
  function applyMode(v){document.body.dataset.mode=v} function applyDpi(v){document.body.dataset.dpi=v} function label(v){if(v==="muot-ma")return"Mượt Mà";if(v==="cao-cap")return"Cao Cấp";if(v==="tieu-chuan")return"Tiêu Chuẩn";return v}

  const ct=$("#config-toggle"),lt=$("#lux-toggle"),fr=$("#fix-rung-toggle"),nt=$("#nhe-tam-toggle"),ld=$("#lock-dau-toggle"),ms=$("#mode-select"),ds=$("#dpi-select"),ab=$("#activate-btn");
  const f1=$("#f-anti-shake"),f2=$("#f-aim-assist"),f3=$("#f-touch-boost"),f4=$("#f-pro-mode");
  const menu=$("#special-menu"),bd=$("#modal-backdrop"),mc=$("#modal-close"),ic=$("#infobox-close"),ap=$("#modal-apply");
  const notice=$("#site-notice"),nOk=$("#notice-ok"),n3h=$("#notice-3h"),nBack=$("#notice-backdrop");
  const ann=$("#announce-bar"),annClose=$("#announce-close");

  function restore(){if(ct)ct.checked=store.get("config-enabled",false);if(lt)lt.checked=store.get("lux-enabled",false);if(fr)fr.checked=store.get("fix-rung-enabled",false);if(nt)nt.checked=store.get("nhe-tam-enabled",false);if(ld)ld.checked=store.get("lock-dau-enabled",false);if(ms)ms.value=store.get("mode","muot-ma");if(ds)ds.value=store.get("dpi","1.0");if(f1)f1.checked=store.get("feat-anti-shake",false);if(f2)f2.checked=store.get("feat-aim-assist",false);if(f3)f3.checked=store.get("feat-touch-boost",false);if(f4)f4.checked=store.get("feat-pro-mode",false);applyMode(ms?ms.value:"muot-ma");applyDpi(ds?ds.value:"1.0");reflect()}

  if(ct)ct.addEventListener("change",()=>{store.set("config-enabled",ct.checked);reflect();toast(ct.checked?"AIMLOCK ON":"AIMLOCK OFF")});
  if(lt)lt.addEventListener("change",()=>{store.set("lux-enabled",lt.checked);reflect();toast(lt.checked?"FEATHER AIM ON":"FEATHER AIM OFF")});
  if(fr)fr.addEventListener("change",()=>{store.set("fix-rung-enabled",fr.checked);reflect();toast(fr.checked?"STEADY HOLD ON":"STEADY HOLD OFF")});
  if(nt)nt.addEventListener("change",()=>{store.set("nhe-tam-enabled",nt.checked);reflect();toast(nt.checked?"ANCHOR AIM ON":"ANCHOR AIM OFF")});
  if(ld)ld.addEventListener("change",()=>{store.set("lock-dau-enabled",ld.checked);reflect();toast(ld.checked?"DRIFT FIX ON":"DRIFT FIX OFF")});
  if(ms)ms.addEventListener("change",()=>{store.set("mode",ms.value);applyMode(ms.value);toast("Chế độ: "+label(ms.value))});
  if(ds)ds.addEventListener("change",()=>{store.set("dpi",ds.value);applyDpi(ds.value);toast("DPI: "+ds.value+"x")});
  if(ab)ab.addEventListener("click",()=>{toast("SUPER TECH ACTIVATED! 🚀")});

  $("#special-menu-btn").addEventListener("click",()=>{menu.classList.remove("hidden")});
  if(bd)bd.addEventListener("click",()=>menu.classList.add("hidden"));
  if(mc)mc.addEventListener("click",()=>menu.classList.add("hidden"));
  if(ic)ic.addEventListener("click",()=>$("#modal-infobox").classList.add("hidden"));
  if(ap)ap.addEventListener("click",()=>{store.set("feat-anti-shake",!!f1&&f1.checked);store.set("feat-aim-assist",!!f2&&f2.checked);store.set("feat-touch-boost",!!f3&&f3.checked);store.set("feat-pro-mode",!!f4&&f4.checked);toast("ĐÃ ÁP DỤNG");menu.classList.add("hidden")});

  if(nOk)nOk.addEventListener("click",()=>notice.classList.add("hidden"));
  if(n3h)n3h.addEventListener("click",()=>{store.set("notice-until",Date.now()+3*60*60*1000);notice.classList.add("hidden")});
  if(nBack)nBack.addEventListener("click",()=>notice.classList.add("hidden"));
  if(ann&&!store.get("announcement-dismissed",false))ann.style.display="flex";
  if(annClose)annClose.addEventListener("click",()=>{ann.style.display="none";store.set("announcement-dismissed",true)});

  const until=store.get("notice-until",0);if(Date.now()>Number(until))notice.classList.remove("hidden");
  restore();

  // ÂM THANH
  (function(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ctx=new AC(),vol=0.2;function chime(){if(ctx.state==="suspended")ctx.resume();const now=ctx.currentTime;function note(freq,dt,dur){const o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";o.frequency.value=freq;o.connect(g);g.connect(ctx.destination);const t0=now+dt,t1=t0+dur;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.01);g.gain.exponentialRampToValueAtTime(.0001,t1);o.start(t0);o.stop(t1+.02)}note(1568,0,.12);note(1976,.08,.12)}document.querySelectorAll(".toggle-input, .activate-btn, #modal-apply, #special-menu-btn, .cm-btn").forEach(el=>el.addEventListener("click",chime))})();
});

// CPU/RAM MONITOR
(function(){const $=id=>document.getElementById(id);const ce=$("cm-console"),cc=$("cm-cpu-canvas"),rc=$("cm-ram-canvas");if(!ce||!cc||!rc)return;const cx=cc.getContext("2d"),rx=rc.getContext("2d");function now(){const d=new Date();return`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`}function log(m,l="t"){const el=document.createElement("div");el.className="cm-logline cm-"+l;el.innerHTML=`<span class="cm-time">[${now()}] </span><span class="cm-msg">${m}</span>`;ce.appendChild(el);ce.scrollTop=ce.scrollHeight}function drawWave(ctx,series,color,label){const w=ctx.canvas.width,h=ctx.canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle="rgba(0,0,0,.18)";ctx.fillRect(0,0,w,h);ctx.strokeStyle="rgba(255,255,255,.08)";ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<=5;i++){const y=(h*i)/6;ctx.moveTo(0,y);ctx.lineTo(w,y)}ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<series.length;i++){const x=(w*i)/(series.length-1),y=h-(series[i]*(h-10))-5;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();ctx.fillStyle="rgba(255,255,255,.85)";ctx.font="bold 12px monospace";ctx.fillText(label,10,18)}const N=180;const cpuS=Array(N).fill(0),ramS=Array(N).fill(0);let lastT=performance.now();function loop(t){if(t-lastT>=50){lastT=t;const ts=t/1000;cpuS.push(.1+.05*Math.sin(ts*2)+.03*Math.cos(ts*5));cpuS.shift();ramS.push(.4+.1*Math.sin(ts*1.5));ramS.shift();$("cm-cpu-text").textContent=`${(cpuS[cpuS.length-1]*100).toFixed(0)}%`;$("cm-ram-text").textContent=`${(ramS[ramS.length-1]*100).toFixed(0)}%`;drawWave(cx,cpuS,"rgba(85,255,176,.95)","CPU Wave");drawWave(rx,ramS,"rgba(106,166,255,.95)","RAM Wave")}requestAnimationFrame(loop)}log("Khởi động monitor.","t");requestAnimationFrame(loop)})();
