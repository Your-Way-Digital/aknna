(function () {
  var SUPPORTED = ['pt', 'en', 'es'];

  function getInitialLang() {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = (params.get('lang') || '').toLowerCase();
    if (SUPPORTED.indexOf(fromQuery) !== -1) return fromQuery;

    var nav = (navigator.language || 'pt').toLowerCase();
    if (nav.indexOf('en') === 0) return 'en';
    if (nav.indexOf('es') === 0) return 'es';
    return 'pt';
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = 'pt';

    document.querySelectorAll('.lang-block').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('.lang-pill button').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang);

    try {
      var url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url);
    } catch (e) {
      // Some sandboxed preview contexts (e.g. srcdoc iframes) block
      // history changes entirely — safe to ignore, purely cosmetic.
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    setLang(getInitialLang());

    document.querySelectorAll('.lang-pill button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-lang'));
      });
    });

    // Highlight current chapter in the table of contents while scrolling
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = '#' + entry.target.id;
            links.forEach(function (a) {
              a.classList.toggle('current', a.getAttribute('href') === id);
            });
          });
        },
        { rootMargin: '-120px 0px -70% 0px' }
      );
      sections.forEach(function (s) { observer.observe(s); });
    }
  });
})();
