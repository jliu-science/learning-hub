/* ===== Music player: a big button in the top bar. Spotify or your own files. Nothing plays until you choose. ===== */
(function(){
  const store={ get:k=>{ try{ return localStorage.getItem('dora-music-'+k)||''; }catch(e){ return ''; } }, set:(k,v)=>{ try{ localStorage.setItem('dora-music-'+k,v); }catch(e){} } };
  const spEmbed=link=>{ const m=String(link).match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(playlist|album|track|artist)\/([A-Za-z0-9]+)/); return m?`https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator`:null; };

  function build(){
    const bar=document.querySelector('.topbar .wrap'); if(!bar) return;
    const fab=document.createElement('button'); fab.className='music-btn'; fab.innerHTML=`${svgIcon('music',22)}<span>Music</span>`; fab.setAttribute('aria-label','Open music player');
    const xp=bar.querySelector('.xp'); bar.insertBefore(fab, xp);
    // Home button next to Music on every page except the home page itself (same link as the Learning Hub logo)
    const brand=bar.querySelector('.brand'), homeHref=brand&&brand.getAttribute('href');
    if(homeHref&&homeHref!=='#'&&homeHref!=='index.html'){ const home=document.createElement('a'); home.className='home-btn'; home.href=homeHref; home.setAttribute('aria-label','Back to the home page');
      home.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg><span>Home</span>'; bar.insertBefore(home, fab); }
    const p=document.createElement('div'); p.className='mpanel'; p.setAttribute('role','dialog');
    p.innerHTML=`<h3>Study music <button aria-label="Close">×</button></h3>
      <div class="mt"><button data-m="sp" class="on">Spotify</button><button data-m="files">My files</button></div>
      <div data-pane="sp">
        <div class="login"><span>Log in to Spotify first to hear full songs. Without logging in you only get 30-second previews.</span><a class="btn small" href="https://accounts.spotify.com/login" target="_blank" rel="noopener">Log in to Spotify ↗</a></div>
        <input type="text" id="splink" placeholder="Paste a Spotify playlist or song link">
        <div class="row"><button class="btn small" id="spgo">Load</button><span class="hint">In Spotify: ⋯ → Share → Copy link</span></div>
        <div id="spbox"></div>
      </div>
      <div data-pane="files" style="display:none">
        <label class="btn small ghost" style="cursor:pointer">Choose songs…<input type="file" id="mfiles" accept="audio/*" multiple hidden></label>
        <p class="hint" style="margin:6px 0 0">Pick MP3s saved on this computer. Works without internet.</p>
        <audio id="mplay" controls></audio><ol id="mlist"></ol>
      </div>`;
    document.body.appendChild(p);
    const $=s=>p.querySelector(s);
    const tab=m=>{ p.querySelectorAll('.mt button').forEach(x=>x.classList.toggle('on',x.dataset.m===m)); p.querySelectorAll('[data-pane]').forEach(x=>x.style.display=x.dataset.pane===m?'':'none'); store.set('tab',m); };
    p.querySelectorAll('.mt button').forEach(b=>b.onclick=()=>tab(b.dataset.m));
    let first=true;
    fab.onclick=()=>{ p.classList.toggle('open'); if(first){ first=false; if(store.get('sp')) loadSp(store.get('sp'),false); if(store.get('tab')==='files') tab('files'); } };
    $('h3 button').onclick=()=>p.classList.remove('open');
    const bad=(box,msg)=>{ $(box).innerHTML=`<p class="hint" style="color:var(--bad)">${msg}</p>`; };
    function loadSp(link,save){ const u=spEmbed(link); if(!u) return bad('#spbox','That doesn\'t look like a Spotify link. It should start with https://open.spotify.com/');
      if(save) store.set('sp',link); $('#spbox').innerHTML=`<iframe src="${u}" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Spotify player"></iframe>`; fab.classList.add('playing'); }
    $('#splink').value=store.get('sp');
    $('#spgo').onclick=()=>loadSp($('#splink').value.trim(),true);
    $('#splink').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#spgo').click(); });
    let files=[], idx=0; const audio=$('#mplay');
    const play=i=>{ idx=i; audio.src=URL.createObjectURL(files[i]); audio.play(); [...$('#mlist').children].forEach((li,k)=>li.classList.toggle('on',k===i)); };
    $('#mfiles').onchange=e=>{ files=[...e.target.files]; $('#mlist').innerHTML=files.map(f=>`<li>${f.name.replace(/\.[^.]+$/,'').replace(/</g,'&lt;')}</li>`).join(''); [...$('#mlist').children].forEach((li,k)=>li.onclick=()=>play(k)); if(files.length) play(0); };
    audio.onended=()=>{ if(files.length) play((idx+1)%files.length); };
    audio.onplay=()=>fab.classList.add('playing');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
})();
