(function () {
  'use strict';

  var top = document.getElementById('top');
  function cien() { top.classList.toggle('cien', window.scrollY > 8); }
  window.addEventListener('scroll', cien, { passive: true }); cien();

  /* menu mobilne */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu-mob');
  function zamknij() { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Otwórz menu'); }
  burger.addEventListener('click', function () {
    var otw = menu.hidden;
    menu.hidden = !otw;
    burger.setAttribute('aria-expanded', String(otw));
    burger.setAttribute('aria-label', otw ? 'Zamknij menu' : 'Otwórz menu');
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) zamknij(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { zamknij(); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !menu.hidden) zamknij(); });

  /* tory przesuwane: palec natywnie, mysz przeciąganiem */
  document.querySelectorAll('[data-tor]').forEach(function (tor) {
    var start = null, sl = 0, ruch = false;
    tor.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || tor.scrollWidth <= tor.clientWidth + 2) return;
      start = e.clientX; sl = tor.scrollLeft; ruch = false;
    });
    window.addEventListener('pointermove', function (e) {
      if (start === null) return;
      var dx = e.clientX - start;
      if (Math.abs(dx) > 5) { ruch = true; tor.style.scrollSnapType = 'none'; tor.style.cursor = 'grabbing'; }
      if (ruch) tor.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (start === null) return;
      start = null; tor.style.cursor = '';
      if (ruch) { tor.style.scrollSnapType = ''; setTimeout(function () { ruch = false; }, 0); }
    });
    tor.addEventListener('click', function (e) { if (ruch) { e.preventDefault(); e.stopPropagation(); } }, true);
    tor.addEventListener('dragstart', function (e) { e.preventDefault(); });
  });

  /* strzałki zespołu */
  document.querySelectorAll('.ts').forEach(function (b) {
    b.addEventListener('click', function () {
      var tor = document.getElementById(b.dataset.cel);
      var kafel = tor.firstElementChild.getBoundingClientRect().width + 22;
      tor.scrollBy({ left: Number(b.dataset.kier) * kafel * 2, behavior: 'smooth' });
    });
  });

  /* formularz pokazowy - bez wysyłki */
  var form = document.getElementById('form');
  var info = document.getElementById('form-info');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = form.nazwa.value.trim(), t = form.tel.value.trim(), m = form.email.value.trim();
    if (!n || (!t && !m)) {
      info.className = 'form-info blad';
      info.textContent = 'Podaj imię i nazwisko oraz telefon albo e-mail.';
      return;
    }
    info.className = 'form-info ok';
    info.textContent = 'Dziękujemy. W docelowej stronie zapytanie trafi od razu na biuro@euro-rozliczenia.pl.';
    form.reset();
  });

  /* dolny pasek na telefonie po przewinięciu za przycisk w hero */
  var pasek = document.getElementById('mob-pasek');
  var cta = document.getElementById('hero-cta');
  var kontakt = document.getElementById('kontakt');
  if ('IntersectionObserver' in window && pasek && cta) {
    var zaCta = false, wKontakcie = false;
    function ustaw() {
      var w = zaCta && !wKontakcie;
      pasek.classList.toggle('widac', w);
      pasek.setAttribute('aria-hidden', String(!w));
      pasek.querySelectorAll('a').forEach(function (a) { a.tabIndex = w ? 0 : -1; });
    }
    new IntersectionObserver(function (en) { zaCta = !en[0].isIntersecting && en[0].boundingClientRect.top < 0; ustaw(); }).observe(cta);
    new IntersectionObserver(function (en) { wKontakcie = en[0].isIntersecting; ustaw(); }, { threshold: 0.1 }).observe(kontakt);
  }
})();
