const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
document.body.classList.add('has-menu');

function setMenu(open) {
  navigation.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});

const photoDialog = document.querySelector('#fotoansicht');
if (photoDialog) {
  const photo = photoDialog.querySelector('img');
  document.querySelectorAll('.gallery a').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      photo.src = link.href;
      photo.alt = link.querySelector('img').alt;
      photoDialog.showModal();
    });
  });
}

const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const viewport = carousel.querySelector('.carousel-viewport');
  const controls = carousel.querySelector('.carousel-controls');
  const count = carousel.querySelectorAll('.carousel-slide').length;
  const status = carousel.querySelector('.carousel-status');
  let current = -1;

  function syncSlide() {
    const index = Math.round(viewport.scrollLeft / viewport.clientWidth);
    if (!Number.isFinite(index) || index === current) return;
    current = index;
    status.textContent = (current + 1) + ' von ' + count;
  }

  function moveSlide(step) {
    const next = (current + step + count) % count;
    viewport.scrollTo({ left: next * viewport.clientWidth, behavior: 'instant' });
    syncSlide();
  }

  controls.hidden = false;
  viewport.dataset.enhanced = '';
  syncSlide();
  viewport.addEventListener('scroll', syncSlide, { passive: true });
  controls.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => moveSlide(Number(button.dataset.step)));
  });
  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    moveSlide(event.key === 'ArrowLeft' ? -1 : 1);
  });
}

const villageMap = document.querySelector('.village-map');
if (villageMap) {
  const pins = [...villageMap.querySelectorAll('.map-pin')];
  const info = villageMap.querySelector('.map-places');
  const places = [...info.querySelectorAll('section')];

  function selectPlace(pin) {
    pins.forEach(marker => {
      if (marker === pin) marker.setAttribute('aria-current', 'location');
      else marker.removeAttribute('aria-current');
    });
    places.forEach(place => {
      place.hidden = '#' + place.id !== pin.hash;
    });
  }

  info.dataset.enhanced = '';
  selectPlace(pins.find(pin => pin.hash === location.hash) ?? pins[0]);
  pins.forEach(pin => pin.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    selectPlace(pin);
  }));
}
