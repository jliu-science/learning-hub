/* ===== Villi: hands-on model. Grow the villi, release digested food, watch it absorbed into the blood ===== */
(function(){
  const W = window.DigestionWidgets;
  const VW = 900, VH = 380;                 // model coordinates
  const BASE = 250, BLOOD = 330;           // top of the wall, centre of the blood vessel
  const N = 9, VWID = 46, R = VWID/2;      // number of villi, width of each villus
  const COLS = ['#e0702a','#2fa36b','#3b6fd8','#c0398b'];

  W.villi = function(el, U){
    el.innerHTML = `
      <div class="vx">
        <div class="vx-main">
          <canvas class="vx-cv" aria-label="Model of the small intestine wall"></canvas>
          <div class="vx-ctl">
            <label class="vx-sl"><span>Flat wall</span><input type="range" id="vx-h" min="0" max="100" value="0"><span>Villi</span></label>
            <div class="row"><button class="btn small" id="vx-go">Release digested food</button><button class="btn small ghost" id="vx-cap">Hide capillaries</button></div>
          </div>
        </div>
        <aside class="vx-side">
          <div class="vx-stat"><b id="vx-sa">1.0×</b><span>surface area</span></div>
          <div class="vx-stat"><b id="vx-ab">0</b><span>absorbed into the blood</span></div>
          <div class="vx-stat"><b id="vx-lost">0</b><span>passed on, not absorbed</span></div>
          <div class="vx-bar"><i id="vx-pc"></i></div>
          <p class="vx-msg" id="vx-msg">Drag the slider to grow villi on the wall, then release some digested food.</p>
          <figure class="vx-photo"><img src="img/villi-photo.jpg" alt="Photo of villi in the small intestine, from the textbook"><figcaption>Real villi, from your textbook (page 139).</figcaption></figure>
        </aside>
      </div>`;
    const $ = s => el.querySelector(s);
    const cv = $('.vx-cv'), ctx = cv.getContext('2d');
    let t = 0, target = 0, caps = true, parts = [], absorbed = 0, lost = 0, released = 0, raf = 0, running = false, lastRun = null;

    /* geometry */
    const centres = Array.from({length:N}, (_,i)=> (i+0.5)*VW/N);
    const vh = () => 150*t;                                  // villus height
    function surfaceY(x){                                    // top edge of the wall at x
      const h = vh(); if(h < 1) return BASE;
      for(const c of centres){ const dx = Math.abs(x-c); if(dx <= R){ const top = BASE - h + R; return dx < R ? top - Math.sqrt(R*R-dx*dx) : top; } }
      return BASE;
    }
    const surfaceRatio = () => { const h=vh(); if(h<1) return 1; const add = N*(2*Math.max(0,h-R) + Math.PI*R - VWID); return (VW+add)/VW; };

    function outline(){                                      // path of the absorbing surface
      const p = new Path2D(); const h = vh(); p.moveTo(0,BASE);
      centres.forEach(c=>{
        if(h < 1){ return; }
        const top = BASE - h + R;
        p.lineTo(c-R, BASE); p.lineTo(c-R, Math.min(BASE, top)); p.arc(c, Math.min(BASE,top), R, Math.PI, 0); p.lineTo(c+R, BASE);
      });
      p.lineTo(VW,BASE); return p;
    }

    function draw(){
      const dpr = window.devicePixelRatio||1, w = cv.clientWidth, hpx = w*VH/VW;
      if(cv.width !== Math.round(w*dpr)){ cv.width = Math.round(w*dpr); cv.height = Math.round(hpx*dpr); }
      ctx.setTransform(cv.width/VW,0,0,cv.height/VH,0,0);
      ctx.clearRect(0,0,VW,VH);
      // inside of the gut
      ctx.fillStyle = '#fbf6ea'; ctx.fillRect(0,0,VW,VH);
      ctx.fillStyle = '#8a7f6a'; ctx.font = '600 15px "IBM Plex Mono", monospace'; ctx.fillText('INSIDE THE SMALL INTESTINE  →  food moves along', 14, 24);
      // wall tissue
      const o = outline(); const body = new Path2D(o); body.lineTo(VW,VH); body.lineTo(0,VH); body.closePath();
      ctx.fillStyle = '#f2c4bd'; ctx.fill(body);
      // blood vessel
      ctx.fillStyle = '#d64545'; ctx.fillRect(0, BLOOD-16, VW, 32);
      ctx.fillStyle = '#fff'; ctx.font = '700 15px "Atkinson Hyperlegible", sans-serif'; ctx.fillText('blood  →  carried around the body', 14, BLOOD+5);
      // capillaries inside each villus
      const h = vh();
      if(caps && h > 20){
        ctx.lineWidth = 3; ctx.lineCap='round';
        centres.forEach(c=>{
          const top = BASE - h + R;
          ctx.strokeStyle = '#d64545';
          ctx.beginPath(); ctx.moveTo(c-9, BLOOD-16); ctx.lineTo(c-9, top); ctx.arc(c, top, 9, Math.PI, 0); ctx.lineTo(c+9, BLOOD-16); ctx.stroke();
          ctx.lineWidth = 1.6;
          for(let y = top+22; y < BASE-6; y += 22){ ctx.beginPath(); ctx.moveTo(c-9,y); ctx.quadraticCurveTo(c, y+8, c+9, y-4); ctx.stroke(); }
          ctx.lineWidth = 3;
        });
      }
      // thin wall: one cell thick edge
      ctx.strokeStyle = '#b5524e'; ctx.lineWidth = 3; ctx.stroke(o);
      ctx.strokeStyle = 'rgba(181,82,78,.35)'; ctx.lineWidth = 9; ctx.stroke(o);
      // particles
      parts.forEach(p=>{ ctx.fillStyle = p.c; ctx.globalAlpha = p.state==='in'?0.9:1; ctx.beginPath();
        if(p.k%2){ for(let a=0;a<6;a++){ const ang=a*Math.PI/3; ctx.lineTo(p.x+7*Math.cos(ang), p.y+7*Math.sin(ang)); } } else ctx.arc(p.x,p.y,6.5,0,7);
        ctx.fill(); });
      ctx.globalAlpha = 1;
      // labels once the villi are tall
      if(t > .55){
        const c = centres[6], top = BASE - h;
        label('villus', c+R+6, top+30, c+R-2, top+34);
        label('thin wall', centres[2]+R+8, BASE-h*.45, centres[2]+R, BASE-h*.45);
        if(caps) label('blood capillaries', centres[4]+R+10, BASE-24, centres[4]+9, BASE-30);
      }
    }
    function label(txt, x, y, ax, ay){
      ctx.font = '700 15px "Atkinson Hyperlegible", sans-serif'; const w = ctx.measureText(txt).width + 12;
      ctx.strokeStyle = '#222'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(x,y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fillRect(x, y-14, w, 22); ctx.fillStyle = '#222'; ctx.fillText(txt, x+6, y+2);
    }

    function stats(){
      $('#vx-sa').textContent = surfaceRatio().toFixed(1)+'×';
      $('#vx-ab').textContent = absorbed; $('#vx-lost').textContent = lost;
      $('#vx-pc').style.width = released ? (absorbed/released*100)+'%' : '0';
    }

    function release(){
      for(let i=0;i<70;i++) parts.push({x:-Math.random()*360, y:40+Math.random()*(BASE-60), vy:0, c:COLS[i%4], k:i, state:'free'});
      released += 70; if(!lastRun) lastRun = {t, ab:absorbed, lost}; running = true; loop();
    }

    function step(){
      parts.forEach(p=>{
        if(p.state==='free'){
          p.x += 2.1; p.vy += (Math.random()-0.49)*0.9; p.vy *= .9; p.y += p.vy;
          if(p.y < 36) { p.y = 36; p.vy = Math.abs(p.vy); }
          if(p.y >= surfaceY(p.x) - 3 && p.x > 0){ p.state = 'in'; p.c = '#8c1d1d'; }        // touched the wall: absorbed
          else if(p.x > VW+8){ p.state = 'gone'; lost++; }
        } else if(p.state==='in'){
          // into the capillary, then down to the blood
          const c = centres.reduce((a,b)=> Math.abs(b-p.x)<Math.abs(a-p.x)?b:a);
          const inVillus = vh()>20 && Math.abs(p.x-c) < R;
          if(inVillus){ p.x += (c-9-p.x)*.2; p.y += 3.2; } else { p.y += 2.6; }
          if(p.y >= BLOOD){ p.state = 'blood'; absorbed++; p.c = '#ffffff'; }
        } else if(p.state==='blood'){
          p.x += 4; p.y = BLOOD + Math.sin(p.x/20)*5; if(p.x > VW+8) p.state = 'done';
        }
      });
      parts = parts.filter(p=> p.state!=='gone' && p.state!=='done');
    }

    function loop(){
      cancelAnimationFrame(raf);
      const tick = () => {
        t += (target - t)*0.12; if(Math.abs(target-t) < .002) t = target;
        if(running) step();
        draw(); stats();
        const busy = parts.some(p=>p.state==='free'||p.state==='in');
        if(running && !busy && !parts.length){ running = false; finish(); }
        if(running || t !== target || parts.length) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    function finish(){
      const pc = released ? Math.round(absorbed/released*100) : 0;
      const msg = $('#vx-msg');
      if(target < .2) msg.innerHTML = `<b>${pc}% absorbed.</b> With a flat wall there is only a small surface, so most of the food passed on before it could be absorbed. Now grow the villi and try again.`;
      else if(target < .8) msg.innerHTML = `<b>${pc}% absorbed.</b> Better. Taller villi stick further out of the wall, giving a bigger surface area. Try them at full height.`;
      else msg.innerHTML = `<b>${pc}% absorbed.</b> The villi give a <b>big surface area</b>, so more nutrients are absorbed <b>quickly</b>, before the undigested food passes out of the body. Nutrients pass through the <b>thin wall</b> into the blood, and the <b>blood capillaries</b> carry them away.`;
      lastRun = null;
      $('#vx-go').textContent = 'Release digested food';
    }

    $('#vx-h').oninput = e => { target = e.target.value/100; loop(); };
    $('#vx-go').onclick = () => { if(running) return; released = 0; absorbed = 0; lost = 0; $('#vx-go').textContent = 'Food moving…';
      $('#vx-msg').textContent = 'Watch the small nutrient molecules. Any that touch the wall are absorbed and carried into the blood.'; release(); };
    $('#vx-cap').onclick = () => { caps = !caps; $('#vx-cap').textContent = caps ? 'Hide capillaries' : 'Show capillaries'; draw(); };
    window.addEventListener('resize', draw);
    requestAnimationFrame(()=>{ draw(); stats(); });
  };
})();
