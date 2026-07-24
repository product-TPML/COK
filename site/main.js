/* ============================================================
   COK — Single-Page App Main
   Hash routing, nav, section init, merged game loop
   ============================================================ */
(function () {
  'use strict';

  var BASE = 'https://product-tpml.github.io/COK/site/';
  var ASSETS = BASE + 'assets/';
  var SVG_DIR = BASE + 'svg/';

  // ---- SEASON / VIDEO DATA (deduplicated) ----
  var seasons = [
    {
      number: 4,
      playlist: 'PL4tXltXT0TCWhrTT31fLGpTr2VoHHHov5',
      videos: [
        { id: '9ig2P5uQeLo', episode: 1, title: 'White Chicken Pulao | Karnataka-Style Recipe' },
        { id: 'xNlR6VPTUOc', episode: 2, title: 'Naati Koli Bassaru | Authentic Country Chicken Curry' },
        { id: 'nol4d9eqjyo', episode: 3, title: 'The Easiest Mutton Fry Ever' },
        { id: 'rtLm3RqLnLc', episode: 4, title: 'Authentic Mutton Kheema Vade' },
        { id: 'Pc1QVxb2V4s', episode: 5, title: "Bengaluru's Famous Kaal Soup" },
        { id: 'SO9jaLxrPsQ', episode: 6, title: 'Kanakapura Style River Fish Curry' },
        { id: 's5jHf8M_hSE', episode: 7, title: 'Kollegal Style Mutton Pulao with Nalli' },
        { id: 'pESOxDDF7B4', episode: 8, title: 'Kadle Manoli | Ivy Gourd & Black Chickpeas' },
        { id: 'rsJy07KbZhE', episode: 9, title: 'Deepavali Special Batani Kurma' },
        { id: 'oFWVuSiZZ64', episode: 10, title: 'Raichur Tuntapur Chicken' },
        { id: 'jz7W4rcZYOs', episode: 11, title: 'Crispy Bonda + Dal Soup' },
        { id: 'L-j5T-ZQdMg', episode: 12, title: 'Cucumber Curry Karnataka Style' },
        { id: 'z9Zb3HCb29M', episode: 13, title: "Karnataka's Beloved Avarekalu Curry" },
        { id: '4dMkfUiECkc', episode: 15, title: 'Hurugadle Nippattu Festive Snack' },
        { id: 'u1rGS26Likc', episode: 16, title: 'Traditional Crunchy Jackfruit Snack | Halasina Mulka' },
      ]
    },
    {
      number: 3,
      playlist: 'PL4tXltXT0TCU5bijdggUhhp65gaUXp1Pd',
      videos: [
        { id: 'JwCSxMWWQ-g', episode: 1, title: 'Spicy Mutton Nalli Fry: The Unexpected Star' },
        { id: 'pZ3pfJVNCms', episode: 2, title: 'This Smoked Boneless Chicken Fry' },
        { id: 'U1Co_jCbsfQ', episode: 3, title: 'Mysuru Mutton Chops' },
        { id: 'gnMbEjUvhGg', episode: 4, title: 'Saoji-Style Mutton Khara Boti' },
        { id: 'mwJB5Z0vdY0', episode: 5, title: 'Spicy & Tangy Prawn Pulimunchi' },
        { id: 'WdwTo9qc03I', episode: 6, title: 'Beetroot Veg Soya Pulao' },
        { id: 'huescaAAIlY', episode: 7, title: 'How to Make Raw Banana Curry' },
        { id: 'H4F_s68bfdM', episode: 8, title: 'Hubballi Mutton Green Curry' },
        { id: 'hyNhPulo2Ec', episode: 9, title: 'Dandeli Chicken Kadai Roast' },
        { id: 'Sz25EkQMHys', episode: 10, title: 'Easy Malnad Chicken Curry' },
        { id: 'YxZ8gZnjCks', episode: 11, title: 'Hurali Kaalu Bassaaru' },
        { id: 'wuL4uL5Gmoc', episode: 12, title: 'Paneer Ghee Roast' },
        { id: 'CHzGK7qoJJE', episode: 13, title: 'Dasara Special Crisp Karjikai' },
        { id: 'hJ42w9Og0ek', episode: 14, title: 'Akki Kadlebele Payasa' },
        { id: 'sd1dJ3WrL-M', episode: 15, title: 'Perfect Sajjige for Satyanarayana Pooja' },
      ]
    },
    {
      number: 2,
      playlist: 'PL4tXltXT0TCVjk9lcnaWtr4bXFaqYURaF',
      videos: [
        { id: 'pTgU87_KKG0', episode: 1, title: 'Egg Curry with a Twist' },
        { id: '5ZMBCI1I-ZQ', episode: 2, title: 'Restaurant Style Chicken Sukka' },
        { id: '0lKYSrr_mRs', episode: 3, title: 'Fish Curry from Coastal Karnataka' },
        { id: '8FUL1OQxisA', episode: 4, title: 'Coorg Chicken with a Secret Ingredient' },
        { id: 'FcqBPAK66c0', episode: 5, title: "Puneeth Rajkumar's Favourite Biryani" },
        { id: '005KpLOOymM', episode: 6, title: 'Gadagi Mutton Masala Bijapur Style' },
        { id: 'CMaL5byAyQk', episode: 7, title: 'Authentic Ankola Konkani Fish Recipe' },
        { id: 'V6CfmwQCrZc', episode: 8, title: 'Hubli Dharwad Street Style Girmit' },
        { id: 'tzFp4sx3o20', episode: 9, title: 'Donna Menasinakai Palya' },
        { id: 'qayD-b28ArE', episode: 10, title: 'Wadi-style Chicken Biryani' },
        { id: 'PjprZ1H-WFo', episode: 11, title: 'Scrumptious Goli Bajji' },
        { id: 'TQioXkVR0Uk', episode: 12, title: 'Thalipattu | Akki Rotti' },
        { id: '_DUEnhjSMAE', episode: 13, title: 'Vangi Bath | Brinjal Rice' },
        { id: 'rgtzrW2aWbA', episode: 14, title: 'Special Chiroti for Dasara' },
        { id: 'BVTgsE8afmg', episode: 15, title: 'Badam Puri' },
      ]
    },
    {
      number: 1,
      playlist: 'PL4tXltXT0TCWC5CzGx_f7DhNXw0D24GXz',
      videos: [
        { id: '_BHnfdWDKYw', episode: 1, title: 'How to make Donne Biryani' },
        { id: '583WfxFQiU8', episode: 2, title: "Donne Biryani | Bengaluru's own biryani" },
        { id: 'H-nUl7If054', episode: 3, title: 'How to make Nati Koli Masala and Palak Poori' },
        { id: 'zSr-ss5r6-0', episode: 4, title: 'Nati Koli Masala and Palak Poori' },
        { id: '6hugJyRqylc', episode: 5, title: 'How to make Prawn Fry' },
        { id: 'jhJhsAiVHyE', episode: 6, title: 'Prawn Fry | Spicy tasty appetiser' },
        { id: '5tQoXV1nLvs', episode: 7, title: 'How to make Mutton Pepper Fry' },
        { id: 'fpFX2o4HKKI', episode: 8, title: 'Mutton Pepper Fry | Lip-smacking favourite' },
        { id: 'JccvJGfzUpk', episode: 9, title: 'How to make Kane Rava Fry' },
        { id: 'Pys2TonUk0w', episode: 10, title: "Kane Rava Fry | Karnataka's coastal favorite" },
        { id: '10MHb34MjuI', episode: 11, title: 'How to make Maddur Vada' },
        { id: 'rg24GX7MbGA', episode: 12, title: 'Maddur Vada' },
        { id: 'PUmpM8MfTMo', episode: 13, title: 'How to make Ennegayi' },
        { id: 'XjvaRWnqjVI', episode: 14, title: 'Ennegayi | Super hit from North Karnataka' },
        { id: 'W9kFbnnZj34', episode: 15, title: 'How to make Puliyogare' },
      ]
    }
  ];

  // ---- GALLERY IMAGE DATA (deduplicated) ----
  var galleryImages = [
    "20-hubli-18-Cuisines of Karnataka.JPG", "20-hubli-19-Cuisines of Karnataka.JPG",
    "20-hubli-2-Cuisines of Karnataka.JPG", "BNG31 FOOD award 05.jpg",
    "DSC_0790.jpg",
    "MNG 22 Participants (2).jpg", "MNG 22 Winners (1).jpg",
    "MYS23 - PV - Cuisines Karnataka 1.jpg", "MYS23 - PV - Cuisines Karnataka 17.jpg",
    "MYS23 - PV - Cuisines Karnataka 23.jpg", "MYS23 - PV - Cuisines Karnataka 31.jpg",
    "MYS23 - PV - Cuisines Karnataka 32.jpg", "MYS23 - PV - Cuisines Karnataka 35.jpg",
    "MYS23 - PV - Cuisines Karnataka 38.jpg", "MYS23 - PV - Cuisines Karnataka 49.jpg",
    "MYS23 - PV - Cuisines Karnataka 54.jpg",
    "MYS30 - PV-DH Karunadu Saviyuta 1.jpg", "MYS30 - PV-DH Karunadu Saviyuta 25.jpg",
    "MYS30 - PV-DH Karunadu Saviyuta 28.jpg", "MYS30 - PV-DH Karunadu Saviyuta 3.jpg"
  ];

  // ---- HASH ROUTING ----
  var currentSection = '';
  var initialised = { home: false, recipes: false, gallery: false, contest: false, game: false };
  var gameActive = false;

  function showSection(id) {
    if (id === currentSection && id !== 'game') return; // allow re-init for game
    // Hide all sections
    document.querySelectorAll('.section').forEach(function (s) { s.classList.remove('active-section'); });
    // Show target
    var el = document.getElementById(id);
    if (el) el.classList.add('active-section');
    currentSection = id;

    // Update nav active state
    setActiveNav(id);

    // Init section once
    if (!initialised[id]) {
      initialised[id] = true;
      initSection(id);
    }

    // Game-mode shell hiding
    if (id === 'game') {
      document.body.classList.add('game-active');
      // Close any open mobile drawer
      var mn = document.getElementById('mobile-nav');
      if (mn) mn.classList.remove('open');
    } else {
      document.body.classList.remove('game-active');
    }

    // Game lifecycle
    if (id === 'game') {
      resumeGame();
    } else {
      pauseGame();
    }
  }

  function getHash() {
    var h = window.location.hash.replace(/^#/, '') || 'home';
    if (['home', 'recipes', 'gallery', 'contest', 'game'].indexOf(h) === -1) h = 'home';
    return h;
  }

  function onHashChange() {
    showSection(getHash());
  }

  // ---- NAV ----
  function setActiveNav(id) {
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === id);
    });
  }

  // ---- SECTION INIT ----
  function initSection(id) {
    switch (id) {
      case 'home': initHome(); break;
      case 'recipes': initRecipes(); break;
      case 'gallery': initGallery(); break;
      case 'contest': initContest(); break;
      case 'game': initGame(); break;
    }
  }

  // ===== HOME =====
  function initHome() {
    /* Featured video carousel */
    buildFeaturedCarousel();
    /* Gallery carousel + lightbox */
    buildHomeGalleryCarousel();
  }

  function buildFeaturedCarousel() {
    var container = document.getElementById('featuredCarousel');
    if (!container || !seasons || !seasons[0]) return;
    var s4 = seasons[0];
    s4.videos.forEach(function (video) {
      var card = document.createElement('div');
      card.className = 'carousel-card';
      var embedUrl = 'https://www.youtube.com/embed/' + video.id + '?autoplay=1&list=' + s4.playlist + '&index=' + video.episode;
      card.innerHTML = '<div class="video-wrapper">\
          <div class="poster" role="button">\
            <img src="https://img.youtube.com/vi/' + video.id + '/hqdefault.jpg" alt="" loading="lazy">\
            <div class="play-overlay"><div class="play-btn"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg></div></div>\
          </div>\
          <div class="player"></div>\
        </div>\
        <div class="info"><div class="ep">Episode ' + video.episode + '</div><div class="title">' + video.title + '</div></div>';
      card.querySelector('.poster').addEventListener('click', function () {
        if (card.classList.contains('active')) return;
        card.classList.add('active');
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', embedUrl);
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        card.querySelector('.player').appendChild(iframe);
      });
      container.appendChild(card);
    });
  }

  function buildHomeGalleryCarousel() {
    var container = document.getElementById('galleryCarousel');
    if (!container) return;
    var glb = document.getElementById('galleryLightbox');
    var glbImg = document.getElementById('glbImg');
    var glbIdx = 0;

    galleryImages.forEach(function (name, idx) {
      var src = ASSETS + encodeURI(name);
      var card = document.createElement('div');
      card.className = 'carousel-card';
      card.innerHTML = '<img class="thumb" src="' + src + '" alt="" loading="lazy">';
      card.addEventListener('click', function () { openLightbox(idx); });
      container.appendChild(card);
    });

    function openLightbox(idx) {
      glbIdx = idx;
      glbImg.src = ASSETS + encodeURI(galleryImages[idx]);
      document.getElementById('glbCounter').textContent = (idx + 1) + ' / ' + galleryImages.length;
      glb.classList.add('open');
    }

    function prevGLB() { openLightbox((glbIdx - 1 + galleryImages.length) % galleryImages.length); }
    function nextGLB() { openLightbox((glbIdx + 1) % galleryImages.length); }

    var glbClose = document.getElementById('glbClose');
    var glbPrev = document.getElementById('glbPrev');
    var glbNext = document.getElementById('glbNext');

    glb.addEventListener('click', function (e) { if (e.target === glb) glb.classList.remove('open'); });
    glbClose.addEventListener('click', function (e) { e.stopPropagation(); glb.classList.remove('open'); });
    glbPrev.addEventListener('click', function (e) { e.stopPropagation(); prevGLB(); });
    glbNext.addEventListener('click', function (e) { e.stopPropagation(); nextGLB(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') glb.classList.remove('open');
      if (e.key === 'ArrowLeft' && glb.classList.contains('open')) prevGLB();
      if (e.key === 'ArrowRight' && glb.classList.contains('open')) nextGLB();
    });
    var glbTouch = 0;
    glb.addEventListener('touchstart', function (e) { glbTouch = e.changedTouches[0].clientX; }, { passive: true });
    glb.addEventListener('touchend', function (e) {
      if (!glb.classList.contains('open')) return;
      var dx = e.changedTouches[0].clientX - glbTouch;
      if (Math.abs(dx) > 40) { if (dx < 0) nextGLB(); else prevGLB(); }
    }, { passive: true });
  }

  // ===== RECIPES =====
  function initRecipes() {
    var grid = document.getElementById('video-grid');
    var tabsContainer = document.getElementById('season-tabs');
    var footerText = document.querySelector('#recipes footer p');
    var currentSeason = 0;

    function buildCard(video, index, season) {
      var card = document.createElement('article');
      card.className = 'card';
      card.style.setProperty('--i', index);
      var playlistIndex = index + 1;
      var embedUrl = 'https://www.youtube.com/embed/' + video.id + '?autoplay=1&list=' + season.playlist + '&index=' + playlistIndex;
      var thumbUrl = 'https://img.youtube.com/vi/' + video.id + '/hqdefault.jpg';
      card.innerHTML = '\
        <div class="video-wrapper">\
          <div class="poster" role="button" aria-label="Play Episode ' + video.episode + '">\
            <img src="' + thumbUrl + '" alt="Episode ' + video.episode + ' thumbnail" loading="lazy">\
            <div class="play-overlay">\
              <div class="play-btn">\
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>\
              </div>\
            </div>\
            <span class="loading-hint">Click to load video</span>\
          </div>\
          <div class="player"></div>\
        </div>\
        <div class="card-info">\
          <div class="episode-label">Episode ' + video.episode + '</div>\
          <div class="episode-title">' + video.title + '</div>\
        </div>';

      var poster = card.querySelector('.poster');
      var playerContainer = card.querySelector('.player');

      poster.addEventListener('click', function () {
        if (card.classList.contains('active')) return;
        var prevActive = grid.querySelector('.card.active');
        if (prevActive) {
          prevActive.classList.remove('active');
          var prevPlayer = prevActive.querySelector('.player');
          if (prevPlayer) prevPlayer.innerHTML = '';
        }
        card.classList.add('active');
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', embedUrl);
        iframe.setAttribute('title', 'YouTube video player - Episode ' + video.episode);
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        playerContainer.appendChild(iframe);
      });
      return card;
    }

    function renderSeason(index, onDone) {
      var season = seasons[index];
      footerText.textContent = 'Playlist: ' + season.playlist;
      tabsContainer.querySelectorAll('.season-tab').forEach(function (btn, i) {
        btn.classList.toggle('active', i === index);
      });
      grid.classList.add('switching');
      setTimeout(function () {
        grid.innerHTML = '';
        season.videos.forEach(function (video, i) {
          grid.appendChild(buildCard(video, i, season));
        });
        grid.classList.remove('switching');
        if (onDone) onDone();
      }, 220);
    }

    seasons.forEach(function (s, i) {
      var btn = document.createElement('button');
      btn.className = 'season-tab';
      btn.textContent = 'Season ' + s.number;
      btn.addEventListener('click', function () {
        if (i === currentSeason) return;
        currentSeason = i;
        renderSeason(i);
      });
      tabsContainer.appendChild(btn);
    });

    renderSeason(0);

    // Jump panel
    var jumpFab = document.getElementById('jump-fab');
    var jumpOverlay = document.getElementById('jump-overlay');
    var jumpPanel = document.getElementById('jump-panel');
    var jumpClose = document.getElementById('jump-close');
    var jumpPanelBody = document.getElementById('jump-panel-body');
    var jumpSearchInput = document.getElementById('jump-search-input');
    var jumpSearchClear = document.getElementById('jump-search-clear');
    var jumpEpisodeItems = [];

    function buildJumpPanel() {
      jumpPanelBody.innerHTML = '';
      jumpEpisodeItems = [];
      seasons.forEach(function (season) {
        var group = document.createElement('div');
        group.className = 'jump-season-group';
        var label = document.createElement('div');
        label.className = 'jump-season-label';
        label.textContent = 'Season ' + season.number;
        group.appendChild(label);
        season.videos.forEach(function (video, idx) {
          var item = document.createElement('div');
          item.className = 'jump-episode';
          item.dataset.title = video.title.toLowerCase();
          item.innerHTML = '<span class="jump-episode-num">' + video.episode + '</span><span class="jump-episode-title">' + video.title + '</span>';
          item.addEventListener('click', function () {
            closeJumpPanel();
            var seasonIdx = seasons.indexOf(season);
            if (seasonIdx !== currentSeason) {
              currentSeason = seasonIdx;
              renderSeason(seasonIdx, function () {
                var card = grid.children[idx];
                if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'start' }); highlightCard(card); }
              });
            } else {
              var card = grid.children[idx];
              if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'start' }); highlightCard(card); }
            }
          });
          group.appendChild(item);
          jumpEpisodeItems.push({ item: item, group: group });
        });
        jumpPanelBody.appendChild(group);
      });
    }

    function highlightCard(card) {
      if (!card) return;
      card.classList.remove('highlight');
      void card.offsetWidth;
      card.classList.add('highlight');
    }

    function filterJumpPanel(query) {
      var q = query.trim().toLowerCase();
      jumpSearchClear.classList.toggle('visible', q.length > 0);
      jumpEpisodeItems.forEach(function (ep) {
        var matches = !q || ep.item.dataset.title.includes(q);
        ep.item.style.display = matches ? '' : 'none';
      });
      jumpPanelBody.querySelectorAll('.jump-season-group').forEach(function (group) {
        var visible = group.querySelectorAll('.jump-episode:not([style*="display: none"])').length > 0;
        group.style.display = visible ? '' : 'none';
      });
    }

    function openJumpPanel() {
      jumpOverlay.classList.add('open');
      jumpPanel.classList.add('open');
      jumpSearchInput.focus();
    }

    function closeJumpPanel() {
      jumpOverlay.classList.remove('open');
      jumpPanel.classList.remove('open');
      jumpSearchInput.value = '';
      filterJumpPanel('');
    }

    jumpFab.addEventListener('click', openJumpPanel);
    jumpClose.addEventListener('click', closeJumpPanel);
    jumpOverlay.addEventListener('click', closeJumpPanel);
    jumpSearchInput.addEventListener('input', function (e) { filterJumpPanel(e.target.value); });
    jumpSearchClear.addEventListener('click', function () {
      jumpSearchInput.value = '';
      filterJumpPanel('');
      jumpSearchInput.focus();
    });

    buildJumpPanel();
  }

  // ===== GALLERY =====
  function initGallery() {
    var grid = document.getElementById('galleryGrid');
    var lightbox = document.getElementById('gLightbox');
    var lightboxImg = document.getElementById('gLightboxImg');
    var lightboxClose = document.getElementById('gLightboxClose');
    var lbPrev = document.getElementById('gLbPrev');
    var lbNext = document.getElementById('gLbNext');
    var lbCounter = document.getElementById('gLbCounter');
    var currentIdx = 0;

    function openLightbox(idx) {
      currentIdx = idx;
      lightboxImg.src = ASSETS + encodeURI(galleryImages[idx]);
      lbCounter.textContent = (idx + 1) + ' / ' + galleryImages.length;
      lightbox.classList.add('open');
    }

    function nextImage() { openLightbox((currentIdx + 1) % galleryImages.length); }
    function prevImage() { openLightbox((currentIdx - 1 + galleryImages.length) % galleryImages.length); }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var item = e.target;
        var src = item.dataset.src;
        item.querySelector('img').src = src;
        item.querySelector('.gallery-item-bg').style.backgroundImage = 'url(' + src + ')';
        io.unobserve(item);
      });
    }, { rootMargin: '200px' });

    galleryImages.forEach(function (name, idx) {
      var src = ASSETS + encodeURI(name);
      var item = document.createElement('div');
      item.className = 'gallery-item';
      item.dataset.src = src;
      item.innerHTML = '<div class="gallery-item-bg"></div><img alt="">';
      item.addEventListener('click', function () { openLightbox(idx); });
      grid.appendChild(item);
      io.observe(item);
    });

    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.classList.remove('open'); });
    lightboxClose.addEventListener('click', function (e) { e.stopPropagation(); lightbox.classList.remove('open'); });
    lbPrev.addEventListener('click', function (e) { e.stopPropagation(); prevImage(); });
    lbNext.addEventListener('click', function (e) { e.stopPropagation(); nextImage(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowLeft' && lightbox.classList.contains('open')) prevImage();
      if (e.key === 'ArrowRight' && lightbox.classList.contains('open')) nextImage();
    });

    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (!lightbox.classList.contains('open')) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { if (dx < 0) nextImage(); else prevImage(); }
    }, { passive: true });
  }

  // ===== CONTEST =====
  function initContest() {
    // Static content, no dynamic init needed
  }

  // ===== GAME =====
  var gameRAF = null;

  /* ---- DATA ---- */
  var ALL_INGREDIENTS = [
    'Chicken', 'Mutton', 'Fish', 'Rice', 'Coconut', 'Curry Leaves', 'Mustard',
    'Tamarind', 'Garlic', 'Ginger', 'Pepper', 'Chilli', 'Mint', 'Coriander',
    'Dill', 'Ivy Gourd', 'Chickpeas', 'Peas', 'Potato', 'Cashews', 'Urad Dal',
    'Moong Dal', 'Cucumber', 'Hyacinth Beans', 'Fried Gram', 'Rice Flour',
    'Jackfruit', 'Jaggery', 'Spices'
  ];

  var INGREDIENT_EMOJI = {
    'Chicken': '🍗', 'Mutton': '🍖', 'Fish': '🐟', 'Rice': '🍚', 'Coconut': '🥥',
    'Curry Leaves': '🌿', 'Mustard': '🟡', 'Tamarind': '🟤', 'Garlic': '🧄',
    'Ginger': '🫚', 'Pepper': '🫙', 'Chilli': '🌶', 'Mint': '🌱',
    'Coriander': '🍃', 'Dill': '🌾', 'Ivy Gourd': '🥒', 'Chickpeas': '🫘',
    'Peas': '🫛', 'Potato': '🥔', 'Cashews': '🥜', 'Urad Dal': '🟫',
    'Moong Dal': '🟢', 'Cucumber': '🥒', 'Hyacinth Beans': '🫛',
    'Fried Gram': '🟡', 'Rice Flour': '🌾', 'Jackfruit': '🍈',
    'Jaggery': '🟫', 'Spices': '🧂'
  };

  var SVG_INGREDIENTS = (function () {
    var map = {};
    var list = [
      'chicken', 'mutton', 'fish', 'rice', 'coconut', 'curry_leaves', 'mustard',
      'tamarind', 'garlic', 'ginger', 'pepper', 'chilli', 'mint', 'coriander',
      'chickpeas', 'cashews', 'cucumber', 'dill', 'fried_gram', 'hyacinth_beans',
      'ivy_gourd', 'jackfruit', 'jaggery', 'moong_dal', 'peas', 'potato',
      'rice_flour', 'spices', 'urad_dal'
    ];
    var names = [
      'Chicken', 'Mutton', 'Fish', 'Rice', 'Coconut', 'Curry Leaves', 'Mustard',
      'Tamarind', 'Garlic', 'Ginger', 'Pepper', 'Chilli', 'Mint', 'Coriander',
      'Chickpeas', 'Cashews', 'Cucumber', 'Dill', 'Fried Gram', 'Hyacinth Beans',
      'Ivy Gourd', 'Jackfruit', 'Jaggery', 'Moong Dal', 'Peas', 'Potato',
      'Rice Flour', 'Spices', 'Urad Dal'
    ];
    for (var i = 0; i < list.length; i++) {
      map[names[i]] = SVG_DIR + list[i] + '.svg';
    }
    return map;
  })();

  var INGREDIENT_SVG_IMAGES = {};

  function loadSVGs() {
    for (var name in SVG_INGREDIENTS) {
      if (SVG_INGREDIENTS.hasOwnProperty(name)) {
        var img = new Image();
        img.src = SVG_INGREDIENTS[name];
        INGREDIENT_SVG_IMAGES[name] = img;
      }
    }
  }

  function ingredientIconHTML(ing) {
    var p = SVG_INGREDIENTS[ing];
    if (p) return '<img src="' + p + '" alt="" style="width:52px;height:auto;vertical-align:middle">';
    return INGREDIENT_EMOJI[ing] || '';
  }

  var DISHES = [
    { name: 'White Chicken Pulao', ingredients: ['Chicken', 'Rice', 'Coconut', 'Spices'], videoId: '9ig2P5uQeLo' },
    { name: 'Naati Koli Bassaru', ingredients: ['Chicken', 'Chickpeas', 'Mustard', 'Spices'], videoId: 'xNlR6VPTUOc' },
    { name: 'Quick Mutton Fry', ingredients: ['Mutton', 'Garlic', 'Curry Leaves', 'Pepper', 'Chilli'], videoId: 'nol4d9eqjyo' },
    { name: 'Mutton Kheema Vade', ingredients: ['Mutton', 'Mint', 'Coriander', 'Dill', 'Garlic'], videoId: 'rtLm3RqLnLc' },
    { name: 'Kaal Soup', ingredients: ['Mutton', 'Ginger', 'Garlic', 'Pepper', 'Spices'], videoId: 'Pc1QVxb2V4s' },
    { name: 'Kanakapura Fish Curry', ingredients: ['Fish', 'Chilli', 'Tamarind', 'Coconut', 'Mustard'], videoId: 'SO9jaLxrPsQ' },
    { name: 'Kollegal Mutton Pulao', ingredients: ['Mutton', 'Rice', 'Coriander', 'Mint', 'Spices'], videoId: 's5jHf8M_hSE' },
    { name: 'Kadle Manoli', ingredients: ['Ivy Gourd', 'Chickpeas', 'Coconut', 'Mustard'], videoId: 'pESOxDDF7B4' },
    { name: 'Batani Kurma', ingredients: ['Peas', 'Potato', 'Cashews', 'Coconut', 'Spices'], videoId: 'rsJy07KbZhE' },
    { name: 'Raichur Tuntapur Chicken', ingredients: ['Chicken', 'Garlic', 'Chilli', 'Ginger'], videoId: 'oFWVuSiZZ64' },
    { name: 'Bonda Soup', ingredients: ['Urad Dal', 'Moong Dal', 'Ginger', 'Mustard'], videoId: 'jz7W4rcZYOs' },
    { name: 'Southekayi Muddipalya', ingredients: ['Cucumber', 'Coconut', 'Mustard', 'Chilli'], videoId: 'L-j5T-ZQdMg' },
    { name: 'Avarekalu Curry', ingredients: ['Hyacinth Beans', 'Coconut', 'Mustard', 'Chilli'], videoId: 'z9Zb3HCb29M' },
    { name: 'Hurugadle Nippattu', ingredients: ['Fried Gram', 'Rice Flour', 'Mustard', 'Chilli'], videoId: '4dMkfUiECkc' },
    { name: 'Halasina Mulka', ingredients: ['Jackfruit', 'Rice Flour', 'Jaggery', 'Coconut'], videoId: 'u1rGS26Likc' }
  ];

  var YT_LIST_ID = 'PL4tXltXT0TCWhrTT31fLGpTr2VoHHHov5';

  /* ---- CHARACTER SPRITE ---- */
  var CHAR_PAL = ['transparent', '#131110', '#1e1b18', '#332f2a', '#f5c518', '#d4542e', '#2ecc54', '#e74c3c', '#f0ede8', '#7a756e', '#d4a574', '#2c1810', '#c0392b', '#b8860b', '#4a3525', '#1a1a1a'];

  function genSprite(p) {
    var a = Array.from({ length: 36 }, function () { return Array(24).fill(0); });
    var put = function (x, y, w, h, c) {
      for (var j = 0; j < h; j++)
        for (var i = 0; i < w; i++)
          if (x + i >= 0 && x + i < 24 && y + j >= 0 && y + j < 36) a[y + j][x + i] = c;
    };
    put(7, 0, 10, 1, 15); put(5, 1, 14, 1, 15); put(4, 2, 16, 1, 15); put(3, 3, 18, 5, 15);
    put(5, 3, 14, 4, 8); put(7, 2, 10, 1, 8); put(4, 6, 16, 2, 8); put(5, 7, 14, 1, 3);
    put(4, 8, 16, 2, 15); put(5, 8, 14, 1, 4); put(4, 9, 16, 1, 5);
    put(5, 10, 14, 7, 15); put(7, 10, 10, 6, 11); put(6, 11, 2, 3, 5); put(16, 11, 2, 3, 5);
    put(8, 11, 2, 1, 10); put(14, 11, 2, 1, 10); put(8, 13, 8, 3, 11); put(9, 15, 6, 2, 15);
    put(4, 16, 16, 1, 15); put(3, 17, 18, 5, 15); put(4, 17, 16, 4, 12); put(6, 16, 12, 1, 7);
    put(1, 19, 3, 4, 15); put(2, 19, 2, 3, 5); put(20, 19, 3, 4, 15); put(20, 19, 2, 3, 5);
    put(7, 20, 10, 8, 15); put(8, 20, 8, 7, 11);
    put(5, 28, 14, 1, 15); put(6, 29, 12, 3, 11); put(6, 31, 4, 4, 11); put(14, 31, 4, 4, 11);
    put(7, 32, 2, 2, 15); put(15, 32, 2, 2, 15); put(6, 35, 4, 1, 5); put(14, 35, 4, 1, 5);
    var clearLegs = function () { put(5, 30, 14, 6, 0); };
    if (p === 1) { clearLegs(); put(1, 18, 3, 3, 12); put(20, 20, 3, 3, 12); put(6, 31, 4, 4, 11); put(14, 30, 3, 3, 11); put(6, 35, 4, 1, 5); put(14, 33, 3, 1, 5); }
    if (p === 2) { clearLegs(); put(2, 20, 3, 3, 12); put(19, 18, 3, 3, 12); put(8, 31, 4, 4, 11); put(12, 31, 4, 4, 11); put(8, 35, 4, 1, 5); put(12, 35, 4, 1, 5); }
    if (p === 3) { clearLegs(); put(1, 20, 3, 3, 12); put(20, 18, 3, 3, 12); put(7, 30, 3, 3, 11); put(14, 31, 4, 4, 11); put(7, 33, 3, 1, 5); put(14, 35, 4, 1, 5); }
    if (p >= 4 && p <= 8) { var cl = function (x, y, w, h) { put(x, y, w, h, 0); }; put(2, 8, 4, 2, 12); put(18, 8, 4, 2, 12); put(5, 6, 2, 4, 12); put(17, 6, 2, 4, 12); cl(5, 28, 14, 8); if (p === 4) { put(6, 27, 12, 2, 11); put(7, 30, 3, 3, 11); put(14, 30, 3, 3, 11); put(6, 33, 4, 2, 15); put(14, 33, 4, 2, 15); put(6, 35, 4, 1, 5); put(14, 35, 4, 1, 5); } if (p === 5) { put(6, 27, 12, 2, 11); put(7, 30, 3, 4, 11); put(14, 30, 3, 4, 11); put(6, 34, 4, 1, 5); put(14, 34, 4, 1, 5); } if (p === 6) { put(7, 27, 10, 2, 11); put(7, 29, 3, 2, 11); put(14, 29, 3, 2, 11); put(6, 31, 4, 1, 5); put(14, 31, 4, 1, 5); } if (p === 7) { put(6, 27, 12, 2, 11); put(6, 29, 4, 2, 11); put(14, 29, 4, 2, 11); put(7, 31, 3, 1, 5); put(14, 31, 3, 1, 5); } if (p === 8) { put(6, 28, 12, 2, 11); put(6, 30, 4, 4, 11); put(14, 30, 4, 4, 11); put(6, 34, 4, 1, 5); put(14, 34, 4, 1, 5); } }
    return a;
  }

  var CHAR_FRAMES = {
    run: [genSprite(0), genSprite(1), genSprite(2), genSprite(3)],
    idle: [genSprite(0), genSprite(2)],
    jump: [genSprite(4), genSprite(5), genSprite(6), genSprite(7), genSprite(8)],
  };

  /* ---- GAME STATE ---- */
  var gameState = {
    state: 'idle', // idle | playing | dish-complete | game-over
    score: 0,
    streak: 0,
    comboCount: 0,
    hearts: 3,
    bestStreak: 0,
    bestScore: 0,
    currentDish: null,
    currentDishIndex: -1,
    caughtIngredients: null,
    fallingTokens: [],
    ingredientCooldowns: {},
    lastSpawnTime: 0,
    lastDishIndex: -1,
    particles: [],
    kerbOffset: 0,
    basket: {
      lane: 1, targetLane: 1, x: 0, y: 0,
      startX: 0, targetX: 0, animating: false, animStart: 0,
      jumpTimer: 0, jumpDuration: 0
    },
    charPose: 'run',
    charFrame: 0,
    charAnimTimer: 0,
    charRunTimer: 0,
    basketBounceTimer: 0,
    basketShakeTimer: 0,
    basketShakeOffset: 0,
    basketJumpOffset: 0,
    CANVAS_W: 0, CANVAS_H: 0,
    laneWidth: 0, tokenWidth: 0, basketWidth: 0,
    catchLineY: 0,
    dpr: 1,
    lastFrameTime: 0,
    slideIdx: 0,
    slideTimer: null,
    slides: [],
    _previewDishIdx: undefined,
    _gameOverScheduled: false
  };

  var JUMP_DURATION = 550;
  var TOKEN_HEIGHT = 48;
  var BASKET_HEIGHT = 48;
  var BASKET_ANIM_MS = 120;
  var SWIPE_THRESHOLD = 30;
  var LEVEL_UP_MS = 800;

  var LEVELS = [
    { speed: 240, wrongPct: 0.45, interval: 1000 },
    { speed: 280, wrongPct: 0.45, interval: 900 },
    { speed: 440, wrongPct: 0.45, interval: 800 }
  ];

  /* ---- DOM REFS (game) ---- */
  var g = {};
  function cacheGameDOM() {
    g.inner = document.getElementById('game-inner');
    g.canvas = document.getElementById('gPlayCanvas');
    g.ctx = g.canvas ? g.canvas.getContext('2d') : null;
    g.header = document.getElementById('gHeader');
    g.dishName = document.getElementById('gDishName');
    g.checklist = document.getElementById('gChecklist');
    g.hud = document.getElementById('gHud');
    g.streakNum = document.getElementById('gStreakNum');
    g.scoreNum = document.getElementById('gScoreNum');
    g.levelNum = document.getElementById('gLevelNum');
    g.titleScreen = document.getElementById('gTitleScreen');
    g.titleBestStreak = document.getElementById('gTitleBestStreak');
    g.titleBestScore = document.getElementById('gTitleBestScore');
    g.startBtn = document.getElementById('gStartBtn');
    g.recipePreview = document.getElementById('gRecipePreview');
    g.rpDishName = document.getElementById('gRpDishName');
    g.rpProceed = document.getElementById('gRpProceed');
    g.gameOver = document.getElementById('gGameOver');
    g.goScore = document.getElementById('gGoScore');
    g.goBest = document.getElementById('gGoBest');
    g.goLastDish = document.getElementById('gGoLastDish');
    g.goCta = document.getElementById('gGoCta');
    g.goThumbWrap = document.getElementById('gGoThumbWrap');
    g.goThumb = document.getElementById('gGoThumb');
    g.restartBtn = document.getElementById('gRestartBtn');
    g.completeModal = document.getElementById('gCompleteModal');
    g.modalDishFront = document.getElementById('gModalDishFront');
    g.modalIngredients = document.getElementById('gModalIngredients');
    g.modalVideo = document.getElementById('gModalVideo');
    g.modalThumbWrap = document.getElementById('gModalThumbWrap');
    g.nextDishBtn = document.getElementById('gNextDishBtn');
    g.flashOverlay = document.getElementById('gFlashOverlay');
    g.levelUpBanner = document.getElementById('gLevelUpBanner');
    g.lvlNum = document.getElementById('gLvlNum');
    g.modalDishBack = document.getElementById('gModalDishBack');
    g.rpDesc = document.getElementById('gRpDesc');
    g.rpIngredients = document.getElementById('gRpIngredients');
    g.slideCorrect = document.getElementById('gSlideCorrect');
    g.slideDots = document.getElementById('gSlideDots');
    g.slideshow = document.getElementById('gSlideshow');
  }

  /* ---- GAME HELPERS ---- */
  function getLevel(s) { return s <= 1 ? 1 : s <= 3 ? 2 : 3; }
  function getMultiplier(c) { return c <= 1 ? 1 : c === 2 ? 1.2 : c === 3 ? 1.5 : 2; }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function getYtUrl(videoId) {
    return 'https://www.youtube.com/watch?v=' + videoId + '&list=' + YT_LIST_ID;
  }

  /* ---- LOCAL STORAGE ---- */
  function loadBest() {
    try {
      gameState.bestStreak = parseInt(localStorage.getItem('cok_best_streak') || '0');
      gameState.bestScore = parseInt(localStorage.getItem('cok_best_score') || '0');
    } catch (e) { gameState.bestStreak = 0; gameState.bestScore = 0; }
  }

  function saveBest() {
    try {
      if (gameState.streak > gameState.bestStreak) {
        gameState.bestStreak = gameState.streak;
        localStorage.setItem('cok_best_streak', String(gameState.bestStreak));
        trackEvent('best_streak', { best_streak: gameState.bestStreak });
      }
      if (gameState.score > gameState.bestScore) {
        gameState.bestScore = gameState.score;
        localStorage.setItem('cok_best_score', String(gameState.bestScore));
      }
    } catch (e) { /* localStorage unavailable */ }
  }

  /* ---- ANALYTICS ---- */
  function trackEvent(eventName, params) {
    try {
      if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: eventName, game_name: 'recipe_catcher', ...params });
        return;
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, { game_name: 'recipe_catcher', ...params });
      }
    } catch (e) { /* analytics never breaks game */ }
  }

  /* ---- LAYOUT ---- */
  function computeLayout() {
    var dpr = window.devicePixelRatio || 1;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var gw = vw;
    var gh = vh;
    var maxW = gh * 9 / 16;
    if (gw > maxW) gw = Math.min(maxW, 480);
    if (gw > 480) gw = 480;
    g.inner.style.width = gw + 'px';
    g.inner.style.height = gh + 'px';
    g.canvas.width = Math.round(gw * dpr);
    g.canvas.height = Math.round(gh * dpr);
    g.canvas.style.width = gw + 'px';
    g.canvas.style.height = gh + 'px';
    g.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gameState.CANVAS_W = gw;
    gameState.CANVAS_H = gh;
    gameState.laneWidth = gw / 3;
    gameState.tokenWidth = gameState.laneWidth * 0.78;
    gameState.basketWidth = gameState.laneWidth * 0.80;
    gameState.catchLineY = gh * 0.82;
    gameState.dpr = dpr;
  }

  /* ---- UI UPDATES ---- */
  function updateChecklist() {
    if (!gameState.currentDish) return;
    var html = '';
    for (var i = 0; i < gameState.currentDish.ingredients.length; i++) {
      var ing = gameState.currentDish.ingredients[i];
      var caught = gameState.caughtIngredients && gameState.caughtIngredients.has(ing);
      html += '<span class="check-item' + (caught ? ' checked' : '') + '"><em>' + ingredientIconHTML(ing) + '</em>' + ing + '</span>';
    }
    g.checklist.innerHTML = html;
  }

  function updateHud() {
    g.streakNum.textContent = gameState.streak;
    g.scoreNum.textContent = gameState.score;
    g.levelNum.textContent = getLevel(gameState.streak);
  }

  function showHeader(v) { g.header.classList.toggle('visible', v); }
  function showHud(v) { g.hud.classList.toggle('visible', v); }

  function setCta(el, dish) {
    if (dish) {
      el.href = getYtUrl(dish.videoId);
      el.textContent = 'Watch this recipe →';
      el.style.display = 'inline-block';
    } else {
      el.style.display = 'none';
    }
  }

  /* ---- SPAWN ---- */
  function isFalling(ing) {
    return gameState.fallingTokens.some(function (t) { return t.ingredient === ing && !t.processed && !t.missed; });
  }

  function isInCooldown(ing) {
    return gameState.ingredientCooldowns[ing] && gameState.ingredientCooldowns[ing] > Date.now();
  }

  function pickWrongIngredient() {
    var pool = ALL_INGREDIENTS.filter(function (ing) { return gameState.currentDish.ingredients.indexOf(ing) === -1; });
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function pickLaneWithSpacing() {
    var minGap = TOKEN_HEIGHT * 1.3;
    var lanes = shuffle([0, 1, 2]);
    for (var i = 0; i < lanes.length; i++) {
      var lane = lanes[i];
      var blocked = gameState.fallingTokens.some(function (t) {
        return t.lane === lane && !t.processed && !t.missed && t.y < minGap;
      });
      if (!blocked) return lane;
    }
    return -1;
  }

  function spawnToken() {
    if (gameState.state !== 'playing' || !gameState.currentDish) return;
    var level = getLevel(gameState.streak);
    var lv = LEVELS[level - 1];
    var isCorrect = Math.random() >= lv.wrongPct;
    var ingredient;
    if (isCorrect) {
      var available = gameState.currentDish.ingredients.filter(function (ing) {
        return !gameState.caughtIngredients.has(ing) && !isFalling(ing) && !isInCooldown(ing);
      });
      if (available.length === 0) {
        ingredient = pickWrongIngredient();
      } else {
        ingredient = available[Math.floor(Math.random() * available.length)];
      }
    } else {
      ingredient = pickWrongIngredient();
    }
    var lane = pickLaneWithSpacing();
    if (lane === -1) return;
    gameState.fallingTokens.push({
      lane: lane, y: -TOKEN_HEIGHT, ingredient: ingredient,
      speed: lv.speed * (0.95 + Math.random() * 0.1),
      correct: gameState.currentDish.ingredients.indexOf(ingredient) !== -1,
      processed: false, missed: false
    });
  }

  /* ---- COLLISION ---- */
  function checkCollisions() {
    if (gameState.state !== 'playing') return;
    if (gameState.basket.jumpTimer > 0) return;
    for (var i = 0; i < gameState.fallingTokens.length; i++) {
      var token = gameState.fallingTokens[i];
      if (token.processed || token.missed) continue;
      if (token.lane === gameState.basket.lane && (token.y + TOKEN_HEIGHT) >= gameState.catchLineY && token.y <= gameState.catchLineY + BASKET_HEIGHT) {
        token.processed = true;
        if (token.correct) {
          gameState.caughtIngredients.add(token.ingredient);
          gameState.comboCount++;
          var mult = getMultiplier(gameState.comboCount);
          gameState.score += Math.round(10 * mult);
          token.flashColor = '#F5C518';
          token.flashTimer = 250;
          token.scale = 1;
          updateChecklist();
          bounceBasket();
          gameState.flashOverlay.style.background = 'rgba(46,212,84,0.15)';
          gameState.flashOverlay.style.opacity = '1';
          setTimeout(function () { gameState.flashOverlay.style.opacity = '0'; gameState.flashOverlay.style.background = 'rgba(212,84,46,0.15)'; }, 100);
          var pColors = ['#2ECC54', '#27AE60', '#82E0AA', '#1ABC9C', '#F0EDE8'];
          var basketCx = gameState.basket.x;
          var basketCy = gameState.catchLineY + 20;
          for (var pi = 0; pi < 8; pi++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 60 + Math.random() * 100;
            gameState.particles.push({
              x: basketCx, y: basketCy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 80,
              alpha: 1, radius: 2.5 + Math.random() * 2, color: pColors[Math.floor(Math.random() * pColors.length)]
            });
          }
        } else {
          gameState.hearts--;
          gameState.comboCount = 0;
          token.flashColor = '#D4542E';
          token.flashTimer = 250;
          token.scale = 1;
          var basketCx2 = gameState.basket.x;
          var basketCy2 = gameState.catchLineY + 20;
          var bColors = ['#D4542E', '#E74C3C', '#FF6B6B', '#8B0000', '#FF4444'];
          for (var pi2 = 0; pi2 < 10; pi2++) {
            var angle2 = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
            var speed2 = 40 + Math.random() * 80;
            gameState.particles.push({
              x: basketCx2 + (Math.random() - 0.5) * 30, y: basketCy2 + (Math.random() - 0.5) * 20,
              vx: Math.cos(angle2) * speed2, vy: Math.sin(angle2) * speed2,
              alpha: 1, radius: 2 + Math.random() * 3, color: bColors[Math.floor(Math.random() * bColors.length)]
            });
          }
          shakeBasket();
          gameState.flashOverlay.style.opacity = '1';
          setTimeout(function () { gameState.flashOverlay.style.opacity = '0'; }, 100);
          trackEvent('wrong_ingredient_caught', { dish_name: gameState.currentDish.name, caught_ingredient: token.ingredient });
          if (gameState.hearts <= 0 && !gameState._gameOverScheduled) {
            gameState._gameOverScheduled = true;
            setTimeout(function () { transitionToGameOver(); }, 400);
            return;
          }
        }
      }
    }
  }

  /* ---- MISSED ---- */
  function checkMissed() {
    var now = Date.now();
    for (var i = 0; i < gameState.fallingTokens.length; i++) {
      var token = gameState.fallingTokens[i];
      if (token.processed || token.missed) continue;
      if (token.y > gameState.CANVAS_H) {
        token.missed = true;
        if (token.correct) {
          gameState.comboCount = 0;
          var cooldown = 2000 + Math.random() * 1000;
          gameState.ingredientCooldowns[token.ingredient] = now + cooldown;
          (function (ing, cd) { setTimeout(function () { if (gameState.ingredientCooldowns[ing] <= Date.now()) delete gameState.ingredientCooldowns[ing]; }, cd + 100); })(token.ingredient, cooldown);
        }
      }
    }
    gameState.fallingTokens = gameState.fallingTokens.filter(function (t) {
      if (t.missed) return false;
      if (t.processed) return t.flashTimer !== undefined && t.flashTimer > 0;
      return t.y <= gameState.CANVAS_H + 50;
    });
  }

  /* ---- DISH COMPLETE ---- */
  function checkDishComplete() {
    if (!gameState.currentDish) return false;
    return gameState.currentDish.ingredients.every(function (ing) { return gameState.caughtIngredients.has(ing); });
  }

  function completeDishAdvance() {
    var dishBonus = 50;
    var streakBonus = gameState.streak * 5;
    gameState.score += dishBonus + streakBonus;
    var oldLevel = getLevel(gameState.streak);
    gameState.streak++;
    var newLevel = getLevel(gameState.streak);
    updateHud();
    saveBest();
    g.completeModal.classList.remove('visible');
    g.modalVideo.src = '';
    if (newLevel > oldLevel) {
      g.levelUpBanner.classList.add('visible');
      g.lvlNum.textContent = 'Level ' + newLevel;
      setTimeout(function () {
        g.levelUpBanner.classList.remove('visible');
        showRecipePreview();
      }, LEVEL_UP_MS);
    } else {
      showRecipePreview();
    }
  }

  function transitionToDishComplete() {
    gameState.state = 'dish-complete';
    gameState.particles = [];
    g.modalDishFront.textContent = gameState.currentDish.name;
    g.modalDishBack.textContent = gameState.currentDish.name;
    var ingHtml = '';
    for (var i = 0; i < gameState.currentDish.ingredients.length; i++) {
      var ing = gameState.currentDish.ingredients[i];
      ingHtml += '<span class="check-item" style="border-color:#2ECC54;color:#2ECC54;"><em>' + ingredientIconHTML(ing) + '</em>' + ing + '</span>';
    }
    g.modalIngredients.innerHTML = ingHtml;
    g.modalVideo.src = 'https://www.youtube.com/embed/' + gameState.currentDish.videoId + '?rel=0';
    document.querySelector('#gCompleteModal .flip-inner').classList.remove('flipped');
    g.completeModal.classList.add('visible');
    setTimeout(function () {
      document.querySelector('#gCompleteModal .flip-inner').classList.add('flipped');
    }, 2000);
    document.querySelector('#gCompleteModal .flip-front').onclick = function () {
      document.querySelector('#gCompleteModal .flip-inner').classList.add('flipped');
    };
    trackEvent('dish_completed', { dish_name: gameState.currentDish.name, streak: gameState.streak, level: getLevel(gameState.streak) });
  }

  function transitionToGameOver() {
    gameState.state = 'game-over';
    showHeader(false);
    showHud(false);
    saveBest();
    g.goScore.textContent = 'Score: ' + gameState.score;
    g.goBest.textContent = 'Best Streak: ' + gameState.bestStreak;
    if (gameState.currentDish) {
      g.goLastDish.textContent = 'Last dish: ' + gameState.currentDish.name;
      setCta(g.goCta, gameState.currentDish);
      g.goThumb.src = 'https://img.youtube.com/vi/' + gameState.currentDish.videoId + '/hqdefault.jpg';
      g.goThumbWrap.style.display = 'block';
      g.goThumbWrap.onclick = function () {
        window.open(getYtUrl(gameState.currentDish.videoId), '_blank');
        trackEvent('watch_recipe_click', { dish_name: gameState.currentDish.name, video_id: gameState.currentDish.videoId });
      };
    } else {
      g.goLastDish.textContent = '';
      g.goCta.style.display = 'none';
      g.goThumbWrap.style.display = 'none';
    }
    g.gameOver.classList.add('visible');
    trackEvent('game_over', { score: gameState.score, best_streak: gameState.bestStreak, dishes_completed: gameState.streak });
  }

  function pickNewDish() {
    var available = DISHES.map(function (d, i) { return i; }).filter(function (i) { return i !== gameState.lastDishIndex; });
    if (available.length === 0) available = DISHES.map(function (d, i) { return i; });
    var idx = available[Math.floor(Math.random() * available.length)];
    gameState.currentDishIndex = idx;
    gameState.currentDish = DISHES[idx];
    gameState.lastDishIndex = idx;
    gameState.caughtIngredients = new Set();
    gameState.fallingTokens = [];
    gameState.ingredientCooldowns = {};
    gameState.lastSpawnTime = performance.now();
    g.dishName.textContent = gameState.currentDish.name;
    updateChecklist();
    showHeader(true);
  }

  function resetGame() {
    gameState.score = 0;
    gameState.comboCount = 0;
    gameState.hearts = 3;
    gameState.currentDish = null;
    gameState.currentDishIndex = -1;
    gameState.caughtIngredients = new Set();
    gameState.fallingTokens = [];
    gameState.ingredientCooldowns = {};
    gameState.lastSpawnTime = 0;
    gameState.basket.lane = 1;
    gameState.basket.targetLane = 1;
    gameState.basket.animating = false;
    gameState.basket.jumpTimer = 0;
    gameState.basket.jumpDuration = 0;
    gameState.charPose = 'run';
    gameState.charFrame = 0;
    gameState.charAnimTimer = 0;
    gameState.charRunTimer = 0;
    gameState.basket.x = gameState.laneWidth * 1 + gameState.laneWidth / 2;
    gameState.basket.targetX = gameState.basket.x;
    gameState.basket.startX = gameState.basket.x;
    gameState.particles = [];
    gameState._gameOverScheduled = false;
    updateHud();
    showHeader(false);
    showHud(false);
    g.titleScreen.classList.remove('visible');
    g.gameOver.classList.remove('visible');
    g.completeModal.classList.remove('visible');
    g.modalVideo.src = '';
    g.levelUpBanner.classList.remove('visible');
    g.recipePreview.classList.remove('visible');
    gameState.flashOverlay.style.opacity = '0';
  }

  function showTitleScreen() {
    gameState.streak = 0;
    resetGame();
    gameState.state = 'idle';
    g.titleScreen.classList.add('visible');
    updateTitleStats();
  }

  function showRecipePreview() {
    resetGame();
    var available = DISHES.map(function (d, i) { return i; }).filter(function (i) { return i !== gameState.lastDishIndex; });
    if (available.length === 0) available = DISHES.map(function (d, i) { return i; });
    var idx = available[Math.floor(Math.random() * available.length)];
    var dish = DISHES[idx];
    g.rpDishName.textContent = dish.name;
    g.rpDesc.textContent = "Let's make " + dish.name + "! We need to get " + dish.ingredients.join(', ') + ' from the market.';
    var html = '';
    dish.ingredients.forEach(function (ing, i) {
      html += '<span class="check-item" style="animation-delay:' + (i * 0.08) + 's"><em>' + ingredientIconHTML(ing) + '</em>' + ing + '</span>';
    });
    g.rpIngredients.innerHTML = html;
    g.recipePreview.classList.add('visible');
    g.rpProceed.style.animation = 'none';
    void g.rpProceed.offsetWidth;
    g.rpProceed.style.animation = '';
    gameState._previewDishIdx = idx;
  }

  function startGame() {
    if (gameState.state === 'playing') return;
    resetGame();
    gameState.state = 'playing';
    showHud(true);
    var idx = gameState._previewDishIdx !== undefined ? gameState._previewDishIdx : Math.floor(Math.random() * DISHES.length);
    gameState._previewDishIdx = undefined;
    gameState.currentDishIndex = idx;
    gameState.currentDish = DISHES[idx];
    gameState.lastDishIndex = idx;
    gameState.caughtIngredients = new Set();
    gameState.fallingTokens = [];
    gameState.ingredientCooldowns = {};
    gameState.lastSpawnTime = performance.now();
    g.dishName.textContent = gameState.currentDish.name;
    updateChecklist();
    showHeader(true);
    updateHud();
    trackEvent('game_start');
    updateTitleStats();
  }

  function updateTitleStats() {
    loadBest();
    g.titleBestStreak.innerHTML = gameState.bestStreak > 0 ? 'Best Streak: <strong>' + gameState.bestStreak + '</strong>' : '';
    g.titleBestScore.innerHTML = gameState.bestScore > 0 ? 'Best Score: <strong>' + gameState.bestScore + '</strong>' : '';
  }

  /* ---- SLIDESHOW ---- */
  function initSlideshow() {
    var slides = document.querySelectorAll('#gSlideshow .slide');
    gameState.slides = slides;
    var dots = g.slideDots;
    dots.innerHTML = '';
    for (var i = 0; i < slides.length; i++) {
      (function (j) {
        var dot = document.createElement('button');
        dot.className = 'slide-dot' + (j === 0 ? ' active' : '');
        dot.addEventListener('click', function () { goToSlide(j); });
        dots.appendChild(dot);
      })(i);
    }
    var basketsCanvas = document.querySelector('#gSlideshow canvas.slide-baskets');
    if (basketsCanvas) drawBasketSlide(basketsCanvas, 3);
    cycleIngredientIcons();
    setInterval(cycleIngredientIcons, 2000);
    startSlideTimer();
  }

  function drawBasketSlide(c, count) {
    if (!c) return;
    var cx = c.getContext('2d');
    var s = 4;
    var bp = [
      [1, 1, 1, 1, 1, 1], [1, 2, 2, 2, 2, 1], [2, 3, 1, 1, 3, 2], [2, 3, 1, 1, 3, 2],
      [2, 3, 1, 1, 3, 2], [2, 1, 1, 1, 1, 2], [1, 2, 2, 2, 2, 1], [1, 1, 1, 1, 1, 1],
    ];
    var pal = ['', '#1a1a1a', '#b8860b', '#d4542e'];
    cx.clearRect(0, 0, c.width, c.height);
    var n = count || 1;
    var gap = 15;
    var startX = (c.width - (n * 6 * s + (n - 1) * gap)) / 2;
    for (var b = 0; b < n; b++) {
      var ox = startX + b * (6 * s + gap);
      for (var r = 0; r < 8; r++)
        for (var col = 0; col < 6; col++) {
          var ci = bp[r][col];
          if (!ci) continue;
          cx.fillStyle = pal[ci];
          cx.fillRect(ox + col * s, r * s, s, s);
        }
    }
  }

  function cycleIngredientIcons() {
    var pool = ['Chicken', 'Mutton', 'Fish', 'Rice', 'Coconut', 'Garlic', 'Chilli', 'Mint', 'Jackfruit', 'Peas'];
    var ing = pool[Math.floor(Math.random() * pool.length)];
    if (g.slideCorrect) g.slideCorrect.innerHTML = ingredientIconHTML(ing);
  }

  function goToSlide(n) {
    var slides = gameState.slides;
    for (var i = 0; i < slides.length; i++) { slides[i].classList.toggle('active', i === n); }
    var dots = g.slideDots.querySelectorAll('.slide-dot');
    for (var j = 0; j < dots.length; j++) { dots[j].classList.toggle('active', j === n); }
    gameState.slideIdx = n;
    startSlideTimer();
  }

  function startSlideTimer() {
    if (gameState.slideTimer) clearInterval(gameState.slideTimer);
    gameState.slideTimer = setInterval(function () {
      var next = (gameState.slideIdx + 1) % gameState.slides.length;
      goToSlide(next);
    }, 4000);
  }

  /* ---- BASKET ANIMATION ---- */
  function getLaneCenter(lane) { return lane * gameState.laneWidth + gameState.laneWidth / 2; }

  function moveBasketLeft() {
    if (gameState.basket.targetLane > 0) {
      gameState.basket.targetLane--;
      startBasketAnim();
    }
  }

  function moveBasketRight() {
    if (gameState.basket.targetLane < 2) {
      gameState.basket.targetLane++;
      startBasketAnim();
    }
  }

  function startBasketAnim() {
    gameState.basket.animating = true;
    gameState.basket.animStart = performance.now();
    gameState.basket.startX = gameState.basket.x;
    gameState.basket.targetX = getLaneCenter(gameState.basket.targetLane);
    gameState.charPose = 'run';
    gameState.charRunTimer = 400;
  }

  function updateBasket(now) {
    if (gameState.basket.animating) {
      var elapsed = now - gameState.basket.animStart;
      var t = Math.min(elapsed / BASKET_ANIM_MS, 1);
      var ease = 1 - Math.pow(1 - t, 2);
      gameState.basket.x = gameState.basket.startX + (gameState.basket.targetX - gameState.basket.startX) * ease;
      if (t >= 1) {
        gameState.basket.x = gameState.basket.targetX;
        gameState.basket.lane = gameState.basket.targetLane;
        gameState.basket.animating = false;
      }
    }
  }

  function bounceBasket() { gameState.basketBounceTimer = 200; }
  function shakeBasket() { gameState.basketShakeTimer = 300; }

  function doJump() {
    var scale = [0, 1.2, 1, 0.7][getLevel(gameState.streak)];
    gameState.basket.jumpTimer = JUMP_DURATION * scale;
    gameState.basket.jumpDuration = gameState.basket.jumpTimer;
    gameState.charPose = 'jump';
    gameState.charFrame = 0;
  }

  function updateVisualEffects(dt) {
    if (gameState.basketBounceTimer > 0) gameState.basketBounceTimer -= dt * 1000;
    if (gameState.basketShakeTimer > 0) {
      gameState.basketShakeTimer -= dt * 1000;
      var intensity = gameState.basketShakeTimer / 300;
      gameState.basketShakeOffset = Math.sin(gameState.basketShakeTimer * 0.08) * 5 * intensity;
    } else {
      gameState.basketShakeOffset = 0;
    }
    if (gameState.basket.jumpTimer > 0) {
      gameState.basket.jumpTimer -= dt * 1000;
      gameState.basketJumpOffset = Math.sin((1 - gameState.basket.jumpTimer / gameState.basket.jumpDuration) * Math.PI) * 50;
      if (gameState.charPose === 'jump' && gameState.charFrame < CHAR_FRAMES.jump.length - 1) {
        gameState.charAnimTimer += dt * 1000;
        if (gameState.charAnimTimer > 80) { gameState.charFrame++; gameState.charAnimTimer = 0; }
      }
    } else {
      gameState.basketJumpOffset = 0;
      if (gameState.charPose === 'jump') { gameState.charPose = 'run'; gameState.charFrame = 0; }
    }
    if (gameState.charPose === 'run') {
      gameState.charAnimTimer += dt * 1000;
      gameState.charRunTimer -= dt * 1000;
      if (gameState.charAnimTimer > 70) { gameState.charFrame = (gameState.charFrame + 1) % CHAR_FRAMES.run.length; gameState.charAnimTimer = 0; }
    }
  }

  /* ---- DRAW CHARACTER ---- */
  function drawChar(ctx, x, y, sc, lift) {
    var list = CHAR_FRAMES.run;
    var data = list[gameState.charFrame % list.length];
    var ox = x - 12 * sc;
    var oy = y - 18 * sc - lift;
    for (var r = 0; r < 36; r++)
      for (var c = 0; c < 24; c++) {
        var ci = data[r][c];
        if (ci) { ctx.fillStyle = CHAR_PAL[ci]; ctx.fillRect(ox + c * sc, oy + r * sc, sc, sc); }
      }
    for (var i = 0; i < gameState.hearts; i++) {
      var bx = ox + (3 + i * 7) * sc;
      var by = oy + 21 * sc;
      ctx.fillStyle = CHAR_PAL[15];
      ctx.fillRect(bx, by, 6 * sc, 8 * sc);
      ctx.fillStyle = CHAR_PAL[13];
      ctx.fillRect(bx + sc, by + sc, 4 * sc, sc);
      ctx.fillRect(bx, by + 2 * sc, sc, 4 * sc);
      ctx.fillRect(bx + 5 * sc, by + 2 * sc, sc, 4 * sc);
      ctx.fillRect(bx + sc, by + 6 * sc, 4 * sc, sc);
      ctx.fillStyle = CHAR_PAL[5];
      ctx.fillRect(bx + sc, by + 2 * sc, sc, 3 * sc);
      ctx.fillRect(bx + 4 * sc, by + 2 * sc, sc, 3 * sc);
    }
  }

  /* ---- RENDER ---- */
  function render() {
    var ctx = g.ctx;
    var s = gameState;
    ctx.clearRect(0, 0, s.CANVAS_W, s.CANVAS_H);
    ctx.fillStyle = '#1E1C1A';
    ctx.fillRect(0, 0, s.CANVAS_W, s.CANVAS_H);
    var kerbW = Math.max(6, s.laneWidth * 0.08);

    function drawKerb(x) {
      var stripeH = 12, stoneH = 48, period = 96;
      var scrollPos = s.kerbOffset % period;
      var colors = ['#A09030', '#706C68'];
      var firstY = Math.floor((-stoneH * 2 - scrollPos) / stripeH) * stripeH;
      for (var y = firstY; y < s.CANVAS_H + stoneH * 2; y += stripeH) {
        var screenY = y + scrollPos;
        var ci = Math.abs(Math.floor(y / stoneH) % 2);
        ctx.fillStyle = colors[ci];
        ctx.fillRect(x, screenY, kerbW, stripeH);
      }
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(x + kerbW - 1, 0, 1, s.CANVAS_H);
    }
    drawKerb(0);
    drawKerb(s.CANVAS_W - kerbW);

    ctx.strokeStyle = '#8A8A84';
    ctx.lineWidth = kerbW;
    ctx.setLineDash([48, 128]);
    ctx.lineDashOffset = -s.kerbOffset;
    for (var li = 1; li < 3; li++) {
      var lx = li * s.laneWidth;
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx, s.CANVAS_H);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Tokens
    for (var ti = 0; ti < s.fallingTokens.length; ti++) {
      var token = s.fallingTokens[ti];
      var x = token.lane * s.laneWidth + (s.laneWidth - s.tokenWidth) / 2;
      var y = token.y;
      var w = s.tokenWidth;
      var h = TOKEN_HEIGHT;
      var r = 8;
      if (token.flashTimer !== undefined) { token.flashTimer -= 16; if (token.flashTimer <= 0) token.flashTimer = undefined; }
      var drawW = token.scale !== undefined ? w * Math.max(0.01, token.scale) : w;
      var drawH = token.scale !== undefined ? h * Math.max(0.01, token.scale) : h;
      var drawX = x + (w - drawW) / 2;
      var drawY = y + (h - drawH) / 2;

      // Background
      ctx.fillStyle = token.correct ? '#2A2A28' : '#2A1E1C';
      ctx.beginPath();
      roundRect(ctx, drawX, drawY, drawW, drawH, 8);
      ctx.fill();

      var svgImg = INGREDIENT_SVG_IMAGES[token.ingredient];
      if (svgImg && svgImg.complete && svgImg.naturalWidth > 0) {
        ctx.drawImage(svgImg, drawX + drawW / 2 - 30, drawY + drawH / 2 - 30, 60, 60);
      } else if (typeof INGREDIENT_ICONS !== 'undefined' && INGREDIENT_ICONS[token.ingredient && token.ingredient.toLowerCase()]) {
        // pixel icon fallback (skip for simplicity — emoji drawn below)
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#F0EDE8';
      ctx.font = 'bold 10px "DM Sans", sans-serif';
      ctx.fillText(token.ingredient, drawX + drawW / 2, drawY + drawH / 2 + 26);
    }

    // Character
    var charScale = Math.max(1, Math.floor(s.basketWidth / 24 * 0.85));
    var charLift = s.charPose === 'jump' ? ([0, 1, 3, 3, 1][s.charFrame] || 0) : 0;
    drawChar(ctx, s.basket.x + s.basketShakeOffset, s.catchLineY - s.basketJumpOffset, charScale, charLift * charScale);

    // Particles
    for (var pi3 = 0; pi3 < s.particles.length; pi3++) {
      var p = s.particles[pi3];
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---- INPUT ---- */
  var gTouchStartX = 0, gTouchStartY = 0, gTouchActive = false;

  function handleTap(side) {
    if (gameState.state === 'playing') {
      if (side === 'left') moveBasketLeft(); else moveBasketRight();
    }
  }

  function handleSwipe(dx) {
    if (gameState.state === 'playing') {
      if (dx < -SWIPE_THRESHOLD) moveBasketLeft();
      else if (dx > SWIPE_THRESHOLD) moveBasketRight();
    }
  }

  function setupGameInput() {
    g.canvas.addEventListener('touchstart', function (e) {
      if (gameState.state === 'idle' || gameState.state === 'game-over' || gameState.state === 'dish-complete') return;
      e.preventDefault();
      var t = e.changedTouches[0];
      gTouchStartX = t.clientX;
      gTouchStartY = t.clientY;
      gTouchActive = true;
    }, { passive: false });

    g.canvas.addEventListener('touchmove', function (e) {
      if (gameState.state === 'idle' || gameState.state === 'game-over' || gameState.state === 'dish-complete') return;
      e.preventDefault();
    }, { passive: false });

    g.canvas.addEventListener('touchend', function (e) {
      if (!gTouchActive) return;
      gTouchActive = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - gTouchStartX;
      var dy = t.clientY - gTouchStartY;
      if (gameState.state === 'idle' || gameState.state === 'game-over' || gameState.state === 'dish-complete') return;
      if (dy < -SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
        if (gameState.state === 'playing') { doJump(); }
        return;
      }
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        handleSwipe(dx);
      } else {
        var rect = g.canvas.getBoundingClientRect();
        var relX = gTouchStartX - rect.left;
        if (relX < gameState.CANVAS_W / 2) handleTap('left'); else handleTap('right');
      }
    }, { passive: false });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); if (gameState.state === 'playing') moveBasketLeft(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); if (gameState.state === 'playing') moveBasketRight(); }
      if (e.key === 'ArrowUp' || e.key === ' ') { e.preventDefault(); if (gameState.state === 'playing') doJump(); }
    });
  }

  /* ---- GAME LOOP ---- */
  function gameLoop(time) {
    if (!gameActive) return;
    var dt = Math.min((time - gameState.lastFrameTime) / 1000, 0.05);
    gameState.lastFrameTime = time;

    if (gameState.state === 'playing') {
      gameState.kerbOffset += dt * LEVELS[getLevel(gameState.streak) - 1].speed;
      updateVisualEffects(dt);
      updateBasket(time);

      var level = getLevel(gameState.streak);
      var interval = LEVELS[level - 1].interval;
      if (time - gameState.lastSpawnTime >= interval) {
        spawnToken();
        gameState.lastSpawnTime = time;
      }

      for (var ti2 = 0; ti2 < gameState.fallingTokens.length; ti2++) {
        var token = gameState.fallingTokens[ti2];
        if (!token.processed && !token.missed) { token.y += token.speed * dt; }
        if (token.processed && token.scale !== undefined && token.scale > 0) {
          token.scale = Math.max(0, token.scale - dt * 4);
        }
      }

      for (var pi4 = gameState.particles.length - 1; pi4 >= 0; pi4--) {
        var pp = gameState.particles[pi4];
        pp.x += pp.vx * dt; pp.y += pp.vy * dt; pp.vy += 120 * dt;
        pp.alpha = Math.max(0, pp.alpha - dt * 2.5);
        if (pp.alpha <= 0) gameState.particles.splice(pi4, 1);
      }

      checkCollisions();
      checkMissed();

      var now = Date.now();
      for (var key in gameState.ingredientCooldowns) {
        if (gameState.ingredientCooldowns[key] <= now) delete gameState.ingredientCooldowns[key];
      }

      if (checkDishComplete()) {
        transitionToDishComplete();
      }
    }

    render();

    if (gameActive) {
      gameRAF = requestAnimationFrame(gameLoop);
    }
  }

  function startGameLoop() {
    if (gameRAF) { cancelAnimationFrame(gameRAF); gameRAF = null; }
    gameActive = true;
    gameState.lastFrameTime = performance.now();
    gameRAF = requestAnimationFrame(gameLoop);
  }

  function stopGameLoop() {
    gameActive = false;
    if (gameRAF) { cancelAnimationFrame(gameRAF); gameRAF = null; }
  }

  function recomputeLayout() {
    computeLayout();
    if (!gameState.basket.animating) {
      gameState.basket.x = getLaneCenter(gameState.basket.lane);
      gameState.basket.targetX = gameState.basket.x;
      gameState.basket.startX = gameState.basket.x;
    } else {
      gameState.basket.targetX = getLaneCenter(gameState.basket.targetLane);
      gameState.basket.startX = getLaneCenter(gameState.basket.lane);
    }
  }

  function initGame() {
    cacheGameDOM();
    if (!g.canvas) return;
    gameState.flashOverlay = g.flashOverlay;

    loadSVGs();
    computeLayout();
    loadBest();
    updateTitleStats();
    updateHud();
    initSlideshow();

    gameState.basket.x = getLaneCenter(1);
    gameState.basket.targetX = gameState.basket.x;
    gameState.basket.startX = gameState.basket.x;

    g.titleScreen.classList.add('visible');

    setupGameInput();

    window.addEventListener('resize', recomputeLayout);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', recomputeLayout);
    }
    window.addEventListener('orientationchange', function () {
      setTimeout(recomputeLayout, 150);
    });

    g.startBtn.addEventListener('click', showRecipePreview);
    g.restartBtn.addEventListener('click', showTitleScreen);
    g.nextDishBtn.addEventListener('click', completeDishAdvance);
    g.rpProceed.addEventListener('animationend', startGame);
    g.rpProceed.addEventListener('click', startGame);

    document.querySelectorAll('#game .cta-link').forEach(function (el) {
      el.addEventListener('click', function () {
        var dish = gameState.currentDish;
        trackEvent('watch_recipe_click', { dish_name: dish ? dish.name : '', video_id: dish ? dish.videoId : '' });
      });
    });
  }

  function pauseGame() {
    stopGameLoop();
    // Stop slideshow timer
    if (gameState.slideTimer) { clearInterval(gameState.slideTimer); gameState.slideTimer = null; }
    // Clear any ingredient cooldowns
    gameState.ingredientCooldowns = {};
  }

  function resumeGame() {
    if (initialised.game) {
      // Update title stats (best scores may have been updated)
      updateTitleStats();
      startGameLoop();
    }
  }

  // ===== MOBILE NAV =====
  function setupMobileNav() {
    var mn = document.getElementById('mobile-nav');
    var mnc = document.getElementById('mobile-nav-close');
    var mmb = document.getElementById('mobile-menu-btn');
    var dmb = document.getElementById('desktop-menu-btn');
    if (!mn) return;
    function openNav() { mn.classList.add('open'); }
    function closeNav() { mn.classList.remove('open'); }
    if (mnc) mnc.addEventListener('click', closeNav);
    if (mn) mn.addEventListener('click', function (e) { if (e.target === mn) closeNav(); });
    if (mmb) mmb.addEventListener('click', openNav);
    if (dmb) dmb.addEventListener('click', openNav);
    document.querySelectorAll('.mobile-nav-links a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  // ===== SPONSOR CAROUSELS =====
  function setupSponsorCarousels() {
    function rotateSponsor(id) {
      var outer = document.getElementById(id);
      if (!outer) return;
      var items = outer.querySelectorAll('.sponsor-item');
      var current = outer.querySelector('.sponsor-item.active');
      var next = current && current.nextElementSibling ? current.nextElementSibling : items[0];
      if (current) current.classList.remove('active');
      if (next) next.classList.add('active');
    }
    setInterval(function () { rotateSponsor('sponsorCarousel1'); }, 3000);
    setInterval(function () { rotateSponsor('sponsorCarousel2'); }, 3000);
  }

  // ===== INIT =====
  setupMobileNav();
  setupSponsorCarousels();
  onHashChange();
  window.addEventListener('hashchange', onHashChange);

})();
