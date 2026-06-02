/* ================================================================
   helpers.js  ← HELPERS SVG Y ESTADO GLOBAL
   Contiene: $ (getElementById), estado global (cur, mode, selId),
   Rolando HTML, updateRolandoDisplay, pulseReveal, startRewind,
   advanceRolando, resetRolando, markup, emoFS, TS, svgNode, svgEdge.
   Cargar ANTES de app.js
   ================================================================ */
/* § JS-HELPERS ─── SVG, render parcial, lógica de diagrama ── */
const $=id=>document.getElementById(id);
let cur=0, mode='both', selId=null;
let rewindArrival=false, rolandoBeat=0, rolandoTimer=null, rolandoInterval=null, rolandoInit=false;
let elenaBeat=0;

let ROLANDO_HTML=`
<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:0;padding:1rem 0;width:100%;max-width:500px;margin:0 auto">
  <div style="font-size:15px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:rgba(239,68,68,.5);margin-bottom:2rem">Lunes · 07:30</div>
  <div style="width:40px;height:1px;background:rgba(239,68,68,.35);margin-bottom:2rem"></div>
  <div style="font-size:22px;color:rgba(255,255,255,.62);line-height:1.85;font-weight:300;margin-bottom:2.5rem">
    Hay dos camiones en el pasillo de carga. Esperaba uno.<br>
    No hay nota. No hay correo. No hay contexto.<br>
    Solo una decisión antes de que el frío se rompa.
  </div>
  <div style="font-family:'Poppins',sans-serif;font-size:26px;font-weight:700;color:#ef4444;letter-spacing:-.01em;margin-bottom:.75rem">Rechaza el segundo despacho.</div>
  <div style="font-size:18px;color:rgba(255,255,255,.32);font-weight:300;letter-spacing:.04em">El martes, cien personas sin churrasco.</div>
  <div style="margin-top:2.5rem;font-size:17px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:rgba(239,68,68,.45)">⏪ Volvamos al jueves · 16:40</div>
</div>`;

function updateRolandoDisplay(){
  const narr=$('narr-text'), pause=$('ch9-pause'), fairy=$('ch9-fairy'), atm=$('atm-text'), atmr=$('atm-rule');
  if(atm){atm.style.display='none';} if(atmr){atmr.style.display='none';}
  if(narr){
    narr.innerHTML=ROLANDO_HTML;
    narr.style.visibility='';
    narr.style.transition=rolandoBeat>=1?'opacity .6s ease':'none';
    narr.style.opacity=rolandoBeat>=1?'1':'0';
  }
  if(pause) pause.className=rolandoBeat>=2?'visible':'';
  if(fairy){
    if(rolandoBeat>=3 && fairy.className!=='visible'){
      fairy.className='visible';
      clearTimeout(rolandoTimer);
      rolandoTimer=setTimeout(startRewind,1600);
    } else if(rolandoBeat<3){
      fairy.className='';
    }
  }
}

// Estado del beat de ch10 después del rewind
let ch10Beat=0;

function pulseReveal(){
  const gl=document.getElementById('rewind-glitch');
  if(gl) gl.classList.remove('active');

  const cs=document.getElementById('ch10-slide');
  if(cs) cs.classList.remove('ch10-active');

  // Vista díptico desde el inicio
  setMode('both');
  ch10Beat=0;

  // Ocultar TODO: panel izquierdo y panel derecho
  const toHide=['emo-word','atm-rule','atm-text','narr-text','lch-label','l-oc-quote','ch9-pause','ch9-fairy'];
  toHide.forEach(id=>{const el=$(id);if(el){el.style.transition='none';el.style.opacity='0';}});

  // Ocultar panel derecho completo
  const rp=$('r-text-wrap');
  if(rp){rp.style.transition='none';rp.style.opacity='0';}

  // Mostrar solo la cuenta regresiva en el panel izquierdo
  const lti=document.getElementById('l-time-info');
  if(lti){lti.style.display='flex';lti.style.opacity='1';}

  // Cuenta regresiva: 23:30 → 16:40
  const steps=[];
  for(let m=23*60+30; m>=16*60+40; m-=10) steps.push(m);
  let step=0;

  function fmt(mins){
    const h=Math.floor(mins/60);
    const m=mins%60;
    return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
  }

  function tick(){
    const elH=document.getElementById('l-time-hora');
    if(elH) elH.textContent=fmt(steps[step]);
    step++;
    if(step<steps.length){
      const delay=Math.max(55, 520-step*28);
      rolandoTimer=setTimeout(tick, delay);
    }
    // Cuando termina la cuenta, se detiene — el usuario avanza con Siguiente
  }

  rolandoTimer=setTimeout(tick, 400);
}

function startRewind(){
  clearTimeout(rolandoTimer); clearInterval(rolandoInterval);
  const gl=document.getElementById('rewind-glitch');
  if(gl) gl.classList.add('active');
  const fi=n=>CHAPTERS.findIndex(c=>c.n===n);
  const seq=[
    // Fase lenta — ch8→ch7 × 1000ms
    [fi(8),'both',1000],[fi(8),'right',1000],
    [fi(7),'right',1000],[fi(7),'both',340],
    // Fase media — ch6→ch5 × 340ms
    [fi(6),'right',340],[fi(6),'both',340],
    [fi(5),'right',340],[fi(5),'right',340],
    // Fase rápida
    [fi(4),'both',340],[fi(3),'right',340],[fi(2.5),'both',340],[fi(2),'right',340],[fi(1),'both',340],
    // Pausa ch1 relato
    [fi(1),'left',1000],
    // ch10 destino final
    [fi(10),'both',0]
  ];
  let step=0;
  function doStep(){
    if(step>=seq.length) return;
    const [idx,m,wait]=seq[step];
    cur=idx; setMode(m);
    const isN10=(CHAPTERS[idx]&&CHAPTERS[idx].n===10&&m==='both');
    if(isN10) rewindArrival=true;
    render(isN10?false:true);
    if(isN10) setTimeout(pulseReveal, 50);
    step++;
    if(step<seq.length) rolandoTimer=setTimeout(doStep,wait);
  }
  rolandoTimer=setTimeout(doStep,200);
}

function advanceRolando(){
  const d=CHAPTERS[cur];
  if(!d||d.n!==9) return false;
  if(rolandoBeat>=3){ startRewind(); return true; }
  rolandoBeat++;
  updateRolandoDisplay();
  return true;
}

/* ── Relato Layout (ch1) ─────────────────────────────────────── */




/* ─────────────────────────────────────────────────────────────── */
function resetRolando(){
  rolandoBeat=0;
  clearTimeout(rolandoTimer); clearInterval(rolandoInterval);
  const pause=$('ch9-pause'), fairy=$('ch9-fairy'), atm=$('atm-text'), atmr=$('atm-rule');
  if(pause) pause.className='';
  if(fairy) fairy.className='';
  if(atm) atm.style.display='none';
  if(atmr) atmr.style.display='none';
}
const markup=t=>t?t.replace(/\[\[(.*?)\]\]/g,'<span class="hi">$1</span>'):'';
const emoFS=(w,m)=>{if(m==='left')return '52px';return w.length>30?'20px':w.length>20?'26px':w.length>11?'32px':'38px';};
const TS={left:{atm:'22px',narr:'30px',title:'52px',para:'22px'},both:{atm:'17px',narr:'23px',title:'22px',para:'23px'},right:{atm:'14px',narr:'13px',title:'22px',para:'15px'}};

/* ── SVG helpers ──────────────────────────────────── */
function svgNode(n,sel) {
  const c=NC[n.type]||NC.pipeline,x=n.x-n.w/2,y=n.y-n.h/2,sw=sel?2.5:.7;
  const glow=sel?`<rect x="${x-4}" y="${y-4}" width="${n.w+8}" height="${n.h+8}" rx="12" fill="none" stroke="${c.s}" stroke-width=".8" opacity=".4"/>`:'' ;
  const ty=n.sub?n.y-9:n.y+1;
  return `<g data-id="${n.id}" onclick="selNode('${n.id}')" style="cursor:pointer">
    ${glow}<rect x="${x}" y="${y}" width="${n.w}" height="${n.h}" rx="8" fill="${c.f}" stroke="${c.s}" stroke-width="${sw}"/>
    <text x="${n.x}" y="${ty}" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="12" font-weight="500" fill="${c.t}">${n.label}</text>
    ${n.sub?`<text x="${n.x}" y="${n.y+10}" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="10" fill="${c.u}">${n.sub}</text>`:''}
  </g>`;
}

function svgEdge(fn,tn,l,fm,ts) {
  let x1,y1,x2,y2;
  if(fm==='top'){x1=fn.x;y1=fn.y-fn.h/2} else {x1=fn.x+fn.w/2;y1=fn.y}
  if(ts==='bottom'){x2=tn.x;y2=tn.y+tn.h/2} else {x2=tn.x-tn.w/2;y2=tn.y}
  const dx=x2-x1,dy=y2-y1;
  let d;
  if(Math.abs(dy)<6){d=`M${x1} ${y1} L${x2} ${y2}`}
  else{const cx=x1+dx*.45;d=`M${x1} ${y1} C${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`}
  const lx=(x1+x2)/2,ly=Math.min(y1,y2)-7;
  return `<path d="${d}" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1" marker-end="url(#arw)"/>
    ${l?`<text x="${lx}" y="${ly}" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="9" fill="rgba(255,255,255,.3)">${l}</text>`:''}`;
}

/* § JS-CH1-HTML ── HTML de diagramas personalizados por capítulo
   Para agregar CH2: añadir 'CH2': `<html...>` y custom:'CH2' en datos
   ─────────────────────────────────────────────────────────────── */