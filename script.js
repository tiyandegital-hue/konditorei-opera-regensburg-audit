/* Befund-Dossier interactivity — progressive enhancement only.
   Without JS every section stays statically visible (see styles.css no-JS rules). */
(function () {
  'use strict';

  /* ONE swappable business-name constant (task requirement).
     All .bname spans are re-rendered from here; uppercase variants
     keep text-transform via the .upper class. */
  var BUSINESS_NAME = 'Konditorei Opera';
  document.querySelectorAll('.bname').forEach(function (el) {
    el.textContent = BUSINESS_NAME;
  });

  document.documentElement.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll reveal: Befund cards rise in once; Rotstift notes stagger via CSS */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Copy-to-clipboard on the 3 [TEST-PROMPT] rows (demo affordance) */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error('copy failed'));
      } catch (e) {
        document.body.removeChild(ta);
        reject(e);
      }
    });
  }

  document.querySelectorAll('.prompt-row').forEach(function (row) {
    row.addEventListener('click', function () {
      var text = row.getAttribute('data-prompt') || '';
      var label = row.querySelector('.prompt-row__copy');
      copyText(text).then(function () {
        row.classList.add('prompt-row--copied');
        if (label) {
          var orig = label.textContent;
          label.textContent = 'KOPIERT ✓';
          setTimeout(function () {
            label.textContent = orig;
            row.classList.remove('prompt-row--copied');
          }, 1600);
        }
      });
    });
  });
})();
