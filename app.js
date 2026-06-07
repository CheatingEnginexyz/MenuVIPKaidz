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
    for(let i=0;i<n;i++){
      particles.push({x:Math.random()*W,y:Math.random()*H,vx:rand(-conf.maxSpeed,conf.maxSpeed),vy:rand(-conf.maxSpeed,conf.maxSpeed),r:rand(conf.size[0],conf.size[1])*dpr});
    }
  }
  function step(){
    ctx.clearRect(0,0,W,H);
    for(const p of particles){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
      const dx=p.x-cursor.x, dy=p.y-cursor.y, dd=dx*dx+dy*dy;
      if(dd<19600*dpr*dpr){const ax=-.0008*dx; p.vx+=ax*dx; p.vy+=ax*dy;}
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,2*Math.PI); ctx.fillStyle="rgba(255,255,255,0.6)"; ctx.fill();
    }
    for(let i=0;i<particles.length;i++){
      const a=particles[i];
      for(let j=i+1;j<particles.length;j++){
        const b=particles[j], dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
        if(d<conf.linkDist*dpr){
          const alpha=(1-d/(conf.linkDist*dpr))*conf.linkAlpha;
          ctx.strokeStyle=`rgba(124,242,211,${alpha})`; ctx.lineWidth=.7*dpr;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    raf=requestAnimationFrame(step);
  }
  function move(e){
    if(e.touches&&e.touches[0]){cursor.x=e.touches[0].clientX*dpr; cursor.y=e.touches[0].clientY*dpr;}
    else{cursor.x=(e.clientX??-9999)*dpr; cursor.y=(e.clientY??-9999)*dpr;}
  }
  function leave(){cursor.x=cursor.y=-9999}

  window.addEventListener("resize",resize,{passive:true});
  window.addEventListener("mousemove",move,{passive:true});
  window.addEventListener("touchmove",move,{passive:true});
  window.addEventListener("mouseleave",leave,{passive:true});
  resize(); cancelAnimationFrame(raf); raf=requestAnimationFrame(step);
})();

document.addEventListener("DOMContentLoaded",function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  const configToggle=$("#config-toggle"), luxToggle=$("#lux-toggle"), modeSelect=$("#mode-select"), dpiSelect=$("#dpi-select"), activateBtn=$("#activate-btn");
  const fixRungToggle=$("#fix-rung-toggle"), nheTamToggle=$("#nhe-tam-toggle"), lockDauToggle=$("#lock-dau-toggle");
  const announce=$("#announce-bar"), announceClose=$("#announce-close");
  const menuBtn=$("#special-menu-btn"), menu=$("#special-menu"), backdrop=$("#modal-backdrop"), menuClose=$("#modal-close"), info=$("#modal-infobox"), infoClose=$("#infobox-close"), applyBtn=$("#modal-apply");
  const f1=$("#f-anti-shake"), f2=$("#f-aim-assist"), f3=$("#f-touch-boost"), f4=$("#f-pro-mode");
  const notice=$("#site-notice"), noticeList=$("#notice-list"), nOk=$("#notice-ok"), n3h=$("#notice-3h"), nBackdrop=$("#notice-backdrop");

  const store={
    get(k,def){try{const v=localStorage.getItem(k);return v===null?def:JSON.parse(v)}catch(e){return def}},
    set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  };

  function toast(msg){
    let el=document.querySelector(".toast");
    if(!el){el=document.createElement("div");el.className="toast";el.setAttribute("role","status");el.setAttribute("aria-live","polite");document.body.appendChild(el)}
    el.textContent=msg; el.classList.add("show"); clearTimeout(toast._t); toast._t=setTimeout(()=>el.classList.remove("show"),2200);
  }
  function pulse(el){el&&el.animate([{transform:"scale(1)"},{transform:"scale(1.03)"},{transform:"scale(1)"}],{duration:260,easing:"ease-out"})}

  function reflect(){
    $$(".toggle-switch").forEach(sw=>{
      const input=sw.querySelector(".toggle-input"), item=sw.closest(".function-item");
      if(!input||!item) return;
      item.dataset.state=input.checked?"on":"off";
      item.style.borderColor=input.checked?"rgba(34,197,94,.6)":"rgba(255,255,255,.06)";
    });
  }
  function applyMode(v){document.body.dataset.mode=v}
  function applyDpi(v){document.body.dataset.dpi=v}
  function label(v){if(v==="muot-ma")return"Mượt Mà"; if(v==="cao-cap")return"Cao Cấp"; if(v==="tieu-chuan")return"Tiêu Chuẩn"; return v}

  function restore(){
    const ce=store.get("config-enabled",false), le=store.get("lux-enabled",false), m=store.get("mode","muot-ma"), d=store.get("dpi","1.0");
    const fr=store.get("fix-rung-enabled",false), nt=store.get("nhe-tam-enabled",false), ld=store.get("lock-dau-enabled",false);
    if(configToggle) configToggle.checked=!!ce;
    if(luxToggle) luxToggle.checked=!!le;
    if(fixRungToggle) fixRungToggle.checked=!!fr;
    if(nheTamToggle) nheTamToggle.checked=!!nt;
    if(lockDauToggle) lockDauToggle.checked=!!ld;
    if(modeSelect) modeSelect.value=m;
    if(dpiSelect) dpiSelect.value=d;
    applyMode(m); applyDpi(d); reflect();
    const a1=store.get("feat-anti-shake",false),a2=store.get("feat-aim-assist",false),a3=store.get("feat-touch-boost",false),a4=store.get("feat-pro-mode",false);
    if(f1) f1.checked=!!a1; if(f2) f2.checked=!!a2; if(f3) f3.checked=!!a3; if(f4) f4.checked=!!a4;
  }

  function showBar(){announce&&announce.classList.remove("hidden")}
  function hideBar(){announce&&announce.classList.add("hidden"); store.set("announcement-dismissed",true)}

  function openNotice(){notice.classList.remove("hidden"); notice.setAttribute("aria-hidden","false")}
  function closeNotice(){notice.classList.add("hidden"); notice.setAttribute("aria-hidden","true")}
  function closeNotice3h(){store.set("notice-until",Date.now()+3*60*60*1000); closeNotice()}
  function maybeShowNotice(){const until=store.get("notice-until",0); if(Date.now()>Number(until)) openNotice()}

  function openMenu(){menu&&menu.classList.remove("hidden"); menu&&menu.setAttribute("aria-hidden","false"); toast("SUPPORT TECH ĐÃ MỞ")}
  function closeMenu(){menu&&menu.classList.add("hidden"); menu&&menu.setAttribute("aria-hidden","true")}
  function hideInfo(){info&&info.classList.add("hidden")}

  if(configToggle) configToggle.addEventListener("change",()=>{store.set("config-enabled",configToggle.checked); reflect(); toast(configToggle.checked?"AIMLOCK : ON":"AIMLOCK : OFF")});
  if(luxToggle)    luxToggle.addEventListener("change",()=>{store.set("lux-enabled",luxToggle.checked); reflect(); toast(luxToggle.checked?"FEATHER AIM : ON":"FEATHER AIM : OFF")});
  if(fixRungToggle) fixRungToggle.addEventListener("change",()=>{store.set("fix-rung-enabled",fixRungToggle.checked); reflect(); toast(fixRungToggle.checked?"STEADY HOLD : ON":"STEADY HOLD : OFF")});
  if(nheTamToggle) nheTamToggle.addEventListener("change",()=>{store.set("nhe-tam-enabled",nheTamToggle.checked); reflect(); toast(nheTamToggle.checked?"ANCHOER AIM : ON":"ANCHOER AIM : OFF")});
  if(lockDauToggle) lockDauToggle.addEventListener("change",()=>{store.set("lock-dau-enabled",lockDauToggle.checked); reflect(); toast(lockDauToggle.checked?"DRIFT FIX : ON":"DRIFT FIX : OFF")});
  $$(".toggle-input").forEach(input=>{input.addEventListener("change",reflect)});
  if(modeSelect)   modeSelect.addEventListener("change",()=>{store.set("mode",modeSelect.value); applyMode(modeSelect.value); toast("Chế Độ : "+label(modeSelect.value))});
  if(dpiSelect)    dpiSelect.addEventListener("change",()=>{store.set("dpi",dpiSelect.value); applyDpi(dpiSelect.value); toast("DPI PANEL IOS : "+dpiSelect.value+"x")});
  if(activateBtn)  activateBtn.addEventListener("click",()=>{toast("PANEL IOS ON"); pulse(activateBtn)});

  if(announceClose) announceClose.addEventListener("click",hideBar);
  if(menuBtn)       menuBtn.addEventListener("click",openMenu);
  if(backdrop)      backdrop.addEventListener("click",closeMenu);
  if(menuClose)     menuClose.addEventListener("click",closeMenu);
  if(infoClose)     infoClose.addEventListener("click",hideInfo);
  if(applyBtn)      applyBtn.addEventListener("click",()=>{store.set("feat-anti-shake",!!f1&&f1.checked);store.set("feat-aim-assist",!!f2&&f2.checked);store.set("feat-touch-boost",!!f3&&f3.checked);store.set("feat-pro-mode",!!f4&&f4.checked); toast("Đã Áp Dụng Tinh Chỉnh Support Tech"); closeMenu()});

  if(nOk)      nOk.addEventListener("click",closeNotice);
  if(n3h)      n3h.addEventListener("click",closeNotice3h);
  if(nBackdrop)nBackdrop.addEventListener("click",closeNotice);

  if(!store.get("announcement-dismissed",false)) showBar();
  restore(); maybeShowNotice();
});

(function(){
  const $=(id)=>document.getElementById(id);
  const consoleEl=$("cm-console");
  const cpuCanvas=$("cm-cpu-canvas");
  const ramCanvas=$("cm-ram-canvas");
  if(!consoleEl||!cpuCanvas||!ramCanvas) return;
  const cpuCtx=cpuCanvas.getContext("2d");
  const ramCtx=ramCanvas.getContext("2d");
  $("cm-ram-src").textContent="Auto";

  function nowTime(){const d=new Date();return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`}
  function log(msg,level="t"){
    const line=document.createElement("div");line.className="cm-logline cm-"+level;
    const time=document.createElement("span");time.className="cm-time";time.textContent=`[${nowTime()}] `;
    const text=document.createElement("span");text.className="cm-msg";text.textContent=msg;
    line.appendChild(time);line.appendChild(text);consoleEl.appendChild(line);consoleEl.scrollTop=consoleEl.scrollHeight;
  }

  function drawWave(ctx,series,colorStroke,labelY){
    const w=ctx.canvas.width, h=ctx.canvas.height;
    ctx.clearRect(0,0,w,h);ctx.fillStyle="rgba(0,0,0,0.18)";ctx.fillRect(0,0,w,h);
    ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=1;ctx.beginPath();
    for(let i=1;i<=5;i++){const y=(h*i)/6;ctx.moveTo(0,y);ctx.lineTo(w,y)}
    for(let i=1;i<=10;i++){const x=(w*i)/11;ctx.moveTo(x,0);ctx.lineTo(x,h)}
    ctx.stroke();ctx.strokeStyle=colorStroke;ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<series.length;i++){const x=(w*i)/(series.length-1),y=h-(series[i]*(h-10))-5;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
    ctx.stroke();ctx.fillStyle="rgba(255,255,255,0.85)";ctx.font="bold 12px monospace";ctx.fillText(labelY,10,18);
  }

  const N=180;const cpuSeries=Array(N).fill(0);const ramSeries=Array(N).fill(0);
  let lastFrame=performance.now(),fps=0,fpsSMA=0,frameCount=0,fpsWindowStart=performance.now();

  function loop(t){
    const delta=t-lastFrame;lastFrame=t;frameCount++;
    const elapsed=t-fpsWindowStart;
    if(elapsed>=500){fps=(frameCount*1000)/elapsed;fpsWindowStart=t;frameCount=0;fpsSMA=fpsSMA?(fpsSMA*0.7+fps*0.3):fps;$("cm-fps-now").textContent=fpsSMA.toFixed(1)}
    if(t-(lastFrame||t)>=50){
      const tSec=t/1000;
      let cpuLoad=0.1+0.05*Math.sin(tSec*2)+0.03*Math.cos(tSec*5);
      cpuSeries.push(cpuLoad);cpuSeries.shift();
      let ramV=0.4+0.1*Math.sin(tSec*1.5);
      ramSeries.push(ramV);ramSeries.shift();
      $("cm-cpu-text").textContent=`${(cpuLoad*100).toFixed(0)}%`;
      $("cm-ram-text").textContent=`${(ramV*100).toFixed(0)}%`;
      drawWave(cpuCtx,cpuSeries,"rgba(85,255,176,0.95)","CPU Wave");
      drawWave(ramCtx,ramSeries,"rgba(106,166,255,0.95)","RAM Wave");
    }
    requestAnimationFrame(loop);
  }
  log("Khởi động monitor.","t");
  requestAnimationFrame(loop);
})();
