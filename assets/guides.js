/* ===== Start / next-step guides for the Explore widgets =====
   Kit.after(d, widget) runs after every Explore widget is drawn. It does three things, without changing the widgets:
   - pulses the control for the next step (Kit.guide),
   - moves the explanation box to the top of the picture (Kit.callout),
   - for drag-and-drop widgets, shows a ghost hand dragging the first item to its place. */
(function(){
  const K=window.Kit; if(!K) return;
  const q=(d,s)=>d.querySelector(s), vis=e=>e&&e.offsetParent!==null;
  // ghost-drag the first chip to where it belongs (sorter, matcher, label, …)
  function dragCue(d){ if(d.dataset.cued) return;
    const c=[...d.querySelectorAll('.pool .chip, .eb-tray .eb-tag')].find(vis); if(!c) return;
    const t=c.dataset.bin?q(d,`.bin[data-id="${c.dataset.bin}"]`):c.dataset.i&&q(d,`.mrow[data-i="${c.dataset.i}"]`)||c.dataset.k&&q(d,`.slot[data-i="${c.dataset.k}"]`)||q(d,'.bin, .mrow, .slot, .eb-st, .bl-stage, .dm-z, .stage');
    if(t) K.cue(c,{host:d,ring:true,to:t}); }
  const firstFree=(d,sel)=>[...d.querySelectorAll(sel)].find(e=>vis(e)&&!e.classList.contains('ok')&&e.style.visibility!=='hidden')||null;
  const G={
    /* ---------- chemistry ---------- */
    'Thermometer lab':d=>{ K.callout(q(d,'.stage'),q(d,'#tver'));
      K.guide(d,()=>q(d,'#tver [data-a]')?q(d,'#tver .row'):!q(d,'#tmix').disabled?q(d,'#tmix'):!q(d,'#twait').disabled?q(d,'#twait'):q(d,'#tx')); },
    'Build the diagram':d=>{ const how=q(d,'.lb-how'); if(how) how.remove(); K.callout(q(d,'.stage'),q(d,'#lb-n'),q(d,'#lb-q'),q(d,'#lb-fb'));
      K.guide(d,()=>vis(q(d,'#lb-x'))?q(d,'#lb-x'):q(d,'#lhint').style.display!=='none'?q(d,'#lp'):q(d,'#lb-c')); },
    'Compare fuels':d=>{ const h=q(d,'.ctl .hint'); if(h) h.remove(); K.callout(q(d,'.stage'),q(d,'#fv'));
      const c=firstFree(d,'#fpool .chip'); if(c) K.cue(c,{host:d,ring:true,to:q(d,'#fsvg')}); K.guide(d,()=>firstFree(d,'#fpool .chip')); },
    'Bond energy calculator':d=>{ K.callout(q(d,'.stage'),q(d,'#btxt'),q(d,'#bcalc'),q(d,'#bq'));
      const v=q(d,'.vchip'), sl=q(d,'.bslot'); if(v&&sl) K.cue(v,{host:d,ring:true,to:sl});
      K.guide(d,()=>vis(q(d,'#bnext'))?q(d,'#bnext'):q(d,'#bq button')?q(d,'#bq'):q(d,'.btab')); },
    /* ---------- biology ---------- */
    'Virtual lab':d=>{ K.guide(d,()=>!q(d,'#lf .on')?q(d,'#lf'):!q(d,'#lt .on')?q(d,'#lt'):!q(d,'#run').disabled?q(d,'#run'):null); },
    'Energy balance':d=>{ const v=q(d,'#verdict'), sc=q(d,'.scale'); if(v&&sc){ v.classList.add('k-callout'); sc.parentNode.insertBefore(v,sc); }
      let moved=false; d.querySelectorAll('input[type=range]').forEach(r=>r.addEventListener('input',()=>moved=true)); K.guide(d,()=>moved?null:q(d,'#ein')); },
    'Name each part':d=>{ K.guide(d,()=>vis(q(d,'#sj-next'))?q(d,'#sj-next'):q(d,'#sj-in').value?q(d,'#sj-go'):q(d,'#sj-in')); },
    'How does food move?':d=>{ const m=q(d,'#g-msg'), g=q(d,'svg.gut'); if(m&&g){ m.classList.add('k-callout'); g.parentNode.insertBefore(m,g); }
      let n=0; q(d,'#g-sq').addEventListener('pointerdown',()=>n++); K.guide(d,()=>n<3?q(d,'#g-sq'):null); },
    'Villi and surface area':d=>{ const m=q(d,'#vx-msg'), cv=q(d,'.vx-cv'); if(m&&cv){ m.classList.add('k-callout'); cv.parentNode.insertBefore(m,cv); }
      let went=false; q(d,'#vx-go').addEventListener('click',()=>went=true); K.guide(d,()=>+q(d,'#vx-h').value===0?q(d,'#vx-h'):went?null:q(d,'#vx-go')); },
    'Enzyme workbench':d=>{ const m=q(d,'#eb-msg'), g=q(d,'.eb-grid'); if(m&&g){ m.classList.add('k-callout'); g.parentNode.insertBefore(m,g); } },
    'Bile and lipase':d=>{ const m=q(d,'#bl-msg'), s=q(d,'.bl-stage'); if(m&&s){ m.classList.add('k-callout'); s.parentNode.insertBefore(m,s); } },
    'Where is it digested?':d=>{ let placed=false; d.addEventListener('pointerup',()=>setTimeout(()=>{ placed=!!q(d,'.dm-in .eb-tag, .dm-in .chip, .dm-in [data-t]'); },50));
      K.guide(d,()=>placed&&!q(d,'#dm-res').textContent?q(d,'#dm-check'):null); }
  };
  K.after=(d,w)=>{ const f=G[w.title]; if(f) try{ f(d); }catch(e){ console.warn(e); }
    setTimeout(()=>{ dragCue(d); const inp=q(d,'input[type=text], input:not([type])');
      if(inp&&!G[w.title]) K.guide(d,()=>document.activeElement===inp||inp.value?null:inp); },0); };
})();
