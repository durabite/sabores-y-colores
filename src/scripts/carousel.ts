// Carousel logic: auto-rotation, navigation controls, accessible states, touch gestures
export function initCarousel() {
  const root = document.querySelector<HTMLElement>('.hero-carousel');
  if (!root) return;

  const slides = [...root.querySelectorAll<HTMLElement>('.hero-slide')];
  const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-slide]')];
  const pause = root.querySelector<HTMLButtonElement>('.carousel-pause');
  const count = root.querySelector<HTMLElement>('.carousel-count');
  const status = root.querySelector<HTMLElement>('.carousel-status');

  if (!pause || !count || !status) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const names = ['El estudio', 'Web Esencial', '10% de descuento'];

  let current = 0;
  let userPaused = reduced.matches;
  let hovered = false;
  let visible = true;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let startX: number | null = null;
  let startY: number | null = null;

  function stop() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function schedule() {
    stop();
    if (!userPaused && !hovered && visible && !document.hidden) {
      timer = setTimeout(() => show(current + 1, false), 8500);
    }
  }

  function syncPause() {
    pause!.setAttribute('aria-pressed', String(userPaused));
    pause!.setAttribute(
      'aria-label',
      userPaused ? 'Activar rotación automática' : 'Pausar rotación automática'
    );
    pause!.innerHTML = userPaused
      ? '▶ <span>Reproducir slides</span>'
      : 'Ⅱ <span>Pausar slides</span>';
    status!.setAttribute('aria-live', userPaused ? 'polite' : 'off');
  }

  function show(index: number, manual = true) {
    current = (index + slides.length) % slides.length;
    if (manual) userPaused = true;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.hidden = !active;
      slide.inert = !active;
      slide.classList.toggle('is-entering', active);
    });
    dots.forEach((dot, i) => {
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    count!.innerHTML = `0${current + 1} <span>/ 03</span>`;
    syncPause();
    status!.textContent = `Slide ${current + 1} de 3: ${names[current]}`;
    schedule();
    window.dispatchEvent(new Event('scroll'));
  }

  root.querySelector('.carousel-prev')?.addEventListener('click', () => show(current - 1));
  root.querySelector('.carousel-next')?.addEventListener('click', () => show(current + 1));
  dots.forEach((dot) =>
    dot.addEventListener('click', () => show(Number(dot.dataset.slide)))
  );

  pause.addEventListener('click', () => {
    userPaused = !userPaused;
    syncPause();
    schedule();
  });

  root.addEventListener('mouseenter', () => {
    hovered = true;
    stop();
  });
  root.addEventListener('mouseleave', () => {
    hovered = false;
    schedule();
  });

  root.addEventListener('focusin', (event) => {
    if (event.target === pause) return;
    userPaused = true;
    syncPause();
    stop();
  });

  root.addEventListener('keydown', (event) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement).tagName))
      return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  const heroSlides = root.querySelector<HTMLElement>('.hero-slides');
  if (heroSlides) {
    heroSlides.addEventListener(
      'touchstart',
      (event) => {
        startX = event.changedTouches[0].clientX;
        startY = event.changedTouches[0].clientY;
        stop();
      },
      { passive: true }
    );

    heroSlides.addEventListener(
      'touchend',
      (event) => {
        if (startX === null) return;
        const dx = event.changedTouches[0].clientX - startX;
        const dy = event.changedTouches[0].clientY - (startY || 0);
        startX = null;
        if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.4) {
          show(current + (dx < 0 ? 1 : -1));
        } else {
          schedule();
        }
      },
      { passive: true }
    );
  }

  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => {
    if (reduced.matches) userPaused = true;
    syncPause();
    schedule();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        schedule();
      },
      { threshold: 0.05 }
    ).observe(root);
  }

  syncPause();
  schedule();
}
