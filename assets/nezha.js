/* Dora's Nezha (photo of her own cardboard figure) on the home page. Click Nezha to pick today's mood; Nezha reacts. */
(function(){
  const host=document.getElementById('nezha'); if(!host) return;
  const KEY='dora-mood-v1', d=new Date(), pad=n=>String(n).padStart(2,'0'), T=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const load=()=>{ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } };
  const save=s=>{ try{ localStorage.setItem(KEY,JSON.stringify(s)); }catch(e){} };
  const S='fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  const eyes='<circle cx="9" cy="10" r="1.3" fill="currentColor"/><circle cx="17" cy="10" r="1.3" fill="currentColor"/>';
  const M=[
    {k:'happy',  t:'Happy',   c:'#16a34a', a:'hop',   say:'Nice. Keep that going today.',          f:`${eyes}<path d="M8 15q5 5 10 0" ${S}/>`},
    {k:'excited',t:'Excited', c:'#ea580c', a:'spin',  say:'Let’s go! Big day.',                f:`<path d="M7 9l2.5 1.5L7 12M19 9l-2.5 1.5L19 12" ${S}/><path d="M8 15h10q-1 5-5 5t-5-5z" ${S}/>`},
    {k:'calm',   t:'Calm',    c:'#0d9488', a:'float', say:'Good. Steady and ready.',              f:`<path d="M7 10q2 1.5 4 0M15 10q2 1.5 4 0" ${S}/><path d="M9 16q4 2 8 0" ${S}/>`},
    {k:'tired',  t:'Tired',   c:'#6366f1', a:'droop', say:'Take it slow. One topic at a time.',   f:`<path d="M7 10.5h4M15 10.5h4" ${S}/><path d="M10 17h6" ${S}/><path d="M20 4h3l-3 3h3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`},
    {k:'worried',t:'Worried', c:'#d97706', a:'shiver',say:'One small step. You’ve got this.', f:`<path d="M7 7l3-1.5M19 7l-3-1.5" ${S}/>${eyes}<path d="M8 17q2.5-2 5 0t5 0" ${S}/>`},
    {k:'grumpy', t:'Grumpy',  c:'#dc2626', a:'shake', say:'Same face as me. Let’s fix that.', f:`<path d="M7 7.5l4 2M19 7.5l-4 2" ${S}/>${eyes}<path d="M8 18q5-4 10 0" ${S}/>`}
  ];
  /* new expressions drawn over the photo's face (photo coords 306x416): skin patches hide the original eyes and mouth */
  const K='#1b1a17', W='#f6f2ee', IR='#8b2a22', SL='#e8bca0', SR='#dfb093';
  const L=[101,126], R=[160,127];
  const ln=(d,w=3.4,c=K)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const eye=([x,y],ry=11,dx=0,dy=1,ir=6)=>`<ellipse cx="${x}" cy="${y}" rx="17" ry="${ry}" fill="${W}" stroke="${K}" stroke-width="4.2"/><circle cx="${x+dx}" cy="${y+dy}" r="${ir}" fill="${IR}"/><circle cx="${x+dx}" cy="${y+dy}" r="${ir/2}" fill="${K}"/><circle cx="${x+dx+2}" cy="${y+dy-2}" r="1.6" fill="#fff"/>`;
  const blush=`<ellipse cx="88" cy="146" rx="9" ry="4" fill="#f08aa4" opacity=".55"/><ellipse cx="174" cy="147" rx="9" ry="4" fill="#f08aa4" opacity=".55"/>`;
  const FACE={
    happy:   eye(L,12,0,0)+eye(R,12,0,0)+ln(`M84 108q17-9 34 0M143 109q17-9 34 0`,3)+`<path d="M115 148q16 15 32 0z" fill="#9b2b2b" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>`+blush,
    excited: ln(`M86 131q15-20 30 0M145 132q15-20 30 0`,4)+`<path d="M112 145h38q-2 19-19 19t-19-19z" fill="#8b1f1f" stroke="${K}" stroke-width="3" stroke-linejoin="round"/><path d="M122 158q9-5 18 0q-2 5-9 5t-9-5z" fill="#ef6f8f"/>`+blush+[[66,104],[198,100],[200,140]].map(([x,y])=>`<path d="M${x} ${y-7}l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#f2c230" stroke="#b8860b" stroke-width=".8"/>`).join(''),
    calm:    ln(`M86 125q15 11 30 0M145 126q15 11 30 0`,3.6)+ln(`M121 152q10 6 20 0`,3)+blush,
    tired:   eye(L,11,0,5,5.5)+eye(R,11,0,5,5.5)+`<path d="M82 127h38v-16h-38zM141 128h38v-16h-38z" fill="${SL}"/>`+ln(`M83 127h36M142 128h36`,3.8)+ln(`M90 143q11 4 22 0M149 144q11 4 22 0`,1.6,'#9c7a6b')+ln(`M122 155q4-3 8 0t8 0`,3)+`<text x="196" y="96" font-family="Fraunces,Georgia,serif" font-weight="600" font-size="20" fill="#6366f1">z</text><text x="210" y="80" font-family="Fraunces,Georgia,serif" font-weight="600" font-size="14" fill="#6366f1">z</text>`,
    worried: eye(L,12,3,1,5)+eye(R,12,3,1,5)+ln(`M85 113L114 106M147 106L176 113`,3.6)+ln(`M117 156q4-5 7 0t7 0t7 0t7 0`,3)+`<path d="M190 104q5 8 0 12q-5-4 0-12z" fill="#7cc4e8" stroke="#3b82c4" stroke-width="1"/>`,
    grumpy:  eye(L,7,1,1,5)+eye(R,7,-1,1,5)+ln(`M83 109L118 120M143 121L178 110`,5)+ln(`M117 158q14-11 28 0`,3.4)+`<path d="M190 92l8 8M198 92l-8 8" stroke="#e2372f" stroke-width="3" stroke-linecap="round"/>`
  };
  const faceSvg=k=>FACE[k]?`<svg class="nz-face" viewBox="0 0 286 416" aria-hidden="true"><g transform="translate(-6.5 -.5)"><defs><filter id="nzb" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.8"/></filter></defs><g filter="url(#nzb)"><ellipse cx="101" cy="125" rx="27" ry="18" fill="${SL}"/><ellipse cx="160" cy="126" rx="27" ry="18" fill="${SR}"/><ellipse cx="131" cy="154" rx="20" ry="10" fill="#e4b79f"/></g>${FACE[k]}</g></svg>`:'';
  const face=m=>`<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="11.5" ${S}/>${m.f}</svg>`;
  const css=`
  .hub{position:relative}
  #nezha{position:absolute;right:28px;top:4px;width:150px;z-index:5;text-align:center;font-family:"Inter","Segoe UI",sans-serif}
  .nz-btn{display:block;width:100%;padding:0;border:0;background:none;cursor:pointer;position:relative}
  .nz-pic{display:block;position:relative;filter:drop-shadow(0 3px 4px rgba(29,27,22,.12));transition:transform .25s;transform-origin:50% 90%}
  .nz-pic img{display:block;width:100%}
  .nz-face{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;animation:nzfade .35s ease-out}
  @keyframes nzfade{from{opacity:0}to{opacity:1}}
  .nz-btn:hover .nz-pic,.nz-btn:focus-visible .nz-pic{transform:translateY(-4px) rotate(-2deg)}
  .nz-btn:focus-visible{outline:none}
  .nz-cue{position:absolute;left:-10px;top:46%;background:#1d1b16;color:#fffdf8;font-size:12px;font-weight:600;padding:3px 8px;border-radius:12px;white-space:nowrap;transform:translateX(-100%);animation:nzcue 1.6s ease-in-out infinite}
  .nz-cue::after{content:"";position:absolute;right:-5px;top:50%;margin-top:-5px;border:5px solid transparent;border-right:0;border-left-color:#1d1b16}
  @keyframes nzcue{0%,100%{transform:translateX(-100%)}50%{transform:translateX(calc(-100% - 6px))}}
  .nz-tag{cursor:pointer;display:flex;align-items:center;gap:5px;position:absolute;right:calc(100% - 6px);bottom:26px;font-size:12px;white-space:nowrap;color:var(--muted);line-height:1.3;background:var(--card);border:1px solid var(--line);border-left:3px solid var(--c);padding:4px 9px;border-radius:3px}
  .nz-tag:not(:has(svg)){animation:nzcue2 1.6s ease-in-out infinite}
  @keyframes nzcue2{0%,100%{transform:none}50%{transform:translateX(-6px)}}
  .nz-tag b{display:inline-flex;align-items:center;gap:4px;color:var(--c);font-weight:700}
  .nz-tag svg{width:18px;height:18px}
  .nz-say{position:absolute;right:calc(100% + 14px);top:8px;width:190px;background:#fffefa;border:2px solid var(--c,#1d1b16);border-radius:10px;padding:8px 11px;font-size:14px;line-height:1.35;color:#1d1b16;text-align:left;box-shadow:0 4px 12px rgba(0,0,0,.08);animation:nzin .3s ease-out}
  .nz-say::after{content:"";position:absolute;right:-9px;top:18px;border:8px solid transparent;border-right:0;border-left-color:var(--c,#1d1b16)}
  .nz-say b{display:block;font-family:"Fraunces",Georgia,serif;font-size:12px;color:var(--c)}
  .nz-pick{position:absolute;right:0;top:calc(100% + 8px);width:300px;background:#fffdf8;border:1px solid var(--line);border-radius:8px;padding:12px;box-shadow:0 10px 30px rgba(29,27,22,.18);animation:nzin .25s ease-out;text-align:left}
  .nz-pick h4{margin:0 0 8px;font-family:"Fraunces",Georgia,serif;font-size:16px;font-weight:600}
  .nz-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
  .nz-grid button{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;border:1.5px solid var(--line);border-radius:6px;background:#fff;cursor:pointer;font:600 13px "Inter",sans-serif;color:var(--c)}
  .nz-grid button svg{width:30px;height:30px}
  .nz-grid button:hover,.nz-grid button.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 10%,#fff)}
  @keyframes nzin{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
  .nz-hop{animation:nzhop .7s cubic-bezier(.3,1.6,.5,1) 2}
  @keyframes nzhop{0%,100%{transform:none}40%{transform:translateY(-22px) rotate(-4deg)}}
  .nz-spin{animation:nzspin .9s ease-in-out}
  @keyframes nzspin{0%{transform:none}40%{transform:translateY(-26px) rotate(180deg)}80%{transform:translateY(0) rotate(360deg)}100%{transform:rotate(360deg)}}
  .nz-float{animation:nzfloat 2.4s ease-in-out}
  @keyframes nzfloat{0%,100%{transform:none}50%{transform:translateY(-10px)}}
  .nz-droop{animation:nzdroop 2s ease-in-out;transform-origin:50% 100%}
  @keyframes nzdroop{0%,100%{transform:none}40%,70%{transform:rotate(-8deg) translateY(6px) scaleY(.94)}}
  .nz-shiver{animation:nzshiv .12s linear 8}
  @keyframes nzshiv{0%,100%{transform:none}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
  .nz-shake{animation:nzshake .5s ease-in-out 2}
  @keyframes nzshake{0%,100%{transform:none}20%{transform:rotate(-7deg)}60%{transform:rotate(7deg)}}
  @media (max-width:860px){#nezha{position:relative;right:auto;top:auto;width:110px;margin:12px 0 0 auto}.nz-tag{bottom:12px}.nz-say{width:150px;font-size:13px}}
  @media (prefers-reduced-motion:reduce){#nezha *{animation:none!important}}`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  let state=load(), open=false;
  const cur=()=>M.find(m=>m.k===(state[T]||{}).k);
  function render(say){
    const m=cur();
    host.style.setProperty('--c',m?m.c:'#1d1b16');
    host.innerHTML=`<button class="nz-btn" type="button" aria-label="Nezha: pick your mood" aria-expanded="${open}"><span class="nz-pic"><img src="assets/nezha.png" alt="Dora's Nezha">${m?faceSvg(m.k):''}</span></button>
      <div class="nz-tag">${m?`I'm feeling <b>${face(m)}${m.t}</b>`:'<b>How do you feel today?</b>'}</div>
      ${say&&m?`<div class="nz-say"><b>Nezha</b>${m.say}</div>`:''}
      ${open?`<div class="nz-pick" role="dialog" aria-label="Pick your mood"><h4>How are you feeling today?</h4><div class="nz-grid">${M.map(x=>`<button type="button" data-k="${x.k}" style="--c:${x.c}" class="${m&&m.k===x.k?'on':''}">${face(x)}${x.t}</button>`).join('')}</div></div>`:''}`;
    host.querySelectorAll('.nz-btn,.nz-tag').forEach(el=>el.onclick=e=>{ e.stopPropagation(); open=!open; render(); });
    host.querySelectorAll('.nz-grid button').forEach(b=>b.onclick=e=>{ e.stopPropagation();
      state[T]={k:b.dataset.k,t:Date.now()}; save(state); open=false; render(true);
      const img=host.querySelector('.nz-pic'), a='nz-'+cur().a; img.classList.add(a); img.addEventListener('animationend',()=>img.classList.remove(a),{once:false});
      clearTimeout(render.t); render.t=setTimeout(()=>{ const s=host.querySelector('.nz-say'); s&&s.remove(); },5000); });
  }
  document.addEventListener('click',e=>{ if(open&&!host.contains(e.target)){ open=false; render(); } });
  document.addEventListener('keydown',e=>{ if(open&&e.key==='Escape'){ open=false; render(); } });
  render();
})();
