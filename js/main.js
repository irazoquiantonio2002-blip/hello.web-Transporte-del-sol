/* ==========================================================================
   TRANSPORTE DEL SOL — Interacciones
   Loader · Navbar · Menú móvil · Partículas hero · Marquee ·
   Reveal on scroll · Contadores · Formulario a WhatsApp
   ========================================================================== */
(function () {
  'use strict';

  /* --- Datos de contacto centralizados ------------------------------- */
  var WHATSAPP_NUMBER = '526623157823'; // +52 662 315 7823
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. LOADER  — se oculta cuando la página termina de cargar
  ------------------------------------------------------------------ */
  function revealSite() { document.body.classList.add('loaded'); }
  window.addEventListener('load', function () { setTimeout(revealSite, 500); });
  // Respaldos: si 'load' tarda (imágenes remotas, red lenta) no dejamos el sitio oculto
  if (document.readyState === 'complete') setTimeout(revealSite, 300);
  document.addEventListener('DOMContentLoaded', function () { setTimeout(revealSite, 1400); });
  setTimeout(revealSite, 2200);

  /* ------------------------------------------------------------------
     2. NAVBAR — estado "scrolled"
  ------------------------------------------------------------------ */
  var navbar = document.getElementById('navbar');
  function onScrollNav() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ------------------------------------------------------------------
     3. MENÚ MÓVIL
  ------------------------------------------------------------------ */
  var hamburger = document.getElementById('hamburger');
  var mobMenu = document.getElementById('mob-menu');

  function closeMenu() {
    hamburger.classList.remove('active');
    mobMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  if (hamburger && mobMenu) {
    hamburger.addEventListener('click', function () {
      var open = mobMenu.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ------------------------------------------------------------------
     4. MARQUEE — se llena por JS y se duplica para loop continuo
  ------------------------------------------------------------------ */
  var marquee = document.getElementById('marquee');
  if (marquee) {
    var words = [
      'Envíos nacionales', 'Carga internacional', 'Logística integral',
      'Seguimiento en ruta', 'Carga consolidada', 'Entrega puntual',
      'Hermosillo, Sonora'
    ];
    var block = words.map(function (w) {
      return '<span>' + w + '<i class="fa-solid fa-sun" aria-hidden="true"></i></span>';
    }).join('');
    marquee.innerHTML = block + block; // duplicado -> translateX(-50%) sin saltos
  }

  /* ------------------------------------------------------------------
     5. REVEAL ON SCROLL
  ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ------------------------------------------------------------------
     6. CONTADORES  (#stats)
  ------------------------------------------------------------------ */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = val.toLocaleString('es-MX') + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statNums = document.querySelectorAll('.stat-num');
  if (statNums.length) {
    if ('IntersectionObserver' in window && !prefersReduced) {
      var statsIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); statsIO.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      statNums.forEach(function (el) { statsIO.observe(el); });
    } else {
      statNums.forEach(function (el) {
        el.textContent = (parseFloat(el.getAttribute('data-count')) || 0).toLocaleString('es-MX') +
          (el.getAttribute('data-suffix') || '');
      });
    }
  }

  /* ------------------------------------------------------------------
     7. HERO — partículas tipo polvo de sol sobre canvas
  ------------------------------------------------------------------ */
  var canvas = document.getElementById('hero-canvas');
  if (canvas && !prefersReduced) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var w, h, raf;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      var count = Math.min(70, Math.floor(w / 22));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.2 + 0.6,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -(Math.random() * 0.35 + 0.05),
          a: Math.random() * 0.5 + 0.15
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245,197,24,' + p.a + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    tick();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(raf);
      else tick();
    });
  }

  /* ------------------------------------------------------------------
     8. PARALLAX SUAVE del fondo del hero
  ------------------------------------------------------------------ */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg && !prefersReduced && window.matchMedia('(min-width: 901px)').matches) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = 'scale(1.05) translateY(' + (y * 0.15) + 'px)';
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     9. FORMULARIO -> WHATSAPP
  ------------------------------------------------------------------ */
  var form = document.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = (document.getElementById('f-name') || {}).value || '';
      var interest = (document.getElementById('f-interest') || {}).value || '';
      var msg = (document.getElementById('f-msg') || {}).value || '';

      name = name.trim();
      msg = msg.trim();
      if (!name || !msg) {
        form.querySelectorAll('[required]').forEach(function (f) {
          if (!f.value.trim()) {
            f.style.borderColor = '#e5484d';
            f.addEventListener('input', function () { f.style.borderColor = ''; }, { once: true });
          }
        });
        return;
      }

      var text =
        'Hola, soy ' + name + '.\n' +
        'Servicio de interés: ' + interest + '.\n' +
        'Detalle del envío: ' + msg + '.\n\n' +
        'Me gustaría solicitar una cotización.';

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ------------------------------------------------------------------
     10. AÑO EN EL FOOTER
  ------------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     11. IMÁGENES CON FALLO -> se ocultan con elegancia
  ------------------------------------------------------------------ */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () { img.style.display = 'none'; });
  });

})();
