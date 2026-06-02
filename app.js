/* ================================================================
   app.js  ← LÓGICA PRINCIPAL DE LA APLICACIÓN
   Contiene: JOURNEY_DATA, ALL_STEPS, render, setMode, go, hideCover,
   navegación por teclado, beats de relato y técnico, mapa de etapas,
   Journey Panel render, tech mode toggle, selección de nodos.
   Depende de: data-capitulos.js, data-diagramas.js, helpers.js
   ================================================================ */
const STAGES_NEG=['REGISTRO','ENVÍO','FILTRADO','IDENTIFICACIÓN','VALORIZACIÓN','ALERTA','APROBACIÓN','REGISTRO INMUTABLE','PEDIDO RECEPCIONADO'];
const STAGES_TEC=['INGESTA (CDC)','ORQUESTACIÓN','GOBERNANZA (DQ)','RESOLUCIÓN MDM','AGREGACIÓN (Gold)','DISPARO (Event Hub)','DESPACHO EDI','OPTIMIZACIÓN (Delta)'];
const JP_CUM={'1':'3 min 20 s','2':'20 min 20 s','2.5':'25 min 20 s','3':'30 min 20 s','4':'38 min 20 s','5':'38 min 35 s','6':'43 min 35 s','7':'automático','8':'48 meses','9':'—','10':'—'};
const JOURNEY_DATA={
  1:   {snap:{inds:[{v:'T+0s',l:'TIEMPO'},{v:'INSERT',l:'EVENTO'},{v:'On-premise',l:'ZONA'}],    status:'OC-24-0834 confirmada en NuestroERP · esperando extracción'}, active:1, idx:[0,1]},
  2:   {snap:{inds:[{v:'T+8s',l:'TIEMPO'},{v:'SHIR-02',l:'AGENTE'},{v:'En tránsito',l:'ESTADO'}],status:'Delta viajando de NuestrEmpresa a Azure vía HTTPS encriptado'},        active:3, idx:[0,1,2,3]},
  2.5: {snap:{inds:[{v:'T+14min',l:'TIEMPO'},{v:'12/12',l:'REGLAS OK'},{v:'→ Silver',l:'RESULTADO'}],status:'Rechazada R07 → corregida → aprobada'},                    active:5, idx:[0,1,2,3,4,5]},
  3:   {snap:{inds:[{v:'T+14m3s',l:'TIEMPO'},{v:'v1',l:'VERSIÓN SCD'},{v:'PRV-887',l:'PROVEEDOR'}],status:'Identidad canónica creada en Silver Layer'},                  active:6, idx:[0,1,2,3,4,5,6]},
  4:   {snap:{inds:[{v:'T+45s*',l:'TIEMPO'},{v:'3 KPIs',l:'CALCULADOS'},{v:'Unidad 7',l:'SCOPE'}], status:'Métricas de Gold actualizadas con el pedido'},                active:7, idx:[0,1,2,3,6,7]},
  5:   {snap:{inds:[{v:'T+46s*',l:'TIEMPO'},{v:'+34%',l:'DESVIACIÓN'},{v:'Alerta',l:'ESTADO'}],   status:'Monto atípico notificado a jefe de compras'},                  active:8, idx:[0,1,2,3,6,7,8]},
  6:   {snap:{inds:[{v:'T+2min',l:'TIEMPO'},{v:'Power BI',l:'CONSUMO'},{v:'Live',l:'ESTADO'}],     status:'OC visible en dashboard — decisión en curso'},                 active:9, idx:[0,1,2,3,6,7,8,9]},
  7:   {snap:{inds:[{v:'T+24h',l:'TIEMPO'},{v:'Compactado',l:'ESTADO'},{v:'Delta v3',l:'VERSIÓN'}],status:'Histórico archivado y consultable en Delta Lake'},             active:null,idx:[0,1,2,3,6,7,8,9]},
  8:   {snap:{inds:[{v:'T+0→2min',l:'TRAYECTO'},{v:'10',l:'ETAPAS'},{v:'100%',l:'TRAZADO'}],      status:'Recorrido completo trazable desde ERP hasta decisión'},        active:null,idx:[0,1,2,3,4,5,6,7,8,9]}
};
function renderSnap(jd){
  return jd.snap.inds.map(i=>`<div class="jp-ind"><div class="jp-val">${i.v}</div><div class="jp-lbl-s">${i.l}</div></div>`).join('')
    +`<div class="jp-status">${jd.snap.status}</div>`;
}
function renderFull(jd){
  const steps=jd.idx.map((si,pos)=>{
    const s=ALL_STEPS[si];
    let cls='jp-step';
    const isActive=si===jd.active;
    if(isActive) cls+=' jp-cur';
    else if(s.warn) cls+=' jp-warn jp-done';
    else if(jd.active!==null && pos<jd.idx.indexOf(jd.active)) cls+=' jp-done';
    const layers=isActive&&(s.relato||s.tecnico)?`
      ${s.relato?`<div class="jp-layer-lbl" style="color:inherit">Relato</div><div class="jp-layer-relato">${s.relato}</div>`:''}
      ${s.tecnico?`<div class="jp-layer-lbl" style="color:#29b5e8">Técnico</div><div class="jp-layer-tecnico">${s.tecnico}</div>`:''}
      ${s.tema?`<div class="jp-layer-lbl">Tema</div><div style="font-size:10px;color:rgba(255,255,255,.35);font-style:italic">${s.tema}</div>`:''}
    `:'';
    return `<div class="${cls}"><div class="jp-time">${s.t}</div><div class="jp-stitle">${s.title}</div><div class="jp-sdesc">${s.desc}</div>${layers}</div>`;
  }).join('');
  return `<div class="jp-fhdr">OC-24-1021 · Churrascos María · Sodimac TC</div>${steps}`;
}

let journeyOpen=false;
function selNode(nodeId) {
  selId=nodeId;
  if(!(mode==='right'&&CHAPTERS[cur]&&CHAPTERS[cur].n===1)) renderDiagram();
  // Resaltar servidor en diagramas custom (data-nid) — después de re-inyectar
  document.querySelectorAll('[data-nid]').forEach(el=>el.classList.toggle('d1-sel',el.dataset.nid===nodeId));
  const d=CHAPTERS[cur];
  const node=d.diagram.nodes.find(n=>n.id===nodeId);
  const det=node&&node.det;
  if(!det){return}
  $('dp-empty').style.display='none';
  const dp=$('dp-content');dp.style.display='block';
  dp.innerHTML=`<div class="dp-layer">${det.layer}</div>
    <div class="dp-name">${det.name}</div>
    <div class="dp-tech">${det.tech}</div>
    <hr class="dp-sep">
    <p class="dp-desc">${det.desc}</p>
    <div class="dp-props">${det.props.map(p=>`<div class="dp-prop"><span class="dp-k">${p.k}</span><span class="dp-v">${p.v}</span></div>`).join('')}</div>`;
}

function renderGhosts(d) {
  $('r-ghosts').innerHTML=(d.components||[]).map(c=>`<div class="cg" style="font-size:${c.s}px;left:${c.x};top:${c.y};opacity:${c.o}">${c.t}</div>`).join('');
}

function applyTypo(m) {
  const s=TS[m];
  $('atm-text').style.fontSize=s.atm;
  if($('atm-text')){
    const _ac=mode==='left'&&CHAPTERS[cur]?CHAPTERS[cur].accentColor:null;
    $('atm-text').style.color=_ac||'';
    $('atm-text').style.fontStyle=mode==='left'?'italic':'';
  }$('narr-text').style.fontSize=s.narr;
  $('rch-title').style.fontSize=s.title;
  document.querySelectorAll('.meta-para,.ins-txt').forEach(e=>e.style.fontSize=s.para);
}

function render(anim) {
  selId=null;
  $('dp-empty').style.display='';$('dp-content').style.display='none';
  const go=()=>{
    const d=CHAPTERS[cur];
    $('lpanel').style.background=d.bg;
    $('l-content').style.setProperty('--l-hi',d.accentColor);
    $('lch-label').style.color=d.accentColor;$('lch-label').textContent=`Capítulo ${d.n} — ${d.sec}`;
    // Always reset states — each chapter sets its own
    $('app').classList.remove('ch11-view');

    const _lc=$('l-content'); if(_lc) _lc.style.visibility='';
    const _esImg=document.querySelector('#elena-slide .elena-img');
    if(_esImg) _esImg.src="";
    document.getElementById('elena-slide').classList.remove('es-active','es-title-visible');
    document.getElementById('ch10-slide').classList.remove('ch10-active');
    const _cs11=document.getElementById('ch11-slide');
    if(_cs11) _cs11.classList.remove('ch11-active');
    document.querySelectorAll('.tbt').forEach(b=>b.style.display='');
    if(d.n!==2.7&&d.n!==6.7) $('app').classList.remove('map-active');
    const lc3=$('l-content'); if(lc3) lc3.style.visibility='';
    if(d.n!==9) rolandoInit=false;
    if(d.n===9){
      $('app').classList.add('ch9-active');
      if(mode!=='left') setMode('left');
      document.getElementById('ch10-slide').classList.remove('ch10-active');
      rolandoInit=true; resetRolando(); updateRolandoDisplay();
    } else if(d.n===10){
      document.getElementById('elena-slide').classList.remove('es-active');
      // Hide Técnico tab
      document.querySelectorAll('.tbt').forEach(b=>b.style.display=b.textContent.includes('cnico')?'none':'');
    } else if(d.n===2.7){
      $('app').classList.add('map-active');
      renderMapSlide(2);
    } else if(d.n===6.7){
      $('app').classList.add('map-active');
      renderMapSlide(6);
    } else if(d.n===11){
      $('app').classList.add('ch11-view');
      ch11Beat=0;
      const cs11=document.getElementById('ch11-slide');
      if(cs11) cs11.classList.add('ch11-active');
      // Mostrar solo narrFull (primeros párrafos), ocultar narrClose
      const nb11=document.getElementById('ch11-narr-text');
      if(nb11){ nb11.innerHTML=markup(d.narrFull||d.narr||''); nb11.style.opacity='1'; }
      const nc11=document.getElementById('ch11-narr-close');
      if(nc11){ nc11.innerHTML=markup(d.narrClose||''); nc11.style.opacity='0'; nc11.style.transition='none'; }
      // Reset ch11-slide background and overlay
      const cs11r=document.getElementById('ch11-slide');
      if(cs11r){ cs11r.style.transition='none'; cs11r.style.background=''; }
      const ovr=document.getElementById('ch11-overlay-black');
      if(ovr){ ovr.style.opacity='0'; setTimeout(()=>{ if(ovr.parentNode) ovr.remove(); },500); }
      $('l-content').style.visibility='hidden';
      document.querySelectorAll('.tbt').forEach(b=>{
        if(b.textContent.includes('cnico')||b.textContent.includes('ptico')) b.style.display='none';
      });

        } else if(d.n===0){
      rolandoInit=false; elenaBeat=0;
          const es=document.getElementById('elena-slide');
      if(es){ es.classList.add('es-active'); es.classList.remove('es-title-visible'); }
      const _esImgRestore=document.querySelector('#elena-slide .elena-img');
      if(_esImgRestore) _esImgRestore.src='maria_desconfiada.png';
    } else if(d.n===1){
      rolandoInit=false;
      $('app').classList.remove('ch9-active');
      document.getElementById('elena-slide').classList.remove('es-active');
      document.getElementById('ch10-slide').classList.remove('ch10-active');
      const atm=$('atm-text'),atmr=$('atm-rule');
      if(atm) atm.style.display=''; if(atmr) atmr.style.display='';
      const pause=$('ch9-pause'),fairy=$('ch9-fairy');
      if(pause) pause.className=''; if(fairy) fairy.className='';
    } else {
      $('app').classList.remove('ch9-active');
      rolandoInit=false;
      document.getElementById('elena-slide').classList.remove('es-active');
      const atm=$('atm-text'),atmr=$('atm-rule');
      if(atm) atm.style.display=''; if(atmr) atmr.style.display='';
      const pause=$('ch9-pause'),fairy=$('ch9-fairy');
      if(pause) pause.className=''; if(fairy) fairy.className='';
    }
    const oqEl=$('l-oc-quote'); if(oqEl) oqEl.style.display='none';
    const displayWord=mode==='both'?(d.titleDip||d.emo):(d.title||d.emo);
    $('emo-word').style.color=d.emoColor;$('emo-word').style.fontSize=emoFS(displayWord,mode);$('emo-word').textContent=displayWord;
    $('l-watermark').style.color=d.emoColor;$('l-watermark').querySelector('span').textContent=d.emo;
    $('atm-rule').style.background=d.accentColor;
    $('atm-text').style.color=d.accentColor;$('atm-text').innerHTML=`"${markup(d.atm)}"`;
    $('narr-text').style.color=d.emoColor;
    if(CHAPTERS[cur].n!==9&&mode!=='left') $('narr-text').innerHTML=markup(d.narr||'');
    else if(CHAPTERS[cur].n!==9&&mode==='left') renderRelatoBeat0(d);


    // Left panel time info — read from jp panel (already rendered)
    setTimeout(function(){
      var jpT=document.querySelector('#jp-neg-body .jp-time');
      var jpF=document.querySelector('#jp-neg-body .jp-footer-val');
      var elH=document.getElementById('l-time-hora');
      var elD=document.getElementById('l-time-dur');
      if(elH&&jpT) elH.textContent=jpT.textContent;
      if(elD&&jpF) elD.textContent=jpF.textContent;
    },0);
    const tn=$('tecnico-narr');
    if(tn){ if(d.flujoTecnicoExplicativo&&mode==='right'){tn.innerHTML=markup(d.flujoTecnicoExplicativo);tn.classList.add('visible');}else{tn.classList.remove('visible');} }
    $('l-glow').style.background=`radial-gradient(circle,${d.glowColor} 0%,transparent 70%)`;
    $('rpanel').style.backgroundColor=d.techBg;
    renderGhosts(d);
    $('rch-title').innerHTML=markup(d.title);
    $('r-caps').innerHTML=d.caps.map(t=>`<span class="tag tc">${t}</span>`).join('');
    $('r-cap-txt').innerHTML=markup(d.capsTxt);
    $('r-pris').innerHTML=d.pris.map(t=>`<span class="tag tp">${t}</span>`).join('');
    $('r-pri-txt').innerHTML=markup(d.prisTxt);
    $('r-objs').innerHTML=d.objs.map(t=>`<span class="tag to">${t}</span>`).join('');
    $('r-obj-txt').innerHTML=markup(d.objsTxt);
    const ib=$('insight-box');if(ib)ib.style.display='none';
    const insMeta=$('r-ins-meta'),insGrid=document.querySelector('.diptico-grid');
    if(d.ins){
      if($('r-ins-txt'))$('r-ins-txt').innerHTML=markup(d.ins);
      if(insMeta)insMeta.style.display='';
      if(insGrid)insGrid.classList.add('has-ins');
    }else{
      if(insMeta)insMeta.style.display='none';
      if(insGrid)insGrid.classList.remove('has-ins');
    }
    $('ch-name').textContent=d.sec;$('ch-pos').textContent=`Capítulo ${d.n} de ${CHAPTERS.length}`;
    document.querySelectorAll('.dot').forEach((e,i)=>e.classList.toggle('on',i===cur));
    $('prev-btn').disabled=cur===0;$('next-btn').disabled=cur===CHAPTERS.length-1;
    try{renderJP(d);}catch(e){console.error(e);}

    applyTypo(mode);
    if(mode==='right'){ renderDiagram();
      if(CHAPTERS[cur]&&CHAPTERS[cur].n===1) setupTecnoDiagram(); }
    /* Journey panel */
    const jd=JOURNEY_DATA[d.n];
    const jpanel=$('journey-panel'), jpsnap=$('jp-snap'), jpfull=$('jp-full');
    if(jpanel) jpanel.style.setProperty('--jp-color',d.techAccent||'#378ADD');
    if(jpsnap) jpsnap.innerHTML=jd?renderSnap(jd):`<div class="jp-status" style="margin-top:.5rem">Sin datos para este capítulo.</div>`;
    if(jpfull) jpfull.innerHTML=jd?renderFull(jd):'';
  };
  if(anim){const s=$('slide');s.classList.add('fading');setTimeout(()=>{go();s.classList.remove('fading')},190)}
  else go();
}

function setMode(m) {
  // Block forbidden modes per chapter
  if(CHAPTERS[cur]){
    if(CHAPTERS[cur].n===11&&(m==='both'||m==='right')) return;
    if(CHAPTERS[cur].n===10&&m==='right') return;
  }
  // Restore l-content when switching to díptico or técnico
  if(m==='both'||m==='right'){
    const lc_v=$('l-content'); if(lc_v) lc_v.style.visibility='';
  }
  mode=m;
  const _app=$('app');
  // Preserve non-mode classes (ch11-view, map-active, etc.)
  const _keep=[..._app.classList].filter(c=>!c.startsWith('mode-')&&c!=='map-active');
  _app.className='mode-'+m+(_keep.length?' '+_keep.join(' '):'');
  document.querySelectorAll('#toggle .tbt').forEach((b,i)=>b.classList.toggle('on',['left','both','right'][i]===m));
  const dw=CHAPTERS[cur];
  const dword=m==='both'?(dw.titleDip||dw.emo):(dw.title||dw.emo);
  $('emo-word').style.fontSize=emoFS(dword,m);
  $('emo-word').textContent=dword;
  const oq=$('l-oc-quote'); if(oq) oq.style.display='none';
  if(m!=='left') $('narr-text').innerHTML=markup(CHAPTERS[cur].narr||'');
  try{renderJP(CHAPTERS[cur]);}catch(e){}
  applyTypo(m);
  if(m==='right'){
    selId=null;$('dp-empty').style.display='';$('dp-content').style.display='none';
    $('r-diagram-wrap').classList.remove('has-custom');renderDiagram();
    if(CHAPTERS[cur]&&CHAPTERS[cur].n===1) setupTecnoDiagram();
    // Close JP tec, hide tecnico-narr, reset beat, auto-select first node
    jpTecOpen=false;const _jptec=$('jp-tecnico');if(_jptec)_jptec.classList.add('jp-collapsed');
    const tn=$('tecnico-narr');
    if(tn){
      const _isCH1=(CHAPTERS[cur]&&CHAPTERS[cur].n===1);
      if(!_isCH1){
        const _ft=CHAPTERS[cur]&&CHAPTERS[cur].flujoTecnicoExplicativo;
        if(_ft){tn.innerHTML=markup(_ft);tn.classList.add('visible');}
        else{tn.classList.remove('visible');}
      }
    }
    if(typeof setTechMode==='function') setTechMode('present');
    tecnoBeat=0;
  }
}

function go(d){
  const nx=cur+d;
  if(nx<0||nx>=CHAPTERS.length) return;
  // María: primer → muestra título, segundo → navega
  if(d>0 && CHAPTERS[cur].n===0 && elenaBeat<1){
    elenaBeat=1;
    document.getElementById('elena-slide').classList.add('es-title-visible');
    return;
  }
  cur=nx;
  chSeqBeat=0;
  dipticoBeat=0;
  // Set the first mode of the sequence for this chapter
  const _seq=getSeq(CHAPTERS[cur].n);
  const _firstMode=(_seq&&_seq.length>0)?_seq[0]:'left';
  if(_firstMode==='both') resetDiptico();
  setMode(_firstMode);
  // Close JP when entering CH1
  if(CHAPTERS[cur].n===1&&!jpNegOpen===false){ jpNegOpen=false; $('app').classList.add('jp-neg-closed'); }
  if(CHAPTERS[cur].n===9){ const nt=$('narr-text'); if(nt){nt.style.opacity='0';nt.style.transition='none';} }
  render(true);
}
function hideCover(){$('cover').classList.add('out')}

// Dots
const dr=$('dots');CHAPTERS.forEach((_,i)=>{const d=document.createElement('div');d.className='dot'+(i===0?' on':'');d.onclick=()=>{cur=i;render(true)};dr.appendChild(d)});
// Keys
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'){
    if(CHAPTERS[cur]&&CHAPTERS[cur].n===9){
      if(advanceRolando()) return;
    }
    if(CHAPTERS[cur]&&CHAPTERS[cur].n===10){
      if(advanceCh10()) return;
    }
    if(CHAPTERS[cur]&&CHAPTERS[cur].n===11){
      if(advanceCh11()) return;
    }
    handleNext();
  }
  if(e.key==='ArrowLeft')go(-1);
  if(e.key==='Tab'){e.preventDefault();if(CHAPTERS[cur]?.n===9)return;setMode({left:'both',both:'right',right:'left'}[mode])}
  if(e.key==='Escape')hideCover();
});
render(false);









/* § JS-RELATO-BEAT */
let relatoBeat=0;

function splitNarr(html){
  // Split at first <br><br> — col1=first paragraph(s), col2=rest
  const br2=html.indexOf('<br><br>');
  if(br2>=0) return[html.slice(0,br2),html.slice(br2+8)];
  // No double-br: try single <br>
  const br1=html.indexOf('<br>');
  if(br1>=0) return[html.slice(0,br1),html.slice(br1+4)];
  // No breaks: all in col1
  return[html,''];
}

function resetRelato(){
  relatoBeat=0;
  const nt=$('narr-text');
  const c1=nt?nt.querySelector('#narr-col1'):null;
  const c2=nt?nt.querySelector('#narr-col2'):null;
  if(c1){c1.style.transition='none';c1.style.opacity='0';}
  if(c2){c2.style.transition='none';c2.style.opacity='0';}
}


const CH_SEQUENCES = {
  0:   ['left'],
  1:   ['left','both','right'],
  2:   ['left','both','right'],
  2.5: ['left'],
  2.7: [],
  3:   ['left'],
  4:   ['right','both','left'],
  5:   ['left'],
  6:   ['left'],
  6.7: [],
  7:   ['left'],
  8:   ['both','left','right'],
  9:   ['left'],
  10:  ['left'],
  11:  ['left'],
};
let chSeqBeat=0;
let dipticoBeat=0; // tracks which panel/card is visible in diptico

function getSeq(n){
  const key=Object.keys(CH_SEQUENCES).find(k=>parseFloat(k)===n);
  return key!==undefined?CH_SEQUENCES[key]:null;
}

function advanceDiptico(){
  // In diptico (both) mode: beat 1,2,3 = each right card revealed one by one
  const cards=document.querySelectorAll('#r-text-wrap .meta, #r-text-wrap #r-ins-meta');
  const visibleCards=[...cards].filter(c=>c.style.display!=='none');
  if(dipticoBeat<visibleCards.length){
    const card=visibleCards[dipticoBeat];
    if(card){card.style.transition='opacity .6s ease';card.style.opacity='1';}
    dipticoBeat++;
    return true;
  }
  // All cards shown — move to next sequence beat
  dipticoBeat=0;
  return false;
}

function resetDiptico(){
  // Called when entering diptico — hide all right panel cards immediately
  dipticoBeat=0;
  const cards=document.querySelectorAll('#r-text-wrap .meta, #r-text-wrap #r-ins-meta');
  cards.forEach(c=>{c.style.transition='none';c.style.opacity='0';});
}

function handleNext(){
  const d=CHAPTERS[cur];
  if(!d) return;

  // Special chapters with their own beat systems
  if(d.n===0){ go(1); return; }
  if(d.n===9){ advanceRolando(); return; }
  if(d.n===10){ if(!advanceCh10()) go(1); return; }
  if(d.n===11){ if(!advanceCh11()) go(1); return; }

  // Relato internal beats (col1 → col2)
  if(mode==='left'){
    if(advanceRelato()) return;
    // Relato done — go to next sequence mode
  }

  // Tecno internal beats (ch1 only)
  if(mode==='right'&&d.n===1){
    if(advanceTecno()) return;
    // Tecno done — go to next sequence mode
  }

  // Diptico internal beats (left panel → card1 → card2 → card3)
  if(mode==='both'){
    if(advanceDiptico()) return;
    // Diptico done — go to next sequence mode
  }

  // Advance to next mode in sequence
  const seq=getSeq(d.n);
  if(seq&&chSeqBeat<seq.length-1){
    chSeqBeat++;
    const nextMode=seq[chSeqBeat];
    if(nextMode==='both') resetDiptico();
    setMode(nextMode);
    if(nextMode==='right'&&d.n===1) setTimeout(setupTecnoDiagram,50);
    // If entering relato, reset relato beats
    if(nextMode==='left') resetRelato();
    return;
  }

  // Sequence done — navigate to next chapter
  chSeqBeat=0;
  dipticoBeat=0;
  go(1);
}

function renderRelatoBeat0(d){
  if(!d||d.n===9||d.n===0||d.n===10||d.n===11||d.n===2.7||d.n===6.7) return false;
  const nt=$('narr-text');
  if(!nt) return;
  // Always recreate col divs (setMode may have replaced innerHTML)
  nt.innerHTML='<div id="narr-col1"></div><div id="narr-col2"></div>';
  const html=markup(d.narrFull||d.narr||'');
  const [c1html,c2html]=splitNarr(html);
  nt.querySelector('#narr-col1').innerHTML=c1html;
  nt.querySelector('#narr-col2').innerHTML=c2html||'';
  resetRelato();
}

function advanceRelato(){
  const d=CHAPTERS[cur];
  if(!d||d.n===9||d.n===0||d.n===10||d.n===11||d.n===2.7||d.n===6.7) return false;
  relatoBeat++;
  function fadeIn(el){
    if(!el) return;
    el.style.transition='opacity .65s ease';
    el.style.opacity='1';
  }
  const nt2=$('narr-text');
  const c1=nt2?nt2.querySelector('#narr-col1'):null;
  const c2=nt2?nt2.querySelector('#narr-col2'):null;
  if(relatoBeat===1){
    fadeIn(c1);
    if(c2&&!c2.textContent.trim()){relatoBeat=2;fadeIn(c2);}
    return true;
  }
  if(relatoBeat===2){ fadeIn(c2); return true; }
  resetRelato();
  return false;
}



/* § JS-TECNO-BEAT */
let tecnoBeat=0;

const CH1_TEXTS=[
  "Carga Operativa Protegida: Las transacciones de María (<code>INSERT</code> en <code>dbo.ordenes_compra</code>) son le\u00eddas a nivel de log de transacciones. Cero consultas directas sobre las tablas del ERP.",
  "Continuidad Garantizada: La Distribution DB procesa la r\u00e9plica mediante un cl\u00faster de dos nodos con failover autom\u00e1tico, asegurando que el flujo no se detenga si un nodo falla.",
  "Auditor\u00eda de Impacto Cero: El Staging DB absorbe el estr\u00e9s del CDC para indexar, auditar y generar los LSN inmutables. El ERP opera al 100% de su capacidad, ajeno a la extracci\u00f3n."
];

function setupTecnoDiagram(){
  const d=CHAPTERS[cur];
  if(d.n!==1) return;
  const wrap=$('r-diag-svg')||$('r-diagram-wrap');
  if(!wrap) return;

  const nodes=[...wrap.querySelectorAll('[data-nid]')];
  const conns=[...wrap.querySelectorAll('.d1-cable-connector,.d1-output-pipe')];
  const logs=[...wrap.querySelectorAll('.d1-log-line')];
  const rest=[...wrap.querySelectorAll('.pipe-line,.pipe-text')];

  // Hide everything except first node
  [...nodes.slice(1),...conns,...logs,...rest].forEach(el=>{
    el.style.transition='opacity .6s ease';
    el.style.opacity='0';
  });
  nodes[0] && (nodes[0].style.opacity='1');
  if(nodes[0]) selNode(nodes[0].dataset.nid);

  // Show text item 1
  const tn=$('tecnico-narr');
  if(tn){
    tn.innerHTML='<div class="tn-item">'+CH1_TEXTS[0]+'</div>';
    tn.classList.add('visible');
  }
  tecnoBeat=0;
}


let ch11Beat=0;

function advanceCh11(){
  const d=CHAPTERS[cur];
  if(!d||d.n!==11) return false;

  if(ch11Beat===0){
    // Beat 1: mostrar párrafo de cierre
    const nc11=document.getElementById('ch11-narr-close');
    if(nc11){
      nc11.style.transition='none';
      nc11.style.opacity='0';
      requestAnimationFrame(()=>{
        nc11.style.transition='opacity .8s ease';
        nc11.style.opacity='1';
      });
    }
    ch11Beat=1;
    return true;
  }

  if(ch11Beat===1){
    // Beat 2: oscurecer toda la pantalla con overlay
    let ov=document.getElementById('ch11-overlay-black');
    if(!ov){
      ov=document.createElement('div');
      ov.id='ch11-overlay-black';
      ov.style.cssText='position:fixed;inset:0;background:#000;z-index:9990;opacity:0;transition:opacity 1s ease;pointer-events:none';
      document.body.appendChild(ov);
    }
    requestAnimationFrame(()=>{ ov.style.opacity='1'; });
    ch11Beat=2;
    return true;
  }

  // Beat 3: fin — limpiar overlay y navegar
  const ov=document.getElementById('ch11-overlay-black');
  if(ov){ ov.style.opacity='0'; setTimeout(()=>ov.remove(),500); }
  ch11Beat=0;
  return false;
}

function advanceCh10(){
  const d=CHAPTERS[cur];
  if(!d||d.n!==10) return false;

  if(ch10Beat===0){
    // Beat 1: ocultar reloj, revelar texto panel izquierdo
    const lti=document.getElementById('l-time-info');
    if(lti){lti.style.transition='opacity .4s ease';lti.style.opacity='0';setTimeout(()=>{lti.style.display='none';},400);}
    const toReveal=['emo-word','narr-text','lch-label'];
    toReveal.forEach(id=>{
      const el=$(id);
      if(el){el.style.transition='opacity .8s ease';el.style.opacity='1';}
    });
    ch10Beat=1;
    return true;
  }

  if(ch10Beat===1){
    // Beat 2: cambiar a díptico y resetear panel derecho (tarjetas ocultas)
    resetDiptico();
    setMode('both');
    // Restore r-text-wrap visibility (pulseReveal hid it)
    const rp=$('r-text-wrap');
    if(rp){rp.style.transition='none';rp.style.opacity='1';}
    try{renderJP(d);}catch(e){}
    ch10Beat=2;
    return true;
  }

  // Beat 3+: delegar a advanceDiptico
  if(ch10Beat>=2){
    if(advanceDiptico()) return true;
    // Diptico done — signal to navigate to next chapter
    ch10Beat=0;
    dipticoBeat=0;
    go(1);
    return true; // prevent handleNext from calling go(1) again
  }

  ch10Beat=0;
  return false;
}
function advanceTecno(){
  if(mode!=='right') return false;
  const d=CHAPTERS[cur];
  if(d.n!==1) return false;

  const wrap=$('r-diag-svg')||$('r-diagram-wrap');
  if(!wrap){ tecnoBeat=0; return false; }
  const nodes=[...wrap.querySelectorAll('[data-nid]')];
  const conns=[...wrap.querySelectorAll('.d1-cable-connector,.d1-output-pipe')];
  const logs=[...wrap.querySelectorAll('.d1-log-line')];
  const rest=[...wrap.querySelectorAll('.pipe-line,.pipe-text')];
  const tn=$('tecnico-narr');

  if(tecnoBeat===0){
    // State 2: show connector[0] + distrib
    if(conns[0]) conns[0].style.opacity='1';
    if(nodes[1]){ nodes[1].style.opacity='1'; selNode(nodes[1].dataset.nid); }
    if(tn) tn.innerHTML+='<div class="tn-item">'+CH1_TEXTS[1]+'</div>';
    tecnoBeat=1;
    return true;
  }
  if(tecnoBeat===1){
    // State 3: reveal everything remaining (staging + CDC + logs + animations)
    [...nodes.slice(2),...conns.slice(1),...logs,...rest].forEach(el=>el.style.opacity='1');
    if(nodes[2]) selNode(nodes[2].dataset.nid);
    if(tn) tn.innerHTML+='<div class="tn-item">'+CH1_TEXTS[2]+'</div>';
    tecnoBeat=2;
    return true;
  }
  // State 4: navigate
  tecnoBeat=0;
  return false;
}


const MAP_STAGES=[
  {n:'REGISTRO',      t:'16:02', zc:'z1'},
  {n:'ENV\u00cdO',   t:'16:05', zc:'z1'},
  {n:'FILTRADO',      t:'16:22', zc:'z2'},
  {n:'IDENTIFICACI\u00d3N',t:'16:27', zc:'z3'},
  {n:'VALORIZACIÓN',  t:'16:32', zc:'z3'},
  {n:'ALERTA',        t:'16:40', zc:'z4'},
  {n:'APROBACI\u00d3N',t:'16:40', zc:'z4'},
  {n:'REG. INMUTABLE',t:'nocturno', zc:'z2'}
];
const MAP_ICONS=['\u2460','\u2461','\u2462','\u2463','\u2464','\u2465','\u2466','\u2467'];

function renderMapSlide(activeIdx){
  const wrap=document.getElementById('map-stages');
  const prog=document.getElementById('map-progress');
  if(!wrap) return;
  // Fila 1 (band-wrap) + fila 2 (lbl) por etapa — elementos planos en el grid
  const stagesHtml=MAP_STAGES.map((s,i)=>{
    const st=i<activeIdx?'ms-past':i===activeIdx?'ms-active':'';
    const icon=i<activeIdx?'✓':MAP_ICONS[i];
    const col=i+1;
    const timeVis=i>activeIdx?'style="visibility:hidden"':'';
    return`<div class="ms-band-wrap ms-zone-${s.zc} ${st}" style="grid-column:${col}">
        <div class="ms-time" ${timeVis}>${s.t}</div>
        <div class="ms-dot">${icon}</div>
      </div>
      <div class="ms-lbl ${st}" style="grid-column:${col}">${s.n}</div>`;
  }).join('');
  // Fila 3: nombre de zona, una celda por grupo contiguo
  const zoneBands=[
    {zc:'z1',col:'1/3',lbl:'Zona 1 · On-premise'},
    {zc:'z2',col:'3/4',lbl:'Zona 2'},
    {zc:'z3',col:'4/6',lbl:'Zona 3 · Silver'},
    {zc:'z4',col:'6/8',lbl:'Zona 4 · Gold'},
    {zc:'z2',col:'8/9',lbl:'Zona 2'}
  ];
  const zonesHtml=zoneBands.map(b=>
    `<div class="ms-zone-span ms-zone-${b.zc}" style="grid-column:${b.col}">${b.lbl}</div>`
  ).join('');
  wrap.innerHTML=stagesHtml+zonesHtml;
  if(prog) prog.textContent=`${activeIdx} de ${MAP_STAGES.length} etapas completadas`;
}

/* § JS-TECH-MODE */
let techMode='present';
function setTechMode(m){
  techMode=m;
  document.getElementById('app').classList.toggle('tech-present',m==='present');
  const bp=document.getElementById('btn-present'),bd=document.getElementById('btn-detail');
  if(bp)bp.classList.toggle('active',m==='present');
  if(bd)bd.classList.toggle('active',m==='detail');
}

/* § JS-JOURNEY-PANEL */
let jpNegOpen=true,jpTecOpen=true;

function toggleJP(side){
  if(side==='neg'){jpNegOpen=!jpNegOpen;document.getElementById('app').classList.toggle('jp-neg-closed',!jpNegOpen);}
  else{jpTecOpen=!jpTecOpen;const p=document.getElementById('jp-tecnico');if(p)p.classList.toggle('jp-collapsed',!jpTecOpen);}
}
function darkBg(hex){
  if(!hex||hex[0]!=='#'||hex.length<7)return'rgb(30,28,25)';
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return`rgb(${Math.round(r*.22)},${Math.round(g*.22)},${Math.round(b*.22)})`;
}
function makeStages(list,activeEtapa){
  const activeIdx=list.indexOf(activeEtapa);
  const lastIdx=list.length-1;
  return list.map((s,i)=>{
    const state=i<activeIdx?'past':i===activeIdx?'active':'future';
    const extra=i===activeIdx&&i===lastIdx?' jp-final':'';
    return`<div class="jp-si ${state}${extra}"><div class="jp-si-track"><div class="jp-si-node"></div><div class="jp-si-line"></div></div><div class="jp-si-label">${s}</div></div>`;
  }).join('');
}
function renderJP(d){
  if(!d)return;
  try{
    const isDuo=d.n<=2,isGate=d.n===2.5;
    const negPanel=document.getElementById('jp-negocio');
    if(negPanel){const bg=d.bg||'#EDE9E0';negPanel.style.background=darkBg(bg);negPanel.style.borderLeftColor=bg+'44';}
    function parseTL(tl){const p=(tl||'').split(' | ');return{hora:p[0]?p[0].replace(/.*·\s*/,'').replace(/\s*hs\s*$/i,''):'—',dur:p[1]||''};}
    const tl=parseTL(d.timeline);
    const cumul=JP_CUM[String(d.n)]||'—';
    function strip(id){const el=document.getElementById(id);if(!el)return;let h=`<span class="jp-strip-oc-num">OC-24-1021</span>`;if(isDuo)h+=`<div class="jp-strip-sep"></div><span class="jp-strip-oc-num dup">OC-24-DUP</span>`;el.innerHTML=h;}
    strip('jp-neg-nums');strip('jp-tec-nums');
    const hdrocHtml=isDuo?`<span style="color:rgba(255,255,255,.7);font-weight:700;font-size:9px">OC-24-1021</span>&ensp;<span style="color:rgba(245,158,11,.8);font-weight:700;font-size:9px">OC-24-DUP</span>`:isGate?`<span style="color:rgba(255,255,255,.7);font-weight:700;font-size:9px">OC-24-1021</span>&ensp;<span style="color:rgba(239,68,68,.6);font-size:8px;text-decoration:line-through">DUP</span>`:`<span style="color:rgba(255,255,255,.7);font-weight:700;font-size:9px">OC-24-1021</span>`;
    const negOcEl=negPanel?negPanel.querySelector('.jp-oc-id'):null;
    const tecPanel=document.getElementById('jp-tecnico');
    const tecOcEl=tecPanel?tecPanel.querySelector('.jp-oc-id'):null;
    if(negOcEl)negOcEl.innerHTML=hdrocHtml;
    if(tecOcEl)tecOcEl.innerHTML=hdrocHtml;
    const nb=document.getElementById('jp-neg-body');
    if(nb){const pn=d.panelNegocio||{};const stagesHtml=makeStages(STAGES_NEG,pn.etapa);nb.innerHTML=`<div class="jp-time">${tl.hora}</div>`+(tl.dur?`<div class="jp-dur">${tl.dur}</div>`:'')+`<div class="jp-stages" style="--jp-ac:rgba(255,255,255,.8);--jp-ac-bg:rgba(255,255,255,.1)">${stagesHtml}</div>`+`<div class="jp-footer"><div class="jp-footer-lbl">Tiempo acumulado</div><div class="jp-footer-val">${cumul}</div></div>`;}
    const tb=document.getElementById('jp-tec-body');
    if(tb){const pt=d.panelTecnico||{};const stagesHtml=makeStages(STAGES_TEC,pt.etapa);tb.innerHTML=`<div class="jp-time">${tl.hora}</div>`+(tl.dur?`<div class="jp-dur">${tl.dur}</div>`:'')+`<div class="jp-stages">${stagesHtml}</div>`+`<div class="jp-footer"><div class="jp-footer-lbl">Tiempo acumulado</div><div class="jp-footer-val">${cumul}</div></div>`;}
  }catch(e){console.error('renderJP:',e);}
}

