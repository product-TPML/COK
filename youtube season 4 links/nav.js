function injectNav(active) {
  var headerHTML = '<header class="site-header">\
    <div class="header-top">\
      <div class="header-top-inner">\
        <div class="header-top-left">\
          <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Open menu">\
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>\
          </button>\
          <a href="index.html" class="logo"><img src="S5 Logo Rect.png" alt="COK"></a>\
        </div>\
        <div class="header-top-right">\
          <button class="desktop-menu-btn" id="desktop-menu-btn" aria-label="Open menu">\
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>\
          </button>\
        </div>\
      </div>\
    </div>\
    <div class="header-strip">\
      <div class="strip-inner">\
        <div class="strip-divider" style="left:20%"></div>\
        <div class="strip-divider" style="left:40%"></div>\
        <div class="strip-divider" style="left:60%"></div>\
        <div class="strip-divider" style="left:80%"></div>\
        <nav class="strip-nav">\
          <a href="index.html" class="'+(active==='home'?'active':'')+'" data-nav="home"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>Home</a>\
          <a href="recipes.html" class="'+(active==='recipes'?'active':'')+'" data-nav="recipes"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/></svg>Recipes</a>\
          <a href="gallery.html" class="'+(active==='gallery'?'active':'')+'" data-nav="gallery"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="13" cy="7" r="1" fill="currentColor"/><rect x="8" y="2" width="14" height="14" rx="2"/></svg>Gallery</a>\
          <a href="contest.html" class="'+(active==='contest'?'active':'')+'" data-nav="contest"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 8 5.5 8 8v.5"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 16 5.5 16 8v.5"/><path d="M4 16h16"/><path d="M12 4v4"/><path d="M7 16v4a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-4"/></svg>Contest</a>\
          <a href="game.html"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>Game</a>\
        </nav>\
      </div>\
    </div>\
    <div class="mobile-nav" id="mobile-nav">\
      <div class="mobile-nav-panel">\
        <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close menu">\
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>\
        </button>\
        <nav class="mobile-nav-links">\
          <a href="index.html"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>Home</a>\
          <a href="recipes.html"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/></svg>Recipes</a>\
          <a href="gallery.html"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="13" cy="7" r="1" fill="currentColor"/><rect x="8" y="2" width="14" height="14" rx="2"/></svg>Gallery</a>\
          <a href="contest.html" class="'+(active==='contest'?'active':'')+'" data-nav="contest"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 8 5.5 8 8v.5"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 16 5.5 16 8v.5"/><path d="M4 16h16"/><path d="M12 4v4"/><path d="M7 16v4a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-4"/></svg>Contest</a>\
          <a href="game.html"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>Game</a>\
        </nav>\
      </div>\
    </div>\
  </header>\
  <div class="sponsor-bar">\
    <div class="sponsor-container">\
      <div class="sponsor-card">\
        <a href="https://www.freedomhealthyoil.com/" target="_blank" rel="noopener"><img src="https://tpml-sites.s3.ap-south-1.amazonaws.com/images/freedom.png" alt="Presents"></a>\
      </div>\
      <div class="sponsor-slider">\
        <div id="sponsorCarousel1" class="sponsor-carousel">\
          <div class="sponsor-carousel-inner">\
            <div class="sponsor-item active"><a href="https://iocl.com/pages/indane-cooking-gas-overview" target="_blank" rel="noopener"><img src="https://tpml-sites.s3.ap-south-1.amazonaws.com/images/lpg.png" alt="Indane"></a></div>\
            <div class="sponsor-item"><a href="https://ttkprestige.com/" target="_blank" rel="noopener"><img src="https://tpml-sites.s3.ap-south-1.amazonaws.com/images/prestige.png" alt="Prestige"></a></div>\
            <div class="sponsor-item"><a href="https://www.bhimagold.com/" target="_blank" rel="noopener"><img src="https://tpml-sites.s3.ap-south-1.amazonaws.com/images/bhima.png" alt="Bhima Gold"></a></div>\
            <div class="sponsor-item"><a href="https://www.lays.com/" target="_blank" rel="noopener"><img src="https://tpml-sites.s3.ap-south-1.amazonaws.com/images/lays.png" alt="Lays"></a></div>\
          </div>\
        </div>\
      </div>\
      <div class="sponsor-slider">\
        <div id="sponsorCarousel2" class="sponsor-carousel">\
          <div class="sponsor-carousel-inner">\
            <div class="sponsor-item active"><a href="https://www.sbicard.com/" target="_blank" rel="noopener"><img src="https://tpml-sites.s3.ap-south-1.amazonaws.com/images/sbi.png" alt="SBI Card"></a></div>\
            <div class="sponsor-item"><a href="https://vencobbchicken.com/" target="_blank" rel="noopener"><img src="https://tpml-sites.s3.ap-south-1.amazonaws.com/images/vencobb.png" alt="Vencobb"></a></div>\
            <div class="sponsor-item"><a href="https://www.ecocrystal.in/" target="_blank" rel="noopener"><img src="https://tpml-sites.s3.ap-south-1.amazonaws.com/images/eco-crystal.png" alt="Eco Crystal"></a></div>\
          </div>\
        </div>\
      </div>\
    </div>\
  </div>';

  var bottomHTML = '<nav class="bottom-nav">\
    <div class="bottom-nav-inner">\
      <a href="index.html" class="bottom-nav-item'+(active==='home'?' active':'')+'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>Home</a>\
      <a href="recipes.html" class="bottom-nav-item'+(active==='recipes'?' active':'')+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/></svg>Recipes</a>\
      <a href="gallery.html" class="bottom-nav-item'+(active==='gallery'?' active':'')+'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="13" cy="7" r="1" fill="currentColor"/><rect x="8" y="2" width="14" height="14" rx="2"/></svg>Gallery</a>\
      <a href="contest.html" class="bottom-nav-item'+(active==='contest'?' active':'')+'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 8 5.5 8 8v.5"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 16 5.5 16 8v.5"/><path d="M4 16h16"/><path d="M12 4v4"/><path d="M7 16v4a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-4"/></svg>Contest</a>\
      <a href="game.html" class="bottom-nav-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>Game</a>\
    </div>\
  </nav>';

  document.getElementById('nav-header').innerHTML = headerHTML;
  document.getElementById('nav-bottom').innerHTML = bottomHTML;

  /* Mobile nav handlers */
  setTimeout(function() {
    var mn = document.getElementById('mobile-nav');
    var mnc = document.getElementById('mobile-nav-close');
    var mmb = document.getElementById('mobile-menu-btn');
    var dmb = document.getElementById('desktop-menu-btn');
    function open() { mn.classList.add('open'); }
    function close() { mn.classList.remove('open'); }
    if (mnc) mnc.addEventListener('click', close);
    if (mn) mn.addEventListener('click', function(e) { if (e.target === mn) close(); });
    if (mmb) mmb.addEventListener('click', open);
    if (dmb) dmb.addEventListener('click', open);

    /* Sponsor carousels */
    function rotateSponsor(id) {
      var outer = document.getElementById(id);
      if (!outer) return;
      var items = outer.querySelectorAll('.sponsor-item');
      var current = outer.querySelector('.sponsor-item.active');
      var next = current && current.nextElementSibling ? current.nextElementSibling : items[0];
      current.classList.remove('active');
      next.classList.add('active');
    }
    setInterval(function() { rotateSponsor('sponsorCarousel1'); }, 3000);
    setInterval(function() { rotateSponsor('sponsorCarousel2'); }, 3000);
  }, 0);
}
