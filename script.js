/* OCK Burger — Main Script */

/* Loader */
window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('loader').classList.add('done');
    document.body.style.overflow = '';
  }, 1800);
});
document.body.style.overflow = 'hidden';

/* Navbar */
var navbar    = document.getElementById('navbar');
var navToggle = document.getElementById('navToggle');
var navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', function() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', function() {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(function(a) {
  a.addEventListener('click', function() {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* Parallax */
var heroBg = document.getElementById('heroBg');
var ctaBg  = document.getElementById('ctaBg');
window.addEventListener('scroll', function() {
  var sy = window.scrollY;
  if (heroBg) heroBg.style.transform = 'translateY(' + (sy * 0.35) + 'px)';
  if (ctaBg) {
    var rect = ctaBg.closest('#cta-video').getBoundingClientRect();
    ctaBg.style.transform = 'translateY(' + (-(rect.top * 0.25)) + 'px)';
  }
}, { passive: true });

/* AOS */
var aosObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return;
    var delay = parseInt(e.target.dataset.delay || '0');
    setTimeout(function() { e.target.classList.add('aos-visible'); }, delay);
    aosObs.unobserve(e.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('[data-aos]').forEach(function(el) { aosObs.observe(el); });

/* Counters */
var cntObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return;
    var el = e.target;
    var target = parseInt(el.dataset.target);
    var cur = 0;
    var step = Math.ceil(target / 50);
    var timer = setInterval(function() {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(timer);
    }, 28);
    cntObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(function(el) { cntObs.observe(el); });

/* Menu filters + search */
var menuGrid   = document.getElementById('menuGrid');
var menuSearch = document.getElementById('menuSearch');
var menuEmpty  = document.getElementById('menuEmpty');
var activeCat  = 'all';

function filterMenu() {
  var q = menuSearch.value.toLowerCase().trim();
  var count = 0;
  menuGrid.querySelectorAll('.menu-card').forEach(function(card) {
    var catOk    = activeCat === 'all' || card.dataset.cat === activeCat;
    var searchOk = !q || card.dataset.name.toLowerCase().includes(q) || card.dataset.desc.toLowerCase().includes(q);
    card.classList.toggle('hidden', !(catOk && searchOk));
    if (catOk && searchOk) count++;
  });
  menuEmpty.classList.toggle('hidden', count > 0);
}

document.querySelectorAll('.mf-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.mf-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    activeCat = btn.dataset.cat;
    filterMenu();
  });
});
menuSearch.addEventListener('input', filterMenu);

/* Menu modal */
var modal        = document.getElementById('menuModal');
var modalClose   = document.getElementById('modalClose');
var modalOverlay = document.getElementById('modalOverlay');
var modalImg     = document.getElementById('modalImg');
var modalName    = document.getElementById('modalName');
var modalDesc    = document.getElementById('modalDesc');
var modalPrice   = document.getElementById('modalPrice');
var modalOrder   = document.getElementById('modalOrder');

menuGrid.querySelectorAll('.menu-card').forEach(function(card) {
  card.addEventListener('click', function() {
    modalImg.src           = card.dataset.img;
    modalImg.alt           = card.dataset.name;
    modalName.textContent  = card.dataset.name;
    modalDesc.textContent  = card.dataset.desc;
    modalPrice.textContent = card.dataset.price;
    modalOrder.href        = 'https://wa.me/5564992025560?text=Ola!%20Gostaria%20de%20pedir%3A%20' + encodeURIComponent(card.dataset.name);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

/* Lightbox */
var lightbox    = document.getElementById('lightbox');
var lbImg       = document.getElementById('lbImg');
var lbClose     = document.getElementById('lbClose');
var lbPrev      = document.getElementById('lbPrev');
var lbNext      = document.getElementById('lbNext');
var galleryImgs = Array.from(document.querySelectorAll('.mg-item img'));
var lbIndex     = 0;

function openLightbox(idx) {
  lbIndex   = idx;
  lbImg.src = galleryImgs[idx].src.replace('w=600', 'w=1200');
  lbImg.alt = galleryImgs[idx].alt;
  lightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.add('hidden');
  document.body.style.overflow = '';
}
galleryImgs.forEach(function(img, i) {
  img.parentElement.addEventListener('click', function() { openLightbox(i); });
});
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
lbPrev.addEventListener('click', function(e) { e.stopPropagation(); openLightbox((lbIndex - 1 + galleryImgs.length) % galleryImgs.length); });
lbNext.addEventListener('click', function(e) { e.stopPropagation(); openLightbox((lbIndex + 1) % galleryImgs.length); });
document.addEventListener('keydown', function(e) {
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  lbPrev.click();
  if (e.key === 'ArrowRight') lbNext.click();
});

/* Carousel */
var carTrack = document.getElementById('carTrack');
var carPrev  = document.getElementById('carPrev');
var carNext  = document.getElementById('carNext');
var carDots  = document.getElementById('carDots');
var reviews  = document.querySelectorAll('.review-card');
var carIdx   = 0;
var autoTmr  = null;

function getPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function buildDots() {
  var total = Math.ceil(reviews.length / getPerView());
  carDots.innerHTML = '';
  for (var i = 0; i < total; i++) {
    (function(idx) {
      var dot = document.createElement('button');
      dot.className = 'car-dot' + (idx === carIdx ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (idx + 1));
      dot.addEventListener('click', function() { goTo(idx); resetAuto(); });
      carDots.appendChild(dot);
    })(i);
  }
}

function goTo(idx) {
  var pv    = getPerView();
  var total = Math.ceil(reviews.length / pv);
  carIdx    = ((idx % total) + total) % total;
  var w     = reviews[0].offsetWidth + 24;
  carTrack.style.transform = 'translateX(-' + (carIdx * pv * w) + 'px)';
  document.querySelectorAll('.car-dot').forEach(function(d, i) {
    d.classList.toggle('active', i === carIdx);
  });
}

function resetAuto() {
  clearInterval(autoTmr);
  autoTmr = setInterval(function() { goTo(carIdx + 1); }, 4500);
}

carPrev.addEventListener('click', function() { goTo(carIdx - 1); resetAuto(); });
carNext.addEventListener('click', function() { goTo(carIdx + 1); resetAuto(); });
document.getElementById('carousel').addEventListener('mouseenter', function() { clearInterval(autoTmr); });
document.getElementById('carousel').addEventListener('mouseleave', resetAuto);
window.addEventListener('resize', function() { buildDots(); goTo(0); }, { passive: true });

buildDots();
goTo(0);
resetAuto();

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* Active nav */
var secObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return;
    navLinks.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.style.color = a.getAttribute('href') === '#' + e.target.id ? 'var(--gold)' : '';
    });
  });
}, { threshold: 0.4 });
document.querySelectorAll('section[id]').forEach(function(s) { secObs.observe(s); });
